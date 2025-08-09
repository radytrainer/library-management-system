import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    reset() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },

    async fetchUser() {
      if (!this.user?.id || !this.token) return null

      try {
        const res = await axios.get(`http://localhost:5000/api/user/${this.user.id}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        this.setUser(res.data.user)
        return res.data.user
      } catch (error) {
        console.error('❌ Failed to fetch user profile:', error)
        this.reset()
        throw error
      }
    },

    async updateUser(data) {
      try {
        const formData = new FormData()
        for (const key in data) {
          formData.append(key, data[key])
        }
        const res = await axios.put(`http://localhost:5000/api/user/${data.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.token}`,
          },
        })
        this.setUser(res.data.user)
        return res.data.user
      } catch (error) {
        console.error('❌ Failed to update user:', error)
        throw new Error('Failed to update user')
      }
    },

    async uploadProfileImage(file) {
      if (!this.user?.id || !this.token) return null

      try {
        const formData = new FormData()
        formData.append('profile_image', file)
        const res = await axios.post(`http://localhost:5000/api/user/${this.user.id}/upload-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.token}`,
          },
        })
        this.setUser(res.data.user)
        return res.data.user
      } catch (error) {
        console.error('❌ Failed to upload profile image:', error)
        throw new Error('Failed to upload profile image')
      }
    },

    async login(email, password) {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/signin', { email, password })
        this.setUser(res.data.user)
        this.setToken(res.data.user.accessToken)
        return res.data.user
      } catch (error) {
        console.error('❌ Failed to login:', error)
        throw error
      }
    },
  },
})
