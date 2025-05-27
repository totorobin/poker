import {io, type Socket} from 'socket.io-client'
import {v4 as uuidv4} from 'uuid'
import type {ClientToServerEvents, ServerToClientEvents} from '@shared/data-model'
import {useStorage} from "@vueuse/core";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
  auth: (cb) => {
    const uuid = useStorage('uuid', uuidv4())
    cb({uuid: uuid.value})
  }
})
