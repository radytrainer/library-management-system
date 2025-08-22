import { defineStore } from 'pinia';
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
  getUserQRCode,
  getBorrows,
} from '@/services/Api/user';
import router from '@/router';
import Swal from 'sweetalert2';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    userQRCodeImageUrl: null,
    borrows: [],
    overdueBorrows: [],
    error: '',
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    activeUsersCount: (state) => state.users.filter(user => user.status === 'active').length,
    newUsersCount: (state) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return state.users.filter((u) => new Date(u.createdAt) >= oneWeekAgo).length;
    },
    getBorrows: (state) => state.borrows,
    getOverdueBorrows: (state) => state.overdueBorrows,
  },

  actions: {
    normalizeUser(user) {
      return {
        ...user,
        username: user.name || user.username || '',
        profile_image: user.profile_image
          ? (user.profile_image.startsWith('http')
            ? user.profile_image
            : `${apiBase}/uploads/profile/${user.profile_image}`)
          : null,
        barcode_image: user.barcode_image
          ? (user.barcode_image.startsWith('http')
            ? user.barcode_image
            : `${apiBase}/uploads/barcodes/${user.barcode_image}`)
          : null,
        qr_code_image: user.qr_code_image
          ? (user.qr_code_image.startsWith('http')
            ? user.qr_code_image
            : `${apiBase}/uploads/qrcodes/${user.qr_code_image}`)
          : null,
      };
    },

    setUser(user) {
      const normalizedUser = this.normalizeUser(user);
      this.user = normalizedUser;
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      if (normalizedUser.profile_image) {
        localStorage.setItem('profile_image', normalizedUser.profile_image);
        this.profileImage = normalizedUser.profile_image;
      } else {
        localStorage.removeItem('profile_image');
        this.profileImage = null;
      }
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    resetAuth() {
      this.user = null;
      this.token = null;
      this.userBarcodeImageUrl = null;
      this.userQRCodeImageUrl = null;
      this.borrows = [];
      this.overdueBorrows = [];
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('profile_image');
    },

    async register(form) {
      this.loading = true;
      this.error = '';
      try {
        // Prepare payload
        const { username, email, phone, password, roleId, profileImage } = form;

        let payload;

        if (profileImage) {
          // Case 1: User uploaded an image → use FormData
          payload = new FormData();
          payload.append('username', username);
          payload.append('email', email);
          payload.append('phone', phone);
          payload.append('password', password);
          payload.append('roleId', roleId);
          payload.append('profile_image', profileImage); // field name matches backend multer
        } else {
          // Case 2: No image → normal JSON, backend will generate fallback
          payload = { username, email, phone, password, roleId };
        }

        // Call API
        const response = await registerUser(payload);

        // Extract user & token safely
        const user = response.data?.user || response.user;
        const token = response.data?.token || user?.accessToken;

        // Save in state/store
        if (user) {
          this.setUser(user);
        }
        if (token) {
          localStorage.setItem('token', token);
        }

        return { success: true, user };
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },



    async login(email, password) {
      this.loading = true;
      this.error = '';
      try {
        const response = await loginUser(email, password);
        const token = response.accessToken || response.token;
        const user = response.user || response;

        // Validate response
        if (!token || !user || !user.id) {
          throw new Error('Invalid response from server: Missing token or user data');
        }

        // Store token and user
        this.setToken(token);
        localStorage.setItem('token', token); // Persist token
        this.setUser(user);

        console.log('Login successful:', user, 'Token:', token);
        return { success: true, user };
      } catch (error) {
        console.error('Login error:', error.response?.data || error.stack || error.message);
        this.error = error.response?.data?.message || 'Login failed due to server error';
        this.resetAuth();
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async fetchUserProfile() {
      if (!this.token) {
        console.log('No token found, redirecting to login');
        await router.push('/login');
        return { success: false };
      }

      this.loading = true;
      try {
        const res = await getProfile();
        if (!res || !res.data) {
          console.log('Failed to fetch profile, redirecting to login');
          await router.push('/login');
          return { success: false };
        }

        this.userProfile = this.normalizeUser(res.data);
        return { success: true, data: this.userProfile };
      } catch (error) {
        console.error('Error fetching profile:', error);
        await router.push('/login');
        return { success: false, error };
      } finally {
        this.loading = false;
      }
    },
    async updateUser(id, formData) {
      this.loading = true;
      this.error = '';
      try {
        const res = await updateUser(id, formData); // Assumed API call
        console.log('updateUser API response:', res.data, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
        const updatedUser = this.normalizeUser(res.data.user);
        // Update users array
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        // Update userProfile if it’s the current user
        if (this.userProfile?.user?.id === id) {
          this.userProfile = {
            ...this.userProfile,
            user: updatedUser,
            profile_image: res.data.user.profile_image || this.userProfile.profile_image,
          };
          console.log('Updated userProfile:', this.userProfile, 'Profile image:', this.userProfile.profile_image, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
        }
        return { success: true, profile_image: res.data.user.profile_image };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update user';
        console.error('updateUser failed:', this.error, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
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
      this.loading = true;
      this.error = '';
      try {
        const res = await getAllUsers();
        this.users = Array.isArray(res.data.users)
          ? res.data.users.map(u => this.normalizeUser(u))
          : [];
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async createUser(formData) {
      this.loading = true;
      this.error = '';
      if (!formData.get('username') || !formData.get('email') || !formData.get('password') || !formData.get('roleId')) {
        this.error = 'Username, email, password, and role are required';
        Swal.fire({ icon: 'error', title: 'Error', text: this.error });
        this.loading = false;
        return { success: false, error: this.error };
      }
      try {
        const res = await createUser(formData);
        const newUser = this.normalizeUser(res.data.user);
        this.users.push(newUser);
        Swal.fire({
          icon: 'success',
          title: 'User created!',
          text: 'The user was created successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        return { success: true, data: newUser };
      } catch (error) {
        console.error('Create user error:', error.response?.data || error.message);
        this.error = error.response?.data?.message || 'Failed to create user';
        Swal.fire({ icon: 'error', title: 'Error', text: this.error });
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // In userStore.js


    async deleteUser(id) {
      this.loading = true;
      this.error = '';
      try {
        await deleteUser(id);
        this.users = this.users.filter(u => u.id !== id);
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async fetchUserBarcodeImage(id) {
      this.loading = true;
      this.error = '';
      try {
        const res = await getUserBarcodeImage(id);
        if (this.userBarcodeImageUrl) URL.revokeObjectURL(this.userBarcodeImageUrl);
        this.userBarcodeImageUrl = URL.createObjectURL(res.data);
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch barcode image';
        this.userBarcodeImageUrl = null;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async fetchUserQRCodeImage(id) {
      this.loading = true;
      this.error = '';
      try {
        const res = await getUserQRCode(id);
        if (this.userQRCodeImageUrl) URL.revokeObjectURL(this.userQRCodeImageUrl);
        this.userQRCodeImageUrl = URL.createObjectURL(res.data);
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch QR code image';
        this.userQRCodeImageUrl = null;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

async fetchBorrows() {
  if (!this.token) {
    await router.push('/login');
    return { success: false };
  }

  this.loading = true;
  try {
    const res = await getBorrows();
    if (!res || !Array.isArray(res)) {
      this.borrows = [];
      this.overdueBorrows = [];
      return { success: false };
    }

    this.borrows = res.map(borrow => {
      return {
        id: borrow.id,
        bookTitle: borrow.bookTitle,
        userBorrow: borrow.userBorrow,
        dueDate: borrow.dueDate,
        returned: borrow.status.toLowerCase() === 'returned', // Case-insensitive check
      };
    });
    const today = new Date(); // Use current date for real-time checks
    this.overdueBorrows = this.borrows.filter(borrow => {
      const isOverdue = borrow.dueDate < today && !borrow.returned;
      return isOverdue;
    });
    return { success: true, data: this.borrows };
  } catch (error) {
    this.borrows = [];
    this.overdueBorrows = [];
    this.error = 'Failed to fetch borrows due to a server error';
    return { success: false, error: this.error };
  } finally {
    this.loading = false;
  }
},

    logout() {
      this.resetAuth();
      router.push('/login');
    },
  },
});