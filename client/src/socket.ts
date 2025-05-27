import {io, type Socket} from 'socket.io-client'
import {v4 as uuidv4} from 'uuid'
import type {ClientToServerEvents, ServerToClientEvents} from '@shared/data-model'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
  auth: (cb) => {
    if (localStorage.getItem('uuid') === null) {
      localStorage.setItem('uuid', uuidv4())
    }
    cb({uuid: localStorage.getItem('uuid')})
  }
})
