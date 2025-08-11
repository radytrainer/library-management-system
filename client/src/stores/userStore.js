import { defineStore } from 'pinia'
import {
  registerUser,
  loginUser,
  createUser,
  getAllUsers,
  getRoles,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  getUserBarcodeImage,
} from '@/services/Api/user'
import Swal from 'sweetalert2'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    users: [],
    roles: [],
    viewedUser: null,
    userProfile: null,
    userBarcodeImageUrl: null,
    error: '',
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    activeUsersCount: (state) => state.users.filter(u => u.isActive).length,
    newUsersCount: (state) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return state.users.filter((u) => new Date(u.createdAt) >= oneWeekAgo).length;
    },
  },

  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    resetAuth() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
    },

    normalizeUser(user) {
      return {
        ...user,
        profile_image: user.profile_image
          ? user.profile_image.startsWith('http')
            ? user.profile_image
            : `${apiBase}/uploads/profile/${user.profile_image}`
          : null,
        barcode_image: user.barcode_image
          ? user.barcode_image.startsWith('http')
            ? user.barcode_image
            : `${apiBase}/uploads/barcodes/${user.barcode_image}`
          : null,
      }
    },

    async register(form) {
      this.loading = true
      this.error = ''
      try {
        const user = await registerUser(form)
        this.setUser(user)
        return { success: true, user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async login(email, password) {
      this.loading = true
      this.error = ''
      try {
        const user = await loginUser(email, password)
        this.setUser(user)
        this.setToken(user.accessToken)
        return { success: true, user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    async fetchRoles() {
  this.loading = true;
  this.error = '';
  try {
    const res = await getRoles();
    this.roles = Array.isArray(res.data.roles) ? res.data.roles : [];
    return { success: true, data: this.roles };
  } catch (error) {
    this.error = error.response?.data?.message || 'Failed to fetch roles';
    return { success: false, error: this.error };
  } finally {
    this.loading = false;
  }
},

    async fetchUsers() {
      this.loading = true
      this.error = ''
      try {
        const res = await getAllUsers()
        this.users = Array.isArray(res.data.users)
          ? res.data.users.map(u => this.normalizeUser(u))
          : []
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createUser(formData) {
      this.loading = true
      this.error = ''
      try {
        const res = await createUser(formData)
        const newUser = this.normalizeUser(res.data.user)
        this.users.push(newUser)
        Swal.fire({
          icon: 'success',
          title: 'User created!',
          text: 'The user was created successfully.',
          timer: 2000,
          showConfirmButton: false,
        })
        return { success: true, data: newUser }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create user'
        Swal.fire({ icon: 'error', title: 'Error', text: this.error })
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateUser(id, formData) {
      this.loading = true
      this.error = ''
      try {
        const res = await updateUser(id, formData)
        const updatedUser = this.normalizeUser(res.data.user)
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) this.users[index] = updatedUser
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id) {
      this.loading = true
      this.error = ''
      try {
        await deleteUser(id)
        this.users = this.users.filter(u => u.id !== id)
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
async fetchProfile() {
  this.loading = true
  this.error = ''
  try {
    const res = await getProfile()

    if (res.data.user) {
      const normalizedUser = this.normalizeUser(res.data.user)
      this.userProfile = normalizedUser
      this.setUser(normalizedUser) // keep user in sync

      // ✅ Cache profile_image if valid
      if (normalizedUser.profile_image) {
        localStorage.setItem('profile_image', normalizedUser.profile_image)
      } else {
        localStorage.removeItem('profile_image')
      }
    } else {
      this.userProfile = null
      localStorage.removeItem('profile_image')
    }

    return { success: true }
  } catch (error) {
    this.error = error.response?.data?.message || 'Failed to fetch profile'
    localStorage.removeItem('profile_image')
    return { success: false, error: this.error }
  } finally {
    this.loading = false
  }
},


    async fetchUserBarcodeImage(id) {
      this.loading = true
      this.error = ''
      try {
        const res = await getUserBarcodeImage(id)
        if (this.userBarcodeImageUrl) URL.revokeObjectURL(this.userBarcodeImageUrl)
        this.userBarcodeImageUrl = URL.createObjectURL(res.data)
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch barcode image'
        this.userBarcodeImageUrl = null
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.resetAuth()
      this.users = []
      this.roles = []
      this.viewedUser = null
      this.userProfile = null
      this.userBarcodeImageUrl = null
      this.error = ''
    },
  },
})
