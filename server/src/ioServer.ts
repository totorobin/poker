import {Server, type ServerOptions} from "socket.io";
import type {Server as HTTPSServer} from "https";
import type { Http2SecureServer } from "http2";
import type * as http from "http";
import { Room } from "./room";
import {RoomStore} from "./roomStore";
import {User} from "./user";



const rooms = new RoomStore()

enum Notification {
    nameChange = "name-changed",
    vote = "vote",
    voteDone = "vote-done",
    voteBlocked = 'vote-blocked',
    show = "show",
    hide= "hide",
    reset= "reset",
    leftRoom= "left",
    joinedRoom= "join",
    cheated = "cheated"
}
interface StCEvents {
    notify : (args: { type: Notification, values: Record<string, string>}) => void
    roomState: (room: Room) => void
}

interface CtSEvents {
    whoAIm : ( callback : (me : User) => void) => void
    setUserUUID : (uuid : string) => void
    setUserName: (name: string) => void
    create: ( callback : (roomId : string) => void) => void
    join: (args : { roomId : string } ) => void
    vote: (args: {value : string }) => void
    cardVisible: (value : boolean) => void
    reset: () => void
    leave: (args :{roomId : string}, callback: (e : User) => void) => void
}

const restrictedEvents = ['timer', 'cardVisible', 'reset', 'updateSettings' ]

export class ioServer {

    io: Server

    constructor(srv: undefined | Partial<ServerOptions> | http.Server | HTTPSServer | Http2SecureServer | number, opts?: Partial<ServerOptions>) {

        this.io = new Server<CtSEvents,StCEvents,any,User>(srv, opts)

        this.io.use((socket, next) => {
            const uuid = socket.handshake.auth.uuid
            socket.data = new User(uuid)
            console.log("connection d'un utilisateur :", socket.data)
            next()
        })

        this.io.on('connection', (socket) => {

            // control l'accès au actions réservés
            socket.use(([event, ...args], next) => {
                if(restrictedEvents.includes(event)) {
                    try {
                        let roomId = rooms.getCurrentRoomId(socket)
                        if(!rooms.get(roomId).actionsAllowed(socket.data.uuid)) {
                            console.log(`user ${socket.data.name} tried to do something unauthorized`)
                            socket.to(roomId).emit('notify', { type : Notification.cheated , values : socket.data })
                            return next(new Error("unauthorized event"));
                        }
                    } catch (err) {
                        console.log(err)
                        return next(new Error("unauthorized event"));
                    }
                }
                next();
            });

            socket.on('whoAmI', (callback) => {
                callback(socket.data)
            })

            socket.on('setUserName', (name) => {
                let oldName = socket.data.name
                socket.data.name = name
                try {
                    let roomId = rooms.getCurrentRoomId(socket)
                    rooms.get(roomId).users[socket.data.uuid].name = name
                    this.io.to(roomId).emit('roomState', rooms.get(roomId))  // emit new state
                    socket.to(roomId).emit('notify', { type : Notification.nameChange , values : {oldName, name}})  // inform action
                } catch (err) {
                    console.log(err)
                }
            })

            socket.on('create', (callback) => {
                const roomId = rooms.generateRoomId()
                console.log(`new room for ${socket.data.name} : ${roomId}`)
                callback({roomId})
                socket.join(roomId)
            })

            socket.on('join', ({roomId}) => {
                socket.join(roomId.toLowerCase())
            })

            socket.on('vote', ({value}) => {
                try  {
                    const roomId = rooms.getCurrentRoomId(socket)
                    const voteCreated = rooms.get(roomId).setVote(socket.data, value)
                    this.io.to(roomId).emit('roomState', rooms.get(roomId))  // emit new state
                    if(voteCreated)
                        socket.to(roomId).emit('notify' , { type : rooms.get(roomId).voteDone() ? Notification.voteDone : Notification.vote, values : socket.data })   // inform action
                } catch (err) {
                    if('VOTE_NOT_ALLOWED' === err )
                        socket.emit('notify', { type : Notification.voteBlocked, values : socket.data })
                    console.log(err)
                }
            })
            socket.on('cardVisible', (value) => {
                try  {
                    const roomId = rooms.getCurrentRoomId(socket)
                    rooms.get(roomId).showCards(value)
                    this.io.to(roomId).emit('roomState', rooms.get(roomId))  // emit new state
                    socket.to(roomId).emit('notify', { type: value ? Notification.show : Notification.hide, values: socket.data})  // inform action
                 } catch (err) {
                    console.log(err)
                }
            })
            socket.on('reset', () => {
                try  {
                    const roomId = rooms.getCurrentRoomId(socket)
                    rooms.get(roomId).reset()
                    this.io.to(roomId).emit('roomState', rooms.get(roomId))  // emit new state
                    socket.to(roomId).emit('notify', { type: Notification.reset, values: socket.data })  // inform a
                } catch (err) {
                    console.log(err)
                }
            })
            socket.on('leave', ({roomId}, callback) => {
                console.log(`${socket.data.name} is leaving room ${roomId}`);
                socket.leave(roomId)
                callback({})
            })

            socket.on('timer', ({ endTime }) => {
                try  {
                    const roomId = rooms.getCurrentRoomId(socket)
                    rooms.get(roomId).endTimer = endTime
                    this.io.to(roomId).emit('roomState', rooms.get(roomId))
                    console.log('room ', roomId, ' timer ', rooms.get(roomId).endTimer)
                } catch (err) {
                    console.log(err)
                }
            })
            socket.on('updateSettings', (props:Room) => {
                console.log('update room ', props)
                try  {
                    const roomId = rooms.getCurrentRoomId(socket)
                    rooms.get(roomId).init(props)
                    console.log(rooms.get(roomId))
                    this.io.to(roomId).emit('roomState', rooms.get(roomId))  // emit new state
                } catch (err) {
                    console.log(err)
                }
            })
        });

        this.io.of("/").adapter.on("create-room", (roomId) => {
            console.log(`creating room ${roomId}`);
            rooms.addRoom(roomId)
        });

        this.io.of("/").adapter.on("join-room", async (roomId, userId) => {
            if(roomId === userId) {
                console.log(`deleting room ${roomId} as it is only a user room`);
                rooms.removeRoom(roomId)
                return  // ignore user room
            }
            const socket = (await this.io.in(userId).fetchSockets())[0];
            rooms.get(roomId).addPlayer(socket.data)
            this.io.to(roomId).emit('roomState',rooms.get(roomId))  // emit new state
            this.io.to(roomId).emit('notify', { type: Notification.joinedRoom, values: socket.data }) // inform action

        });

        this.io.of("/").adapter.on("delete-room", (roomId) => {
            try {
                rooms.removeRoom(roomId)
                console.log(`room ${roomId} was deleted`);
                console.log(`current rooms: ${Object.keys(rooms).length}`)
            } catch (err) {
                console.log(err)
            }
        });

        this.io.of("/").adapter.on("leave-room", async (roomId, userId) => {
            console.log(`user ${userId} has left room ${roomId}`);
            try {
                const socket = (await this.io.in(userId).fetchSockets())[0];
                console.log(`remove ${socket.data.name} from ${roomId}`)
                rooms.get(roomId).removePlayer(socket.data)
                this.io.to(roomId).emit('roomState',rooms.get(roomId))  // emit new state
                this.io.to(roomId).emit('notify', { type: Notification.leftRoom, values: socket.data })
            } catch (err) {
                console.log(err)
            }
        });

    }



}
