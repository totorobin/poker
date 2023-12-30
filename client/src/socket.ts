import { io } from "socket.io-client"
import {v4 as uuidv4} from "uuid"

if(localStorage.getItem('uuid') == null) {
    localStorage.setItem('uuid', uuidv4())
}

export const socket = io({
    autoConnect: false,
    auth: {
        uuid: localStorage.getItem('uuid')
    }
})

