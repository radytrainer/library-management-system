import { defineStore } from 'pinia';
import {
  getAllUsers,
  getRoles,
  getUserById,
  getProfile,
  getUserBarcodeImage,
  updateUser,
  deleteUser,
  createUser,
} from '@/services/Api/user';
import Swal from 'sweetalert2';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    roles: [],
    viewedUser: null,
    userProfile: null,
    userBarcodeImageUrl: null,
    error: '',
    loading: false, 
  }),

  getters: {
    activeUsersCount: (state) => state.users.filter((u) => u.isActive).length,
    newUsersCount: (state) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return state.users.filter((u) => new Date(u.createdAt) >= oneWeekAgo).length;
    },
  },

  actions: {
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
      };
    },
    
    async fetchUsers() {
      this.loading = true;
      this.error = '';
      try {
        const res = await getAllUsers();
        this.users = Array.isArray(res.data.users)
          ? res.data.users.map((u) => this.normalizeUser(u))
          : [];
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch users';
        console.error('❌ fetchUsers error:', this.error);
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
        return { success: true };
      } catch (err) {
        this.error = err.response?.status === 403 ? 'Authentication failed: Please log in again' : 'Failed to fetch roles';
        console.error('❌ fetchRoles error:', err.message);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async viewUser(id) {
      this.loading = true;
      this.error = '';
      try {
        const res = await getUserById(id);
        this.viewedUser = res.data.user ? this.normalizeUser(res.data.user) : null;
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch user';
        console.error('❌ viewUser error:', this.error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    async fetchProfile() {
      this.loading = true;
      this.error = '';
      try {
        const res = await getProfile();
        this.userProfile = res.data.user ? this.normalizeUser(res.data.user) : null;
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch profile';
        console.error('❌ fetchProfile error:', this.error);
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
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch barcode image';
        console.error('❌ fetchUserBarcodeImage error:', this.error);
        this.userBarcodeImageUrl = null;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

   async createUser(formData) {
  this.loading = true;
  this.error = '';
  try {
    const res = await createUser(formData);
    const newUser = this.normalizeUser(res.data.user);
    this.users.push(newUser);

    // Success popup (optional)
    Swal.fire({
      icon: 'success',
      title: 'User created!',
      text: 'The user was created successfully.',
      timer: 2000,
      showConfirmButton: false,
    });

    return { success: true, data: newUser };
  } catch (err) {
    this.error = err.response?.data?.message || 'Failed to create user';
    console.error('❌ createUser error:', this.error);

    // Show error popup with SweetAlert2
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: this.error,
    });

    return { success: false, error: this.error };
  } finally {
    this.loading = false;
  }
},

    async updateUser(id, formData) {
      this.loading = true;
      this.error = '';
      try {
        const res = await updateUser(id, formData);
        const updatedUser = this.normalizeUser(res.data.user);
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) this.users[index] = updatedUser;
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update user';
        console.error('❌ updateUser error:', this.error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id) {
      this.loading = true;
      this.error = '';
      try {
        await deleteUser(id);
        this.users = this.users.filter((u) => u.id !== id);
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete user';
        console.error('❌ deleteUser error:', this.error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});