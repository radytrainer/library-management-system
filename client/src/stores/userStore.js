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
import router from '@/router'
import Swal from 'sweetalert2'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    profileImage: localStorage.getItem('profile_image') || null,
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
      console.log('Token:', localStorage.getItem('token'))
      console.log('User:', JSON.parse(localStorage.getItem('user')))

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
        const response = await loginUser(email, password)
        console.log('Login API Response:', response)

        // Adjust for possible 'accessToken' key
        const token = response.token || response.accessToken || response.user?.accessToken
        const user = response.user || response

        if (!token || !user) {
          throw new Error('Invalid response: Token or user missing')
        }

        this.setUser(user)
        this.setToken(token)

        if (user.profile_image) {
          localStorage.setItem('profile_image', user.profile_image)
          console.log('Profile image saved:', user.profile_image)
        } else {
          localStorage.removeItem('profile_image')
        }

        console.log('Login successful, token stored:', token)
        return { success: true, user }
      } catch (error) {
        console.error('Login error:', error.message, error.response?.data)
        this.error = error.response?.data?.message || 'Login failed'
        this.resetAuth()
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
    ,
    async fetchUserProfile() {
      // If no token, redirect to login (or skip if already on login handled elsewhere)
      if (!this.token) {
        console.log('No token found, redirecting to login')
        await router.push('/login')
        return { success: false }
      }

      this.loading = true
      try {
        // Call your API service
        const res = await getProfile()  // assuming getProfile() returns profile data

        if (!res || !res.data) {
          console.log('Failed to fetch profile, redirecting to login')
          await router.push('/login')
          return { success: false }
        }

        this.userProfile = this.normalizeUser(res.data)
        return { success: true, data: this.userProfile }
      } catch (error) {
        console.error('Error fetching profile:', error)
        await router.push('/login')
        return { success: false, error }
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
      this.resetAuth();
      localStorage.removeItem('profile_image');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }

  },
})
