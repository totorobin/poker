import {Server, type ServerOptions} from 'socket.io'
import type {Server as HTTPSServer} from 'https'
import type {Http2SecureServer} from 'http2'
import type * as http from 'http'
import {SUser} from './user'
import {RoomStore} from './roomStore'
import {type ClientToServerEvents, Notification, type ServerToClientEvents, type User} from '../../shared/data-model'

const rooms = new RoomStore()

const restrictedEvents = ['timer', 'cardVisible', 'reset', 'updateSettings']

export class IoServer {
  io: Server<ClientToServerEvents, ServerToClientEvents, any, User>

  constructor(
    srv: undefined | Partial<ServerOptions> | http.Server | HTTPSServer | Http2SecureServer | number,
    opts?: Partial<ServerOptions>
  ) {
    this.io = new Server<ClientToServerEvents, ServerToClientEvents, any, User>(srv, opts)

    this.io.use((socket, next) => {
      const uuid: string = socket.handshake.auth.uuid
      socket.data = new SUser(uuid)
      console.log("connection d'un utilisateur :", socket.data)
      next()
    })

    this.io.on('connection', (socket) => {
      // control l'accès au actions réservés
      socket.use(([event, ...args], next) => {
        if (restrictedEvents.includes(event)) {
          try {
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
      })

      socket.on('whoAmI', (callback) => {
        callback(socket.data)
      })

      socket.on('setUserName', (name) => {
        const oldName = socket.data.name
        socket.data.name = name
        try {
          const roomId = rooms.getCurrentRoomId(socket)
          rooms.get(roomId).users[socket.data.uuid].name = name
          this.io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
          socket.to(roomId).emit('notify', {type: Notification.nameChange, values: {oldName, name}}) // inform action
        } catch (err) {
          if ((err as Error).message !== 'no_current_room') {
            console.log('set user name', err)
          }
        }
      })

      socket.on('create', async (callback) => {
        const roomId = rooms.generateRoomId()
        console.log(`new room for ${socket.data.name} : ${roomId}`)
        /* eslint-disable-next-line n/no-callback-literal */
        callback({roomId})
        await socket.join(roomId)
      })

      socket.on('join', async ({ roomId }) => {
        await socket.join(roomId.toLowerCase())
      })

      socket.on('vote', ({ value }) => {
        try {
          const roomId = rooms.getCurrentRoomId(socket)
          const voteCreated = rooms.get(roomId).setVote(socket.data, value)
          this.io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
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
      })
      socket.on('cardVisible', (value) => {
        try {
          const roomId = rooms.getCurrentRoomId(socket)
          rooms.get(roomId).showCards(value)
          this.io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
          socket.to(roomId).emit('notify', {
            type: value ? Notification.show : Notification.hide,
            values: socket.data as unknown as Record<string, string>
          }) // inform action
        } catch (err) {
          console.log(err)
        }
      })
      socket.on('reset', () => {
        try {
          const roomId = rooms.getCurrentRoomId(socket)
          rooms.get(roomId).reset()
          this.io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
          socket
              .to(roomId)
              .emit('notify', {type: Notification.reset, values: socket.data as unknown as Record<string, string>}) // inform a
        } catch (err) {
          console.log(err)
        }
      })
      socket.on('leave', async ({ roomId }, callback) => {
        console.log(`${socket.id} is leaving room ${roomId}`)

        try {
          // return all Socket instances in the "room1" room of the main namespace
          const sockets = await this.io.in(roomId).fetchSockets()
          if (!sockets.some((sock) => sock.data.uuid === socket.data.uuid && sock.id !== socket.id)) {
            console.log(`remove ${socket.data.name} from ${roomId}`)
            rooms.get(roomId).removePlayer(socket.data)
            this.io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
            this.io.to(roomId).emit('notify', {
              type: Notification.leftRoom,
              values: socket.data as unknown as Record<string, string>
            })
          }
        } catch (err) {
          console.log('leave', err)
        }
        await socket.leave(roomId)
        callback(socket.data)
      })

      socket.on('timer', ({ endTime }) => {
        try {
          const roomId = rooms.getCurrentRoomId(socket)
          rooms.get(roomId).endTimer = endTime
          this.io.to(roomId).emit('roomState', rooms.get(roomId))
          console.log('room ', roomId, ' timer ', rooms.get(roomId).endTimer)
        } catch (err) {
          console.log(err)
        }
      })
      socket.on('updateSettings', (props) => {
        console.log('update room ', props)
        try {
          const roomId = rooms.getCurrentRoomId(socket)
          rooms.get(roomId).init(props)
          console.log(rooms.get(roomId))
          this.io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
        } catch (err) {
          console.log(err)
        }
      })

      socket.on('disconnecting', async (reason) => {
        try {
          const roomId = rooms.getCurrentRoomId(socket)
          // return all Socket instances in the "room1" room of the main namespace
          const sockets = await this.io.in(roomId).fetchSockets()
          if (!sockets.some((sock) => sock.data.uuid === socket.data.uuid && sock.id !== socket.id)) {
            console.log(`remove ${socket.data.name} from ${roomId}`)
            rooms.get(roomId).removePlayer(socket.data)
            this.io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
            this.io.to(roomId).emit('notify', {
              type: Notification.leftRoom,
              values: socket.data as unknown as Record<string, string>
            })
          }
        } catch (err) {
          if ((err as Error).message !== 'no_current_room') {
            console.log('disconnecting', err)
          }
        }
      })
    })

    this.io.of('/').adapter.on('create-room', (roomId: string) => {
      console.log(`creating room ${roomId}`)
      rooms.addRoom(roomId)
    })

    this.io.of('/').adapter.on('join-room', (roomId: string, userId: string) => {
      if (roomId === userId) {
        console.log(`deleting room ${roomId} as it is only a user room`)
        rooms.removeRoom(roomId)
        return // ignore user room
      }
      this.io
        .in(userId)
        .fetchSockets()
        .then((sockets) => sockets[0])
        .then((socket) => {
          rooms.get(roomId).addPlayer(socket.data)
          this.io.to(roomId).emit('roomState', rooms.get(roomId)) // emit new state
          this.io.to(roomId).emit('notify', {
            type: Notification.joinedRoom,
            values: socket.data as unknown as Record<string, string>
          }) // inform action
        })
        .catch((err) => {
          console.log('adapter join room', err)
        })
    })

    this.io.of('/').adapter.on('delete-room', (roomId: string) => {
      try {
        rooms.removeRoom(roomId)
      } catch (err) {
        console.log('adapter delete-room', err)
      }
    })

    this.io.of('/').adapter.on('leave-room', (roomId: string, userId: string) => {
      console.log(`user ${userId} has left room ${roomId}`)
    })
  }
}
