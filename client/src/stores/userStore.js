import { defineStore } from 'pinia'
import userService from '@/services/Api/user'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    roles: [],
    viewedUser: null,
    userProfile: null,
    userBarcodeImageUrl: null, // store barcode image URL blob
  }),

  actions: {
    async fetchUsers() {
      try {
        const res = await userService.getAllUsers()
        this.users = res.data.users
      } catch (err) {
        console.error('❌ fetchUsers error:', err.response?.data || err.message)
      }
    },

    async fetchRoles() {
      try {
        const res = await userService.getRoles()
        this.roles = res.data.roles
      } catch (err) {
        console.error('❌ fetchRoles error:', err.response?.data || err.message)
      }
    },

    async viewUser(id) {
      try {
        const res = await userService.getUserById(id)
        this.viewedUser = res.data.user
      } catch (err) {
        console.error('❌ viewUser error:', err.response?.data || err.message)
      }
    },

    async fetchProfile() {
      try {
        const res = await userService.getProfile()
        this.userProfile = res.data.user
      } catch (err) {
        console.error('❌ fetchProfile error:', err.response?.data || err.message)
      }
    },

    // Fetch barcode image as a blob URL to display in frontend
    async fetchUserBarcodeImage(id) {
      try {
        const res = await userService.getUserBarcodeImage(id)
        // Convert blob to object URL for <img> src
        this.userBarcodeImageUrl = URL.createObjectURL(res.data)
      } catch (err) {
        console.error('❌ fetchUserBarcodeImage error:', err.response?.data || err.message)
        this.userBarcodeImageUrl = null
      }
    },

    // Other CRUD actions (createUser, updateUser, deleteUser)...
  },
})
