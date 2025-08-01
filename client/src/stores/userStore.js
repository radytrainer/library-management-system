// @/stores/userStore.js
import { defineStore } from 'pinia';
import { getAllUsers, getRoles, getUserById, getProfile, getUserBarcodeImage, updateUser, deleteUser, createUser } from '@/services/Api/user';

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
    activeUsersCount(state) {
      return state.users.filter(u => u.isActive).length;
    },
    newUsersCount(state) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return state.users.filter(u => new Date(u.createdAt) >= oneWeekAgo).length;
    },
  },

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = '';
      try {
        let attempts = 3;
        while (attempts > 0) {
          try {
            const res = await getAllUsers();
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            this.users = Array.isArray(res.data.users)
              ? res.data.users.map(u => ({
                ...u,
                profile_image: u.profile_image
                  ? (u.profile_image.startsWith('http')
                    ? u.profile_image
                    : `${apiBase}/uploads/users/${u.profile_image}`)
                  : null,
                barcode_image: u.barcode_image
                  ? (u.barcode_image.startsWith('http')
                    ? u.barcode_image
                    : `${apiBase}/uploads/barcodes/${u.barcode_image}`)
                  : null
              }))
              : [];
            return { success: true };
          } catch (err) {
            if (err.response?.status === 403) {
              this.error = 'Authentication failed: Please log in again';
              throw err;
            }
            attempts--;
            if (attempts === 0) throw err;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (err) {
        this.error = err.message === 'No token provided!' ? 'Please log in to access users' : err.message;
        console.error('❌ fetchUsers error:', err.message);
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
        this.error = err.response?.status === 403 ? 'Authentication failed: Please log in again' : err.message;
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
        this.viewedUser = res.data.user || null;
        return { success: true };
      } catch (err) {
        this.error = err.response?.status === 403 ? 'Authentication failed: Please log in again' : err.message;
        console.error('❌ viewUser error:', err.message);
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
        this.userProfile = res.data.user || null;
        return { success: true };
      } catch (err) {
        this.error = err.response?.status === 403 ? 'Authentication failed: Please log in again' : err.message;
        console.error('❌ fetchProfile error:', err.message);
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
        if (this.userBarcodeImageUrl) {
          URL.revokeObjectURL(this.userBarcodeImageUrl);
        }
        this.userBarcodeImageUrl = URL.createObjectURL(res.data);
        return { success: true };
      } catch (err) {
        this.error = err.response?.status === 403 ? 'Authentication failed: Please log in again' : err.message;
        console.error('❌ fetchUserBarcodeImage error:', err.message);
        this.userBarcodeImageUrl = null;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    async createUser(formDataObject) {
      this.loading = true;
      this.error = '';
      try {
        const formData = new FormData();
        for (const key in formDataObject) {
          const value = formDataObject[key];
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
        const res = await createUser(formData);
        this.users.push(res.data.user); // Add new user to store
        return { success: true, data: res.data };
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error('❌ createUser error:', this.error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    async updateUser(id, formDataObject) {
      this.loading = true;
      this.error = '';
      try {
        const formData = new FormData();
        for (const key in formDataObject) {
          const value = formDataObject[key];
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
        const res = await updateUser(id, formData);
        const updatedUser = res.data.user;
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const normalizedUser = {
          ...updatedUser,
          profile_image: updatedUser.profile_image
            ? (updatedUser.profile_image.startsWith('http')
              ? updatedUser.profile_image
              : `${apiBase}/uploads/users/${updatedUser.profile_image}`)
            : null,
          barcode_image: updatedUser.barcode_image
            ? (updatedUser.barcode_image.startsWith('http')
              ? updatedUser.barcode_image
              : `${apiBase}/Uploads/barcodes/${updatedUser.barcode_image}`)
            : null
        };
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) this.users[index] = normalizedUser;
        return { success: true };
      } catch (err) {
        this.error = err.response?.status === 403 ? 'Authentication failed: Please log in again' : err.message;
        console.error('❌ updateUser error:', err.message);
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
        this.error = err.response?.status === 403 ? 'Authentication failed: Please log in again' : err.message;
        console.error('❌ deleteUser error:', err.message);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});