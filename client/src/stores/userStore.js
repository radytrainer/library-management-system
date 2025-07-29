import { defineStore } from 'pinia';
import * as user from '@/services/Api/user';

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

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = '';
      try {
        let attempts = 3;
        while (attempts > 0) {
          try {
            const res = await user.getAllUsers();
            this.users = Array.isArray(res.data.users) ? res.data.users : [];
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
        const res = await user.getRoles();
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
        const res = await user.getUserById(id);
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
        const res = await user.getProfile();
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
        const res = await user.getUserBarcodeImage(id);
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

    async createUser(data) {
      this.loading = true;
      this.error = '';
      try {
        const res = await user.createUser(data);
        this.users.push(res.data.user);
        return { success: true };
      } catch (err) {
        this.error = err.response?.status === 403 ? 'Authentication failed: Please log in again' : err.message;
        console.error('❌ createUser error:', err.message);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id, data) {
      this.loading = true;
      this.error = '';
      try {
        const res = await user.updateUser(id, data);
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) this.users[index] = res.data.user;
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
        await user.deleteUser(id);
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