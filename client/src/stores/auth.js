import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    reset() {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})
