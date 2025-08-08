// stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null
  }),

  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    reset() {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token') // remove token if stored separately
    },

    async fetchUser() {
      if (!this.user?.id) return

      try {
        const res = await axios.get(`http://localhost:5000/api/user/${this.user.id}`)
        this.setUser(res.data)
        return res.data
      } catch (error) {
        console.error('❌ Failed to fetch user profile:', error)
        throw error
      }
    },

    async updateUser(data) {
      try {
        const res = await axios.put(`http://localhost:5000/api/user/${data.id}`, data)
        this.setUser(res.data)
        return res.data
      } catch (error) {
        console.error('❌ Failed to update user:', error)
        throw new Error('Failed to update user')
      }
    }
  }
})
