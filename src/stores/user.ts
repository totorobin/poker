import { ref } from 'vue'
import { defineStore } from 'pinia'

interface User {
  name: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref({ name: localStorage.getItem('userName') } as User)

  function setUser(userName: string) {
    user.value.name = userName
    localStorage.setItem('userName', userName)
  }

  return { user, setUser }
})
