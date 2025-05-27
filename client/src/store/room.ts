import {computed, ref} from 'vue'
import {defineStore} from 'pinia'
import {BACK_CARD_VALUE, type Player, type Room, type SavedRoom} from '@shared/data-model'
import {socket} from '../socket.ts'
import router from '../router'
import {useConnectionStore} from '@/store/connection.ts'

const savedRooms = ref(JSON.parse(localStorage.getItem('rooms') || '[]') as SavedRoom[])

export const useRoomStore = defineStore('store', () => {
  const room = ref({} as Room)
  const connectionStore = useConnectionStore()

  const bindEvents = () => {
    socket.on('roomState', (roomState: Room) => {
      if (!roomState.owner) {
        // no owner means room not initialized
        const savedRoom =
          savedRooms.value.filter((r) => r.id === roomState.id)[0] ||
          ({
            id: room.value.id,
            cards: ['1', '2', '3', '5', '8', '13', '21', '☕'],
            owner: connectionStore.userUuid,
            actionsOwnerOnly: false
          } as SavedRoom)
        console.log('send cards ', savedRoom.cards)
        updateSettings(savedRoom)
      } else {
        const roomToSave = {
          id: roomState.id,
          cards: roomState.cards,
          owner: roomState.owner,
          actionsOwnerOnly: roomState.actionsOwnerOnly
        } as SavedRoom
        savedRooms.value = [...savedRooms.value.filter((r) => r.id !== roomState.id), roomToSave]
        localStorage.setItem('rooms', JSON.stringify(savedRooms.value))
      }
      if (roomState.endTimer != room.value.endTimer) {
        console.log('timer changed', roomState.endTimer)
        if (roomState.endTimer > 0) {
          setTimer(roomState.endTimer)
        } else {
          clearInterval(nIntervId.value)
          nIntervId.value = undefined
        }
      }
      if ('startViewTransition' in document) {
        document.startViewTransition(() => {
          room.value = roomState
        })
      } else {
        room.value = roomState
      }
    })
  }

  /** rejoindre/quitter une salle */
  async function createRoom() {
    socket.emit('create', (response: { roomId: string }) => {
      router.push(`/room/${response.roomId}`)
      localStorage.setItem('roomId', response.roomId)
    })
  }
  async function joinRoom(roomId: string) {
    localStorage.setItem('roomId', roomId)
    socket.emit('join', { roomId })
  }

  async function leave() {
    if (room.value.id)
      socket.emit('leave', {roomId: room.value.id}, () => {
        room.value = {} as Room
      })
  }

  /** Utilisation des cartes */
  const users = computed(() =>
    !room.value.users
      ? []
      : Object.values(room.value.users).map((user: Player) => {
          if (user.uuid === connectionStore.userUuid || room.value.cardVisible) {
            return {
              name: user.name,
              card: user.card,
              isMe: user.uuid === connectionStore.userUuid
            }
          }
          return {name: user.name, card: user.card ? BACK_CARD_VALUE : null, isMe: false}
        })
  )
  const selectedCard = computed(() =>
      !room.value.users ? '' : room.value.users[connectionStore.userUuid]?.card
  )

  async function vote(cardValue: string | null) {
    socket.emit('vote', { value: cardValue })
  }

  /** Réinitialiser les votes */

  async function reset() {
    socket.emit('reset')
  }

  /** Afficher/Cacher les cartes */
  async function show() {
    socket.emit('cardVisible', true)
  }
  async function hide() {
    socket.emit('cardVisible', false)
  }

  /** SETTINGS */

  async function updateSettings(settings: SavedRoom) {
    socket.emit('updateSettings', settings as Room)
  }

  const actionsAllowed = computed(
      () => !room.value.actionsOwnerOnly || room.value.owner == connectionStore.userUuid
  )

  /** TIMER */

  const time = ref(3600000) // 1h en ms
  const nIntervId = ref<ReturnType<typeof setInterval>>()
  const timerRunning = computed(() => nIntervId.value !== undefined)
  const endTimer = ref(false)

  const setTimer = (endTime: number) => {
    nIntervId.value = setInterval(() => {
      time.value = endTime - Date.now()
      if (time.value < 1000) {
        // si moins d'1s
        clearInterval(nIntervId.value)
        nIntervId.value = undefined
        endTimer.value = true
      }
    }, 1000)
  }

  const stopTimer = () => {
    socket.emit('timer', { endTime: 0 })
  }

  const startTimer = (time: number) => {
    socket.emit('timer', { endTime: Date.now() + time })
  }

  return {
    bindEvents,
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
    userName: computed(() => connectionStore.userName),
    userUuid: computed(() => connectionStore.userUuid),
    time,
    startTimer,
    stopTimer,
    timerRunning,
    endTimer,
    updateSettings,
    actionsAllowed
  }
})
