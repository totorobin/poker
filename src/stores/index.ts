import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { io } from 'socket.io-client'
import { i18n } from '@/locales'

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

const socket = io()

const firstConnection = ref(true)

const userName = ref(localStorage.getItem('userName'))
const userSaved = ref(localStorage.getItem('userName') !== null)

socket.on('connect', () => {
  console.log(`connected to websocket with id ${socket.id}`)
  if (!firstConnection.value) {
        ElMessage({
        message: i18n.t('notifications.websocket-reconnected'),
        grouping: true,
      })
  }
  if (userName.value) {
    socket.emit('setUserName', userName.value)
  } else {
    socket.emit('whoAmI', (data: { userName: string }) => {
      userName.value = data.userName
    })
  }
})

socket.on('disconnect', (reason) => {
  firstConnection.value = false
      ElMessage({
        message: i18n.t('notifications.websocket-disconnected'),
        grouping: true,
      })
  if (reason === "io server disconnect") {
    // the disconnection was initiated by the server, you need to reconnect manually
    setTimeout(() => socket.connect(), 3000)
  }
})

export const useRoomStore = defineStore('store', () => {
  const room = ref({} as Room)
  const time = ref(3600000)  // 1h en ms
  const nIntervId = ref(0)
  const timerRunning = computed(() => nIntervId.value !== 0)
  const endTimer = ref(false)

  function setUser(name: string) {
    userName.value = name
    userSaved.value = true
    socket.emit('setUserName', name)
    localStorage.setItem('userName', name)
  }

  const users = computed(() =>
    !room.value.users
      ? []
      : Object.values(room.value.users).map((user: User) => {
        if (user.id === socket.id) {
          return { name: user.name, card: user.card }
        } else if (room.value.cardVisible) {
          return { name: user.name, card: user.card }
        }
        return { name: user.name, card: user.card ? '?' : null }
      })
  )
  const selectedCard = computed(() => (!room.value.users ? '' : room.value.users[socket.id].card))

  socket.on('roomState', (roomState) => {
    room.value = roomState
  })
  socket.on('nameChange', ({ oldName, newName }) => {
        ElMessage({
        message: i18n.t('notifications.change-name', { oldName, newName }),
        grouping: true,
      })
  })
  socket.on('vote', ({ name, done }) => {
    if (done) {
          ElMessage({
        message: i18n.t('notifications.vote-done'),
        grouping: true,
      })
    } else {
          ElMessage({
        message: i18n.t('notifications.vote', { name }),
        grouping: true,
      })
    }
  })
  socket.on('reset', ({ name }) => {
        ElMessage({
        message: i18n.t('notifications.reset', { name }),
        grouping: true,
      })
  })
  socket.on('left', ({ name }) => {
        ElMessage({
        message: i18n.t('notifications.left', { name }),
        grouping: true,
      })
  })
  socket.on('joined', ({ name }) => {
        ElMessage({
        message: i18n.t('notifications.join', { name }),
        grouping: true,
      })
  })
  socket.on('visibility', ({ name, state }) => {
    if (state) {
          ElMessage({
        message: i18n.t('notifications.show', { name }),
        grouping: true,
      })
    } else {
          ElMessage({
        message: i18n.t('notifications.hide', { name }),
        grouping: true,
      })
    }
  })
  //socket.on('', ({name}) => {ElMessage(`${name}`)})

  socket.on('timer', ({ endTime }) => {
    nIntervId.value = setInterval(() => {
      time.value = endTime - Date.now()
      if (time.value < 1000) { // si moins d'1s
        clearInterval(nIntervId.value);
        nIntervId.value = 0
        endTimer.value = true
      }
    }, 1000)
  })

  socket.on('stopTimer', () => {
    clearInterval(nIntervId.value);
    nIntervId.value = 0
  })

  const stopTimer = () => {
    socket.emit('stopTimer')
  }

  const startTimer = (time: number) => { 
    socket.emit('timer', { endTime: Date.now() + time })
  }

  async function createRoom() {
    socket.emit('create', (response: { roomId: string }) => {
      console.log(response)
      localStorage.setItem('roomId', response.roomId)
    })
  }

  async function joinRoom(roomId: string) {
    localStorage.setItem('roomId', roomId)
    socket.emit('join', { roomId })
  }

  async function vote(cardValue: string | null) {
    socket.emit('vote', { value: cardValue })
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
    if (room.value.id)
      socket.emit('leave', { roomId: room.value.id }, (newRoom: Room) => {
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
    userName,
    userSaved,
    time, startTimer, stopTimer, timerRunning, endTimer
  }
})
