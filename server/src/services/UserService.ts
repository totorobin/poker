import {RoomStore} from "../roomStore";
import {Server, Socket} from "socket.io";
import {ClientToServerEvents, Notification, ServerToClientEvents, User} from "../../../shared/data-model";
import {SUser} from "../user";
import {Event} from "socket.io/dist/socket";


export default function (rooms: RoomStore, io: Server<ClientToServerEvents, ServerToClientEvents, any, User>) {
    return {
        socketMiddleware: async function (socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User>, next: (err?: Error) => void) {
            const uuid: string = socket.handshake.auth.uuid
            socket.data = new SUser(uuid)
            console.log("connection d'un utilisateur :", socket.data)
            next()
        },
        middleware: async function (event: Event, next: (err?: Error) => void) {
            console.log("before", event)
            next()
            console.log("after", event)
        },
        whoAmI: async function (callback: (me: User) => void) {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            callback(socket.data)
        },
        setUserName: async function (name: string) {
            // @ts-ignore
            const socket: Socket<ClientToServerEvents, ServerToClientEvents, any, User> = this;
            const oldName = socket.data.name
            socket.data.name = name
            try {
                const roomId = rooms.getCurrentRoomId(socket)
                rooms.get(roomId).users[socket.data.uuid].name = name
                io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
                socket.to(roomId).emit('notify', {type: Notification.nameChange, values: {oldName, name}}) // inform action
            } catch (err) {
                if ((err as Error).message !== 'no_current_room') {
                    console.log('set user name', err)
                }
            }
        },

    }
}