import {io, type Socket} from 'socket.io-client'
import {v4 as uuidv4} from 'uuid'
import type {ClientToServerEvents, ServerToClientEvents} from '@shared/data-model'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
  auth: {
    uuid: localStorage.getItem('uuid') || uuidv4()
  }
})
