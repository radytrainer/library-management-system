import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    login(userData) {
      this.user = userData.user
      this.token = userData.accessToken
    },
    logout() {
      this.user = null
      this.token = null
    },
  },
  persist: true, // Optional: persists user across refreshes (needs pinia-plugin-persistedstate)
})
