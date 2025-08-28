<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import Swal from 'sweetalert2';

// Initialize user store
const userStore = useUserStore();

// Reactive state for image handling
const previewImage = ref(null);
const isLoading = ref(true);

// Computed property for profile initial (first letter of email)
const profileInitial = computed(() => {
  return userStore.userProfile?.user?.email?.charAt(0)?.toUpperCase() || '?';
});

// Computed property to validate profile image
const hasValidProfileImage = computed(() => {
  const image = previewImage.value || userStore.userProfile?.user?.profile_image || userStore.profileImage || '';
  return image && (image.startsWith('http') || image.startsWith('data:image') || image.startsWith('blob:'));
});

// Watch for changes in profile image
onMounted(async () => {
  isLoading.value = true;
  try {
    const profileResult = await userStore.fetchUserProfile();
    if (!profileResult.success || !userStore.userProfile?.user) {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'Profile Error',
        text: 'No user data found. Please log in again.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: '300px',
        padding: '0.5em 1em',
        background: '#fff',
      });
      return;
    }

    const userData = userStore.userProfile.user;
    previewImage.value = userData.profile_image
      ? `${userData.profile_image}?t=${new Date().getTime()}`
      : userStore.profileImage || null;
  } catch (err) {
    console.error('Failed to load user profile:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen py-8 px-4 mt-10">
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-xl p-8 text-center backdrop-blur-sm">
        <div class="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-slate-600 font-medium">Loading your profile...</p>
      </div>

      <!-- Profile View -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/50">
        <!-- Profile Header with Enhanced Design -->
        <div class="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
          <!-- Decorative Background Pattern -->
          <div class="absolute inset-0 bg-black/10">
            <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
          </div>

          <div class="relative flex flex-col lg:flex-row items-center gap-8">
            <!-- Enhanced Profile Image -->
            <div class="relative group">
              <div class="w-32 h-32 rounded-full p-1 bg-white/20 backdrop-blur-sm">
                <div
                  class="w-full h-full rounded-full border-4 border-white shadow-2xl flex items-center justify-center bg-slate-100 overflow-hidden">
                  <img v-if="hasValidProfileImage"
                    :src="previewImage || userStore.userProfile?.user?.profile_image || userStore.profileImage || 'https://placehold.co/128x128'"
                    alt="Profile"
                    class="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
                    @error="previewImage = null" />
                  <span v-else
                    class="text-4xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full h-full w-full flex items-center justify-center">
                    {{ profileInitial }}
                  </span>
                </div>
              </div>

              <!-- Enhanced Status Indicator -->
              <div
                class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all duration-300"
                :class="userStore.userProfile?.isOnline ? 'bg-emerald-500' : 'bg-slate-400'">
                <div class="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>

            <!-- Enhanced User Info -->
            <div class="text-center lg:text-left flex-1 space-y-4">
              <div>
                <h1 class="text-3xl lg:text-4xl font-bold text-white mb-2 text-balance">
                  {{ userStore.userProfile?.user?.username || 'Unknown User' }}
                </h1>
                <p class="text-blue-100 text-lg font-medium mb-4 break-words w-full max-w-[30ch] sm:max-w-full">
                  {{ userStore.userProfile?.user?.email || 'Not provided' }}
                </p>

              </div>

              <!-- Enhanced Status Badge -->
              <div class="flex justify-center lg:justify-start">
                <span
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/10"
                  :class="userStore.userProfile?.isOnline ? 'bg-emerald-500/20 text-emerald-100' : 'bg-slate-500/20 text-slate-200'">
                  <div class="w-2 h-2 rounded-full"
                    :class="userStore.userProfile?.isOnline ? 'bg-emerald-300' : 'bg-slate-300'"></div>
                  {{ userStore.userProfile?.isOnline ? 'Active Now' : 'Offline' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Profile Details -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Personal Information Card -->
            <div
              class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-slate-800">Personal Information</h2>
              </div>

              <div class="space-y-4">
                <div
                  class="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-slate-200/50 hover:border-blue-200 transition-colors">
                  <span class="text-slate-600 font-medium flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clip-rule="evenodd" />
                    </svg>
                    Date of Birth
                  </span>
                  <span class="text-slate-800 font-semibold">
                    {{ userStore.userProfile?.user?.date_of_birth ? new
                      Date(userStore.userProfile.user.date_of_birth).toLocaleDateString() : 'Not provided' }}
                  </span>
                </div>

                <div
                  class="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-slate-200/50 hover:border-blue-200 transition-colors">
                  <span class="text-slate-600 font-medium flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Phone
                  </span>
                  <span class="text-slate-800 font-semibold">
                    {{ userStore.userProfile?.user?.phone || 'Not provided' }}
                  </span>
                </div>

                <div
                  class="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-slate-200/50 hover:border-blue-200 transition-colors">
                  <span class="text-slate-600 font-medium flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clip-rule="evenodd" />
                    </svg>
                    Role
                  </span>
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {{ userStore.userProfile?.user?.role?.name || 'No Role Assigned' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Account Statistics Card -->
            <div
              class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-slate-800">Account Status</h2>
              </div>

              <div class="space-y-4">
                <div class="bg-white rounded-lg p-4 border border-slate-200/50">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-slate-600 font-medium">Account Status</span>
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>

                <div class="bg-white rounded-lg p-4 border border-slate-200/50">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-slate-600 font-medium">Profile Completion</span>
                    <span class="text-slate-800 font-semibold">85%</span>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 85%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>