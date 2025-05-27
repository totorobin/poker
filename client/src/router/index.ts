import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useRoomStore} from '../store/room.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (_to, from) => {
        if (from.name == 'room') useRoomStore().leave()
        return true
      }
    },
    {
      name: 'room',
      path: '/room/:roomId',
      component: () => import('../views/RoomView.vue'),
      props: true
    }
  ]
})

export default router
