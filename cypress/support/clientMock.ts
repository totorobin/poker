
// Socket.io client to allow Cypress itself
// to connect from the plugin file to the chat app
// to play the role of another user
// https://socket.io/docs/v4/client-initialization/
import { io } from 'socket.io-client'
import  { v4 as uuidv4 }  from 'uuid'

export function createClientMock(name?: string) {
    
  const uuid = uuidv4()
  const socket = io('http://localhost:8080')
  
  socket.emit('setUserUUID', uuid)

  if(name) {
    socket.emit('setUserName', name)
  }

  function join(roomId: string) {
    socket.emit('join', { roomId })
  }

  function leave(roomId: string) {
    socket.emit('leave', { roomId }, (newRoom: any) => {})
  }

  return {
    socket,
    join,
    leave
  }
}
