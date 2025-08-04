<script setup>
const props = defineProps({
  show: Boolean,
  user: Object
})

const emits = defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
    <!-- Large Modal Container - With Scrolling -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
      <!-- Header - Fixed -->
      <div class="flex-shrink-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 rounded-t-2xl"></div>
        <div class="relative flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-white mb-1">User Details</h2>
            <p class="text-blue-100 text-sm opacity-90">Complete user information</p>
          </div>
          <button 
            @click="$emit('close')"
            class="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-full hover:rotate-90 transform"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-gray-50/30 to-white">
        <!-- Main Content Grid -->
        <div class="grid grid-cols-12 gap-8 min-h-full">
          <!-- Left Column - Profile Section -->
          <div class="col-span-4 flex flex-col space-y-6">
            <!-- Profile Header -->
            <div class="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div class="flex flex-col items-center text-center">
                <div class="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-xl mb-4">
                  <img 
                    v-if="user.profile_image" 
                    :src="user.profile_image" 
                    alt="Profile" 
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ user.username }}</h3>
                <p class="text-gray-600 break-all">{{ user.email }}</p>
              </div>
            </div>

            <!-- Profile Image Section -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Full Profile Image
              </h4>
              <div class="flex justify-center p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div class="w-40 h-40 rounded-xl overflow-hidden bg-white shadow-lg">
                  <img 
                    v-if="user.profile_image" 
                    :src="user.profile_image" 
                    alt="Profile" 
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    <div class="text-center">
                      <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="text-sm">No image</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Information Sections -->
          <div class="col-span-8 flex flex-col space-y-6">
            <!-- Basic Information -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h4>
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-600">Username</span>
                    <span class="text-base text-gray-900 font-semibold bg-gray-50 px-3 py-2 rounded-lg">{{ user.username }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-600">Phone</span>
                    <span class="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{{ user.phone || '-' }}</span>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-600">Email</span>
                    <span class="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-lg break-all">{{ user.email }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-gray-600">Role</span>
                    <span class="text-base text-gray-900 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-medium">{{ user.role || '-' }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-medium text-gray-600">Date of Birth</span>
                  <span class="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-lg inline-block w-fit">{{ user.date_of_birth || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Barcode Information -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Barcode Information
              </h4>
              <div class="grid grid-cols-2 gap-6">
                <div class="flex flex-col">
                  <div class="flex flex-col gap-1 mb-4">
                    <span class="text-sm font-medium text-gray-600">Barcode Number</span>
                    <span class="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg">{{ user.barcode || '-' }}</span>
                  </div>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-600 mb-2">Barcode Image</span>
                  <div class="flex items-center justify-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[120px]">
                    <img 
                      v-if="user.barcode_image" 
                      :src="user.barcode_image" 
                      alt="Barcode" 
                      class="h-20 w-auto max-w-full object-contain"
                    />
                    <div v-else class="flex items-center justify-center text-gray-400">
                      <div class="text-center">
                        <svg class="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm">No barcode image</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Information Section (Example of more content that would require scrolling) -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Additional Details
              </h4>
              <div class="grid grid-cols-1 gap-4">
                <div class="p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">Account Status</p>
                  <p class="text-base font-medium text-green-600">Active</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">Last Login</p>
                  <p class="text-base text-gray-900">Recently active</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">Member Since</p>
                  <p class="text-base text-gray-900">{{ user.created_at || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Close Button - At Bottom of Scrollable Content -->
      
      </div>
    </div>
  </div>
</template>
