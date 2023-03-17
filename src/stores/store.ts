import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { io } from "socket.io-client";

interface User {
  id: string
  name: string
  card: string | null
}

interface Room {
  id: string
  name: string
  users: { [key: string]: User }
  cardVisible: boolean
}

const socket = io();


const userName = ref(localStorage.getItem('userName'))

socket.on("connect", () => {
  console.log(`connected to websocket with id ${socket.id}`);

  if(userName.value) {
    socket.emit('setUserName', userName.value)
  } else {
    socket.emit('whoAmI', (data: {userName: string}) => {
      userName.value = data.userName
    })
  }
});

socket.on("disconnect", () => {
  console.error('Socket is closed ')
  ElMessage('Websocket has closed, the page will be refresh to attempt reconnection in 3 second.')
  setTimeout(function () {
    window.location.reload()
  }, 3000)
})



export const useRoomStore = defineStore('store', () => {
  const room = ref({} as Room)

  function setUser(name: string) {
    userName.value = name
    socket.emit('setUserName',name)
    localStorage.setItem('userName', name)
  }


  const users = computed(() =>
    !room.value.users
      ? []
      : Object.values(room.value.users).map((user: User) => {
          if (user.id === socket.id) {
            return { name: user.name, card: user.card }
          } else {
            if (room.value.cardVisible) {
              return { name: user.name, card: user.card  }
            } else {
              return { name: user.name, card: user.card ? '?' : null }
            }
          }
        })
  )
  const selectedCard = computed(() =>
    !room.value.users ? '' : room.value.users[socket.id].card
  )

  socket.on('roomState', (roomState) => {
    room.value = roomState
  })
  socket.on('nameChange', ({oldName, newName}) => {
    ElMessage(`${oldName} is now called ${newName}`)
  })
  socket.on('vote', ({name, done}) => {
    if(done) {
      ElMessage(`Everyone has voted`)
    } else {
      ElMessage(`${name} has voted`)
    }
  })
  socket.on('reset', ({name}) => {ElMessage(`${name} has reset the room`)})
  socket.on('left', ({name}) => {ElMessage(`${name} is gone`)})
  socket.on('joined', ({name}) => {ElMessage(`${name} just joined`)})
  socket.on('visibility', ({name, state}) => {
    if(state) {
      ElMessage(`${name} just showed everyone cards`)
    } else {
      ElMessage(`${name} just hidden everyone cards`)
    }
  })
  //socket.on('', ({name}) => {ElMessage(`${name}`)})

  async function createRoom() {
    socket.emit('create', (response: { roomId: string}) => {
      console.log(response)
      localStorage.setItem('roomId', response.roomId )
    })
  }

  async function joinRoom(roomId: string) {
    localStorage.setItem('roomId', roomId)
    socket.emit('join', {roomId})
  }

  async function vote(cardValue: string | null) {
    socket.emit('vote', {value: cardValue} )
  }

  async function show() {
    socket.emit('cardVisible', true)
   }
  async function hide() {
    socket.emit('cardVisible', false)
  }
  async function reset() {
    socket.emit('reset')
  }

  async function leave() {
    if(room.value.id)
    socket.emit('leave', {roomId: room.value.id}, (newRoom: Room) => {
      room.value = newRoom
    })
    
  }

  return {
    room,
    joinRoom,
    createRoom,
    vote,
    show,
    hide,
    reset,
    users,
    selectedCard,
    leave,
    setUser,
    userName
  }
})
