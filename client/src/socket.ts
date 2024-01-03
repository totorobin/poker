import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import type { ServerToClientEvents, ClientToServerEvents } from '@shared/data-model'

if (localStorage.getItem('uuid') == null) {
  localStorage.setItem('uuid', uuidv4())
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
  auth: {
    uuid: localStorage.getItem('uuid')
  }
})
