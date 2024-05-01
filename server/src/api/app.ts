import {Server as HttpServer} from "http";
import {Server, ServerOptions} from "socket.io";
import RoomService from "../services/RoomService";
import type {ClientToServerEvents, ServerToClientEvents, User} from "../../../shared/data-model";
import UserService from "../services/UserService";
import {RoomStore} from "../roomStore";

export function createApplication(
    httpServer: HttpServer,
    serverOptions: Partial<ServerOptions> = {}
): Server<ClientToServerEvents, ServerToClientEvents, any, User> {
    const io = new Server<ClientToServerEvents, ServerToClientEvents, any, User>(httpServer, serverOptions);
    const roomStore = new RoomStore()

    const {socketMiddleware, whoAmI, setUserName} = UserService(roomStore, io)
    const {
        middleware,
        create,
        join,
        vote,
        cardVisible,
        reset,
        leave,
        timer,
        updateSettings,
        disconnecting,
        leaveRoom,
        deleteRoom,
        createRoom,
        joinRoom
    } = RoomService(roomStore, io)

    io.use(socketMiddleware)

    io.on("connection", (socket) => {
        socket.use(middleware(socket))

        //User Event
        socket.on('whoAmI', whoAmI)
        socket.on('setUserName', setUserName)

        //Room Event
        socket.on('create', create)
        socket.on('join', join)
        socket.on('vote', vote)
        socket.on('cardVisible', cardVisible)
        socket.on('reset', reset)
        socket.on('leave', leave)
        socket.on('timer', timer)
        socket.on('updateSettings', updateSettings)
        socket.on('disconnecting', disconnecting)

    })

    io.of('/').adapter.on('create-room', createRoom)
    io.of('/').adapter.on('join-room', joinRoom)
    io.of('/').adapter.on('delete-room', deleteRoom)
    io.of('/').adapter.on('leave-room', leaveRoom)

    return io
}