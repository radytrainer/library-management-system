<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { ArrowLeft, Edit3, Save, X, Upload, User, Mail, Phone, Calendar, Shield, Camera } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const userStore = useUserStore()
const router = useRouter()

const editForm = ref({
  username: '',
  email: '',
  phone: '',
  date_of_birth: '',
  password: '',
})

const previewImage = ref(null)
const imageFile = ref(null)
const editMode = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(true)
const profileImageKey = ref(Date.now())

// Unified profile image handling
const profileImageUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  let image = previewImage.value || userStore.userProfile?.profile_image || userStore.profileImage || '';
  
  // Handle relative paths
  if (image && !image.startsWith('http') && !image.startsWith('data:image') && !image.startsWith('blob:')) {
    image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
  }
  
  // Validate URL and add cache-busting parameter
  const isValidUrl = image && (image.startsWith('http') || image.startsWith('data:image') || image.startsWith('blob:'));
  const finalImage = isValidUrl ? image : '/default-profile.png';
  
  return finalImage.startsWith('http') 
    ? `${finalImage}${finalImage.includes('?') ? '&' : '?'}t=${profileImageKey.value}`
    : finalImage;
});

// Computed property for the first letter of the email
const profileInitial = computed(() => userStore.userProfile?.user?.email?.charAt(0)?.toUpperCase() || '?')

// Computed property to check if a valid profile image exists
const hasValidProfileImage = computed(() => {
  const image = previewImage.value || userStore.userProfile?.profile_image || userStore.profileImage || ''
  return image && (image.startsWith('http') || image.startsWith('data:image') || image.startsWith('blob:'))
})

// Function to refresh profile image
const updateProfileDisplay = () => {
  profileImageKey.value = Date.now();
  if (previewImage.value && previewImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.value);
  }
};

watch(() => userStore.userProfile?.profile_image, (newImage) => {
  updateProfileDisplay();
  console.log('Profile image updated in store at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), 'Image:', newImage)
})

onMounted(async () => {
  console.log('Starting profile fetch at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
  isLoading.value = true
  try {
    await userStore.fetchUserProfile()
    console.log('Profile data fetched at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), 'Data:', userStore.userProfile, 'profileImage:', userStore.profileImage)
    if (userStore.userProfile && userStore.userProfile.user && Object.keys(userStore.userProfile.user).length > 0) {
      const userData = userStore.userProfile.user
      Object.assign(editForm.value, {
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
      })
      updateProfileDisplay();
      console.log('Edit form updated with:', editForm.value, 'Preview image:', previewImage.value)
    } else {
      console.warn('No user data available in profile at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), userStore.userProfile)
      Swal.fire({ icon: 'error', title: 'Error', text: 'No user data found. Please try again.' })
    }
  } catch (err) {
    console.error('Failed to load user profile at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), err)
    Swal.fire({ icon: 'error', title: 'Error', text: 'Unable to load profile data. Please try again later.' })
  } finally {
    isLoading.value = false
    console.log('Loading state set to:', isLoading.value)
  }
})

onUnmounted(() => {
  updateProfileDisplay();
  previewImage.value = null
  imageFile.value = null
  console.log('Component unmounted, preview image revoked at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
})

const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      Swal.fire({ icon: 'error', title: 'Invalid File', text: 'Please select a valid image file (JPG, PNG)' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'File Too Large', text: 'Image size should be less than 5MB' })
      return
    }
    updateProfileDisplay();
    imageFile.value = file
    previewImage.value = URL.createObjectURL(file)
    console.log('Image changed, file:', file.name, 'size:', file.size, 'type:', file.type, 'preview URL:', previewImage.value, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
  } else {
    console.log('No file selected at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
    imageFile.value = null
    updateProfileDisplay();
  }
}

const validateForm = () => {
  if (!editForm.value.username) {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Username is required' })
    return false
  }
  if (!editForm.value.email || !/\S+@\S+\.\S+/.test(editForm.value.email)) {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'A valid email is required' })
    return false
  }
  if (editForm.value.phone && !editForm.value.phone.startsWith('0')) {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Phone number must start with 0' })
    return false
  }
  if (editForm.value.date_of_birth) {
    const dob = new Date(editForm.value.date_of_birth)
    if (dob > new Date()) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Date of birth cannot be in the future' })
      return false
    }
  }
  console.log('Form validated successfully with:', editForm.value, 'Image file:', imageFile.value?.name, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
  return true
}

const updateProfile = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  const formData = new FormData()
  formData.append('username', editForm.value.username)
  formData.append('email', editForm.value.email)
  formData.append('phone', editForm.value.phone || '')
  formData.append('date_of_birth', editForm.value.date_of_birth || '')
  if (editForm.value.password) {
    formData.append('password', editForm.value.password)
  }
  if (imageFile.value) {
    formData.append('profile_image', imageFile.value)
  }

  const userId = userStore.userProfile?.user?.id
  if (!userId) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'User ID not found' })
    isSubmitting.value = false
    return
  }

  try {
    // Update to handle the API response format correctly
    const response = await userStore.updateUser(userId, formData)
    
    // Handle different response formats
    const result = response.data || response
    
    if (result.success || result.user) {
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile was updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      })
      
      editMode.value = false
      imageFile.value = null
      
      // Store in localStorage for quick access
      if (result.profile_image || result.user?.profile_image) {
        const imageUrl = result.profile_image || result.user.profile_image;
        localStorage.setItem('profile_image', imageUrl);
      }
      
      // Fetch fresh profile to ensure sync
      await userStore.fetchUserProfile()
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: result.error || 'Failed to update profile' })
    }
  } catch (err) {
    console.error('Update failed:', err)
    Swal.fire({ icon: 'error', title: 'Error', text: 'An unexpected error occurred while updating the profile' })
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.back()
  console.log('Navigated back at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
}

const handleImageError = () => {
  console.log('Image load failed at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
  // Fallback to default image
  previewImage.value = '/default-profile.png'
  updateProfileDisplay();
}
</script>

<template>
  <div class="max-w-[90vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
    <!-- Back Button -->
    <div class="mb-4 sm:mb-6 md:mb-8">
      <button 
        @click="goBack" 
        class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
      >
        <ArrowLeft class="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span class="font-medium text-xs sm:text-sm md:text-base">Back</span>
      </button>
    </div>

    <!-- Profile Card -->
    <div v-if="isLoading" class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 text-center">
      <p class="text-slate-600 text-xs sm:text-sm md:text-base">Loading profile...</p>
    </div>
    <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- Cover Section -->
      <div class="h-20 sm:h-24 md:h-28 lg:h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 flex justify-end items-center pr-2 sm:pr-4 md:pr-6">
        <img class="w-12 sm:w-16 md:w-20 lg:w-24" src="/logo.png" alt="Logo" />
      </div>
      
      <!-- Profile Content -->
      <div class="relative px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
        <!-- Profile Image -->
        <div class="relative -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16 mb-4 sm:mb-6">
          <div class="relative inline-block">
            <div class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-slate-100">
              <img
                v-if="hasValidProfileImage"
                :src="profileImageUrl"
                :alt="editForm.username || 'Profile'"
                class="w-full h-full rounded-full object-cover"
                @error="handleImageError"
              />
              <span
                v-else
                class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white bg-indigo-500 rounded-full h-full w-full flex items-center justify-center"
              >
                {{ profileInitial }}
              </span>
            </div>
            <!-- Online Status -->
            <div 
              class="absolute bottom-1 sm:bottom-1.5 md:bottom-2 right-1 sm:right-1.5 md:right-2 w-3 sm:w-4 md:w-5 lg:w-6 h-3 sm:h-4 md:h-5 lg:h-6 rounded-full border-2 sm:border-3 md:border-4 border-white shadow-sm"
              :class="userStore.userProfile?.isOnline ? 'bg-green-500' : 'bg-slate-400'"
            ></div>
            
            <!-- Camera Icon for Edit Mode -->
            <div v-if="editMode" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
              <Camera class="w-5 sm:w-6 md:w-7 lg:w-8 h-5 sm:h-6 md:h-7 lg:h-8 text-white" />
              <input 
                type="file" 
                @change="handleImageChange" 
                accept="image/*" 
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
          <div class="flex-1">
            <div class="mb-4 sm:mb-6">
              <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                {{ userStore.userProfile?.user?.username || 'Unknown User' }}
              </h1>
              <div v-if="!editMode" class="space-y-2 text-slate-600 text-xs sm:text-sm md:text-base">
                <div class="flex items-center gap-2">
                  <Mail class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                  <span class="truncate">{{ userStore.userProfile?.user?.email || 'Not provided' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Phone class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                  <span>{{ userStore.userProfile?.user?.phone || 'Not provided' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Calendar class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                  <span>{{ userStore.userProfile?.user?.date_of_birth || 'Not provided' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Shield class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                  <span class="capitalize">{{ userStore.userProfile?.user?.role?.name || 'No Role Assigned' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div v-if="!editMode" class="flex-shrink-0">
            <button
              @click="editMode = true"
              class="inline-flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl font-medium text-xs sm:text-sm md:text-base"
              :disabled="isSubmitting"
            >
              <Edit3 class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-if="editMode" class="mt-4 sm:mt-6 md:mt-8 border-t border-slate-200 pt-4 sm:pt-6 md:pt-8">
          <div class="mb-4 sm:mb-6">
            <h2 class="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-slate-900 mb-2">Edit Profile</h2>
            <p class="text-slate-600 text-xs sm:text-sm md:text-base">Update your profile information below.</p>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4 sm:space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <!-- Username -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium text-slate-700">
                  <User class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                  Username
                </label>
                <input 
                  v-model="editForm.username" 
                  type="text" 
                  placeholder="Enter username"
                  class="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-xs sm:text-sm md:text-base"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium text-slate-700">
                  <Mail class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                  Email
                </label>
                <input 
                  v-model="editForm.email" 
                  type="email" 
                  placeholder="Enter email"
                  class="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-xs sm:text-sm md:text-base"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Phone -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium text-slate-700">
                  <Phone class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                  Phone
                </label>
                <input 
                  v-model="editForm.phone" 
                  type="text" 
                  placeholder="Enter phone number"
                  class="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-xs sm:text-sm md:text-base"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Date of Birth -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium text-slate-700">
                  <Calendar class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                  Date of Birth
                </label>
                <input 
                  v-model="editForm.date_of_birth" 
                  type="date"
                  class="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-xs sm:text-sm md:text-base"
                  :disabled="isSubmitting"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium text-slate-700">
                <Shield class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                New Password (leave blank to keep current)
              </label>
              <input 
                v-model="editForm.password" 
                type="password" 
                placeholder="Enter new password"
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-xs sm:text-sm md:text-base"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Profile Image Upload -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium text-slate-700">
                <Upload class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                Profile Image
              </label>
              <div class="flex items-center gap-3 sm:gap-4">
                <input 
                  type="file" 
                  @change="handleImageChange" 
                  accept="image/*"
                  class="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white file:mr-3 sm:mr-4 file:py-1 sm:py-1.5 md:py-2 file:px-3 sm:px-4 file:rounded-lg file:border-0 file:text-xs sm:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  :disabled="isSubmitting"
                />
                <div v-if="previewImage" class="w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 rounded-lg overflow-hidden border-2 border-slate-200">
                  <img :src="profileImageUrl" class="w-full h-full object-cover" @error="handleImageError" />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button 
                type="submit" 
                class="inline-flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl font-medium text-xs sm:text-sm md:text-base"
                :disabled="isSubmitting"
              >
                <Save class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
              <button 
                type="button" 
                @click="editMode = false" 
                class="inline-flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors duration-200 font-medium text-xs sm:text-sm md:text-base"
                :disabled="isSubmitting"
              >
                <X class="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>