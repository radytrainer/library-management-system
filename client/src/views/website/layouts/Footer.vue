```vue
<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

// Access the user store and router
const userStore = useUserStore();
const router = useRouter();

// Computed properties to reactively access store data
const userRole = computed(() => userStore.user?.role || '');
const canAccessSystem = computed(() => ['admin', 'librarian'].includes(userRole.value));
const canAccessWebsite = computed(() => ['user', 'librarian'].includes(userRole.value));

// Initialize user state on mount
onMounted(async () => {
  console.log('Nav component mounted. isAuthenticated:', userStore.isAuthenticated, 'user:', userStore.user, 'token:', userStore.token);
  if (!userStore.isAuthenticated && localStorage.getItem('token')) {
    try {
      const isValid = await userStore.validateToken();
      console.log('Token validation result:', isValid);
      if (!isValid) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Your session has expired. Please log in again.',
        });
        userStore.resetAuth();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while validating your session. Please log in again.',
      });
      userStore.resetAuth();
      router.push('/login');
    }
  } else if (!userStore.isAuthenticated) {
    console.log('No session found, redirecting to login');
    router.push('/login');
  } else if (userStore.isAuthenticated && !userStore.userProfile) {
    try {
      const result = await userStore.fetchUserProfile();
      console.log('fetchUserProfile result:', result);
      if (!result.success) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load user profile. Please log in again.',
        });
        userStore.resetAuth();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while loading your profile. Please log in again.',
      });
      userStore.resetAuth();
      router.push('/login');
    }
  }
});

// Logout method
const logout = async () => {
  const result = await Swal.fire({
    title: 'Are you sure you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
    background: '#fff',
  });

  if (result.isConfirmed) {
    await userStore.logout();
    router.push('/login');
  }
};
</script>

<template>
  <footer class="bg-gradient-to-r from-blue-50 to-white border-t border-gray-200 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">

        <!-- Left: Logo and Quick Access Links -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <img src="/logo.png" alt="Passerelles Numériques Logo" class="h-14 w-14 object-contain transition-transform duration-300 hover:scale-105">
          </div>

          <!-- Quick Access Links -->
          <div class="flex space-x-6">
            <router-link to="/website" class="footer-link group">
              <span class="block">Home</span>
              <span class="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </router-link>
            <router-link to="/about-us" class="footer-link group">
              <span class="block">About</span>
              <span class="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </router-link>
            <router-link to="/web-book" class="footer-link group">
              <span class="block">Books</span>
              <span class="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </router-link>
            <router-link v-if="canAccessWebsite" to="/web-summary" class="footer-link group">
              <span class="block">Summary</span>
              <span class="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </router-link>
            <router-link v-if="canAccessSystem" to="/dashboard" class="footer-link group">
              <span class="block">System</span>
              <span class="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </router-link>
          </div>
        </div>

        <!-- Right: Social Media and Logout -->
        <div class="flex items-center space-x-6">
          <!-- Social Media Links -->
          <div class="flex space-x-4">
            <a href="https://www.passerellesnumeriques.org/" aria-label="Website" class="footer-icon group">
              <svg class="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/passerelles.numeriques.cam/" aria-label="Facebook" class="footer-icon group">
              <svg class="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.7 9.9v-7h-2v-3h2v-2c0-2 1-3 3-3h2v3h-2a1 1 0 00-1 1v2h3l-.5 3h-2.5v7A10 10 0 0022 12z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/school/passerelles-num%C3%A9riques-cambodia/" aria-label="LinkedIn" class="footer-icon group">
              <svg class="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.012-3.05-1.864-3.05-1.865 0-2.149 1.451-2.149 2.953v5.701h-3v-11h2.888v1.531h.041c.401-.764 1.383-1.571 2.842-1.571 3.039 0 3.604 2.008 3.604 4.617v6.422z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Copyright -->
        <p class="text-gray-500 text-sm mt-4 text-center">
          &copy; 2025 Passerelles Numériques. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  @apply text-gray-500 text-sm font-medium transition-colors duration-200 flex flex-col items-center;
}

.footer-link:hover {
  @apply text-blue-600;
}

/* Custom hover underline effect without @apply */
.footer-link .underline {
  @apply h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 origin-left;
}

.footer-link:hover .underline {
  @apply scale-x-100;
}

.footer-icon {
  @apply text-gray-500 transition-colors duration-200;
}

.footer-icon:hover {
  @apply text-blue-600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .flex {
    @apply flex-col items-center;
  }
  .space-x-8, .space-x-6, .space-x-4 {
    @apply space-y-4 space-x-0 mt-4;
  }
  .footer-link {
    @apply text-center;
  }
}
</style>