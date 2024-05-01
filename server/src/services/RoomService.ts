import {Server, Socket} from 'socket.io'
import {ClientToServerEvents, Notification, Room, ServerToClientEvents, User} from '../../../shared/data-model'
import {RoomStore} from "../roomStore";
import {Event} from "socket.io/dist/socket";

const restrictedEvents = ['timer', 'cardVisible', 'reset', 'updateSettings']

export default function (rooms: RoomStore, io: Server<ClientToServerEvents, ServerToClientEvents, any, User>) {
    return {
        socketMiddleware: async function (socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User>, next: (err?: Error) => void) {
            console.log("socketMiddleware before", socket.data)
            next()
            console.log("socketMiddleware after", socket.data)
        },
        middleware: (socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User>) => async function (event: Event, next: (err?: Error) => void) {
            console.log("before", event)
            const [action, ...args] = event
            // @ts-ignore
            if (restrictedEvents.includes(action)) {
                try {
                    console.log(socket.rooms)
                    const roomId = rooms.getCurrentRoomId(socket)
                    if (!rooms.get(roomId).actionsAllowed(socket.data.uuid)) {
                        console.log(`user ${socket.data.name} tried to do something unauthorized`)
                        socket.to(roomId).emit('notify', {
                            type: Notification.cheated,
                            values: socket.data as unknown as Record<string, string>
                        })
                        next(new Error('unauthorized event'))
                        return
                    }
                } catch (err) {
                    console.log(err)
                    next(new Error('unauthorized event'))
                    return
                }
            }
            next()
            console.log("after", event)
        },
        create: async function (callback: (res: { roomId: string }) => void) {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            const roomId = rooms.generateRoomId()
            console.log(`new room for ${socket.data.name} : ${roomId}`)
            /* eslint-disable-next-line n/no-callback-literal */
            callback({roomId})
            await socket.join(roomId)
        },
        join: async function (args: { roomId: string }) {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            await socket.join(args.roomId.toLowerCase())
            console.log(socket.rooms)
        },
        vote: async function (args: { value: string | null }) {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            try {
                const roomId = rooms.getCurrentRoomId(socket)
                const voteCreated = rooms.get(roomId).setVote(socket.data, args.value)
                io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
                if (voteCreated) {
                    socket.to(roomId).emit('notify', {
                        type: rooms.get(roomId).voteDone() ? Notification.voteDone : Notification.vote,
                        values: socket.data as unknown as Record<string, string>
                    })
                } // inform action
            } catch (err) {
                if ((err as Error).message === 'VOTE_NOT_ALLOWED') {
                    socket.emit('notify', {
                        type: Notification.voteBlocked,
                        values: socket.data as unknown as Record<string, string>
                    })
                }
                console.log(err)
            }
        },
        cardVisible: async function (value: boolean) {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            try {
                const roomId = rooms.getCurrentRoomId(socket)
                rooms.get(roomId).showCards(value)
                io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
                socket.to(roomId).emit('notify', {
                    type: value ? Notification.show : Notification.hide,
                    values: socket.data as unknown as Record<string, string>
                }) // inform action
            } catch (err) {
                console.log(err)
            }
        },
        reset: async function () {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            try {
                const roomId = rooms.getCurrentRoomId(socket)
                rooms.get(roomId).reset()
                io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
                socket
                    .to(roomId)
                    .emit('notify', {
                        type: Notification.reset,
                        values: socket.data as unknown as Record<string, string>
                    }) // inform a
            } catch (err) {
                console.log(err)
            }
        },
        leave: async function (args: { roomId: string }, callback: (e: User) => void) {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            console.log(`${socket.id} is leaving room ${args.roomId}`)

            try {
                // return all Socket instances in the "room1" room of the main namespace
                const sockets = await io.in(args.roomId).fetchSockets()
                if (!sockets.some((sock) => sock.data.uuid === socket.data.uuid && sock.id !== socket.id)) {
                    console.log(`remove ${socket.data.name} from ${args.roomId}`)
                    rooms.get(args.roomId).removePlayer(socket.data)
                    io.to(args.roomId).emit('roomState', rooms.get(args.roomId)) // emit new state
                    io.to(args.roomId).emit('notify', {
                        type: Notification.leftRoom,
                        values: socket.data as unknown as Record<string, string>
                    })
                }
            } catch (err) {
                console.log('leave', err)
            }
            await socket.leave(args.roomId)
            callback(socket.data)
        },
        timer: async function (args: { endTime: number }) {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            try {
                const roomId = rooms.getCurrentRoomId(socket)
                rooms.get(roomId).endTimer = args.endTime
                io.to(roomId).emit('roomState', rooms.get(roomId))
                console.log('room ', roomId, ' timer ', rooms.get(roomId).endTimer)
            } catch (err) {
                console.log(err)
            }
        },
        updateSettings: async function (props: Room) {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            console.log('update room ', props)
            try {
                const roomId = rooms.getCurrentRoomId(socket)
                rooms.get(roomId).init(props)
                console.log(rooms.get(roomId))
                io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
            } catch (err) {
                console.log(err)
            }

        },
        disconnecting: async function () {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            try {
                const roomId = rooms.getCurrentRoomId(socket)
                // return all Socket instances in the "room1" room of the main namespace
                const sockets = await io.in(roomId).fetchSockets()
                if (!sockets.some((sock) => sock.data.uuid === socket.data.uuid && sock.id !== socket.id)) {
                    console.log(`remove ${socket.data.name} from ${roomId}`)
                    rooms.get(roomId).removePlayer(socket.data)
                    io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
                    io.to(roomId).emit('notify', {
                        type: Notification.leftRoom,
                        values: socket.data as unknown as Record<string, string>
                    })
                }
            } catch (err) {
                if ((err as Error).message !== 'no_current_room') {
                    console.log('disconnecting', err)
                }
            }
        },
        createRoom: function (roomId: string) {
            console.log(`creating room ${roomId}`)
            rooms.addRoom(roomId)
        },
        joinRoom: function (roomId: string, userId: string) {
            if (roomId === userId) {
                console.log(`deleting room ${roomId} as it is only a user room`)
                rooms.removeRoom(roomId)
                return // ignore user room
            }
            io
                .in(userId)
                .fetchSockets()
                .then((sockets) => sockets[0])
                .then((socket) => {
                    rooms.get(roomId).addPlayer(socket.data)
                    io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
                    io.to(roomId).emit('notify', {
                        type: Notification.joinedRoom,
                        values: socket.data as unknown as Record<string, string>
                    }) // inform action
                })
                .catch((err) => {
                    console.log('adapter join room', err)
                })
        },
        deleteRoom: function (roomId: string) {
            try {
                rooms.removeRoom(roomId)
            } catch (err) {
                console.log('adapter delete-room', err)
            }
        },
        leaveRoom: function (roomId: string, userId: string) {
            console.log(`user ${userId} has left room ${roomId}`)
        }
    }
}
