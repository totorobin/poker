import { defineStore } from 'pinia'
import { socket } from '../socket'
import { ElMessage } from 'element-plus'
import { i18n } from '../locales'
import { reactive, computed } from 'vue'

export const useConnectionStore = defineStore('connection', () => {
  const state = reactive({
    connected: false,
    firstConnection: true,
    userName: localStorage.getItem('userName'),
    userUuid: localStorage.getItem('uuid'),
    userSaved: localStorage.getItem('userName') != null
  })

  const bindEvents = () => {
    socket.on('connect', () => {
      console.log(`connected to websocket with id ${socket.id}`)
      if (!state.firstConnection) {
        ElMessage(i18n.t('notifications.websocket-reconnected'))
      }
      if (state.userName) {
        socket.emit('setUserName', state.userName)
      } else {
        socket.emit('whoAmI', (data: { name: string }) => {
          state.userName = data.name
        })
      }
    })

    /** GESTION DE LA RECONNECTION */
    socket.on('disconnect', (reason: string) => {
      state.firstConnection = false
      ElMessage(i18n.t('notifications.websocket-disconnected'))
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        setTimeout(() => socket.connect(), 3000)
      }
    })

    socket.on('notify', ({ type , values }) => {
      ElMessage(i18n.t(`notifications.${type}`, values))
    })
  }

  /** Gestion des l'utilisateurs */

  function setUser(name: string) {
    state.userName = name
    state.userSaved = true
    socket.emit('setUserName', name)
    localStorage.setItem('userName', name)
  }

  const connect = () => {
    socket.connect()
  }
  const disconnect = () => {
    socket.disconnect()
  }

  connect()

  return {
    bindEvents,
    userName: computed(() => state.userName),
    userUuid: state.userUuid,
    userSaved: computed(() => state.userSaved),
    connect,
    disconnect,
    setUser
  }
})
