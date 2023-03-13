import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

interface User {
  id: string
  name: string
  card: string
}

interface Room {
  id: string
  name: string
  users: { [key: string]: User }
  cardVisible: boolean
}

// ws://your-url-here.com or wss:// for secure websockets.
const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const port = '8080'
const echoSocketUrl = socketProtocol + '//' + window.location.hostname + ':' + port + '/ws'

// Define socket and attach it to our data object
const connection = new WebSocket(echoSocketUrl)

connection.onopen = function (event) {
  console.log(event)
  console.log('Successfully connected to the echo websocket server...')
}

connection.onclose = function (event: CloseEvent) {
  console.error('Socket is closed: ', event.reason)
  ElMessage('Websocket has closed, the page will be refresh to attempt reconnection in 3 second.')
  setTimeout(function () {
    window.location.reload()
  }, 3000)
}

connection.onerror = function (event: Event) {
  const message = event instanceof ErrorEvent ? event.message : ''
  console.error('Socket encountered error: ', message, 'Closing socket')
  connection.close()
}

export const useRoomStore = defineStore('store', () => {
  const room = ref({} as Room)
  const lastRoomId = ref('') //ref(localStorage.getItem('roomId'))
  const userName = ref(localStorage.getItem('userName'))

  function setUser(name: string) {
    userName.value = name
    localStorage.setItem('userName', name)
  }

  const userId = ref('')
  const users = computed(() =>
    !room.value.users
      ? []
      : Object.values(room.value.users).map((user: User) => {
          if (user.id === userId.value) {
            return { name: user.name, card: user.card }
          } else {
            if (room.value.cardVisible) {
              return { name: user.name, card: user.card }
            } else {
              return { name: user.name, card: user.card ? '?' : undefined }
            }
          }
        })
  )
  const selectedCard = computed(() =>
    !room.value.users ? '' : room.value.users[userId.value].card
  )

  connection.onmessage = function (event) {
    console.log('message received :', event)
    const data = JSON.parse(event.data)
    if (data.userId) {
      userId.value = data.userId
    }
    if (data.room) {
      room.value = data.room
    }
    if (data.notification) {
      ElMessage(data.notification.text)
    }
  }

  async function createRoom() {
    console.log('create Room')
    sendMessage(JSON.stringify({ action: 'create', value: userName.value }))
  }

  async function joinRoom(roomId: string) {
    lastRoomId.value = roomId
    console.log('Join Room')
    sendMessage(JSON.stringify({ action: 'join', roomId: roomId, value: userName.value }))
  }

  async function vote(cardValue: string | undefined) {
    console.log('Join Room')
    sendMessage(JSON.stringify({ action: 'vote', roomId: room.value.id, value: cardValue }))
  }

  async function show() {
    console.log('Show Votes')
    sendMessage(JSON.stringify({ action: 'show', roomId: room.value.id }))
  }
  async function hide() {
    console.log('Hide Votes')
    sendMessage(JSON.stringify({ action: 'hide', roomId: room.value.id }))
  }
  async function reset() {
    console.log('reset Votes')
    sendMessage(JSON.stringify({ action: 'reset', roomId: room.value.id }))
  }

  async function leave() {
    sendMessage(JSON.stringify({ action: 'leave', roomId: room.value.id }))
  }

  const sendMessage = async (msg: string) => {
    if (connection.readyState !== connection.OPEN) {
      try {
        await waitForOpenConnection(connection)
        connection.send(msg)
      } catch (err) {
        console.error(err)
      }
    } else {
      connection.send(msg)
    }
  }

  const waitForOpenConnection = (socket: WebSocket) => {
    return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 10
      const intervalTime = 200 //ms

      let currentAttempt = 0
      const interval = setInterval(() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval)
          reject(new Error('Maximum number of attempts exceeded'))
        } else if (socket.readyState === socket.OPEN) {
          clearInterval(interval)
          resolve(1)
        }
        currentAttempt++
      }, intervalTime)
    })
  }

  return {
    room,
    sendMessage,
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
    lastRoomId
  }
})
