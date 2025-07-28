import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    roles: [],
    viewedUser: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchUsers() {
      try {
        this.loading = true
        const res = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.users = res.data.users
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },

    async fetchRoles() {
      try {
        const res = await axios.get('/api/roles', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.roles = res.data.roles
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch roles'
      }
    },

    async viewUser(id) {
      try {
        const res = await axios.get(`/api/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.viewedUser = res.data.user
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to view user'
      }
    },

    async createUser(payload) {
      try {
        const res = await axios.post('/api/', payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.users.push(res.data.user)
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create user'
      }
    },

    async updateUser(id, payload) {
      try {
        const res = await axios.put(`/api/users/${id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) this.users[index] = res.data.user
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update user'
      }
    },

    async deleteUser(id) {
      try {
        await axios.delete(`/api/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.users = this.users.filter(u => u.id !== id)
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete user'
      }
    }
  }
})
