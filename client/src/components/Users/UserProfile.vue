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

// Computed property for the first letter of the email
const profileInitial = computed(() => userStore.userProfile?.user?.email?.charAt(0)?.toUpperCase() || '?')

// Computed property to check if a valid profile image exists
const hasValidProfileImage = computed(() => {
  const image = previewImage.value || userStore.userProfile?.user?.profile_image || userStore.profileImage || ''
  return image && (image.startsWith('http') || image.startsWith('data:image') || image.startsWith('blob:'))
})

watch(() => userStore.userProfile?.user?.profile_image, (newImage) => {
  const imageUrl = newImage ? `${newImage}?t=${new Date().getTime()}` : userStore.profileImage || null
  previewImage.value = imageUrl
  console.log('Profile image updated in store at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), 'Image:', imageUrl, 'profileImage:', userStore.profileImage)
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
      previewImage.value = userStore.userProfile.user.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null
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
  if (previewImage.value && previewImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.value)
  }
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
    if (previewImage.value && previewImage.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage.value)
    }
    imageFile.value = file
    previewImage.value = URL.createObjectURL(file)
    console.log('Image changed, file:', file.name, 'size:', file.size, 'type:', file.type, 'preview URL:', previewImage.value, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
  } else {
    console.log('No file selected at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
    imageFile.value = null
    previewImage.value = userStore.userProfile?.user?.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null
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
    console.log('Appending image to FormData:', imageFile.value.name, 'size:', imageFile.value.size, 'type:', imageFile.value.type, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
  } else {
    console.log('No image file to append at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
  }

  const userId = userStore.userProfile?.user?.id
  if (!userId) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'User ID not found' })
    isSubmitting.value = false
    return
  }

  try {
    const result = await userStore.updateUser(userId, formData)
    console.log('Update result:', result, 'Profile image from response:', result.profile_image, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
    if (result.success) {
      // Custom success alert matching the image
      Swal.fire({
        title: 'Success',
        html: `
          <div class="flex flex-col items-center justify-center p-4">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">Success</h3>
            <p class="text-sm text-gray-500">The book has been updated successfully.</p>
          </div>
        `,
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'rounded-lg shadow-xl border border-gray-200'
        }
      })
      
      editMode.value = false
      // Set previewImage from response or userProfile
      previewImage.value = result.profile_image ? `${result.profile_image}?t=${new Date().getTime()}` : userStore.userProfile?.user?.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null
      console.log('Set previewImage after update:', previewImage.value, 'profileImage:', userStore.profileImage, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
      imageFile.value = null
      // Fetch fresh profile to ensure sync
      await userStore.fetchUserProfile()
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: result.error || 'Failed to update profile' })
    }
  } catch (err) {
    console.error('Update failed at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), err)
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
  // Fallback to userStore.profileImage or null
  previewImage.value = userStore.userProfile?.user?.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null
}
</script>

<template>
  <div class="mt-8">
    <!-- Profile Card -->
    <div v-if="isLoading" class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 text-center max-w-3xl mx-auto">
      <p class="text-gray-500 text-sm sm:text-base md:text-lg animate-pulse">Loading your profile...</p>
    </div>
    <div v-else class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
      <!-- Cover Section -->
      <div class="h-24 sm:h-28 md:h-32 lg:h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 flex justify-end items-center pr-4 sm:pr-6 md:pr-8">
        <img class="w-16 sm:w-20 md:w-24 lg:w-28" src="/logo.png" alt="Logo" />
      </div>
      
      <!-- Profile Content -->
      <div class="relative px-6 sm:px-8 md:px-10 pb-6 sm:pb-8 md:pb-10">
        <!-- Profile Image -->
        <div class="relative -mt-14 sm:-mt-16 md:-mt-20 lg:-mt-24 mb-6 sm:mb-8">
          <div class="relative inline-block">
            <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-white shadow-xl flex items-center justify-center bg-gray-100 transition-transform duration-300 hover:scale-105">
              <img
                v-if="hasValidProfileImage"
                :src="previewImage || userStore.userProfile?.user?.profile_image || userStore.profileImage || 'https://placehold.co/128x128'"
                alt="Profile"
                class="w-full h-full rounded-full object-cover"
                @error="handleImageError"
              />
              <span
                v-else
                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white bg-indigo-600 rounded-full h-full w-full flex items-center justify-center"
              >
                {{ profileInitial }}
              </span>
            </div>
            <!-- Online Status -->
            <div 
              class="absolute bottom-1 right-1 w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 rounded-full border-3 border-white shadow-md"
              :class="userStore.userProfile?.isOnline ? 'bg-green-500' : 'bg-gray-400'"
            ></div>
            
            <!-- Camera Icon for Edit Mode -->
            <div v-if="editMode" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <Camera class="w-6 sm:w-7 md:w-8 lg:w-9 h-6 sm:h-7 md:h-8 lg:h-9 text-white" />
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
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6 sm:gap-8">
          <div class="flex-1">
            <div class="mb-6 sm:mb-8">
              <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                {{ userStore.userProfile?.user?.username || 'Unknown User' }}
              </h1>
              <div v-if="!editMode" class="space-y-3 text-gray-600 text-sm sm:text-base md:text-lg">
                <div class="flex items-center gap-3">
                  <Mail class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                  <span class="truncate">{{ userStore.userProfile?.user?.email || 'Not provided' }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <Phone class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                  <span>{{ userStore.userProfile?.user?.phone || 'Not provided' }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <Calendar class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                  <span>{{ userStore.userProfile?.user?.date_of_birth || 'Not provided' }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <Shield class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                  <span class="capitalize">{{ userStore.userProfile?.user?.role?.name || 'No Role Assigned' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div v-if="!editMode" class="flex-shrink-0">
            <button
              @click="editMode = true"
              class="inline-flex items-center gap-3 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base md:text-lg"
              :disabled="isSubmitting"
            >
              <Edit3 class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-if="editMode" class="mt-6 sm:mt-8 md:mt-10 border-t border-gray-200 pt-6 sm:pt-8 md:pt-10">
          <div class="mb-6 sm:mb-8">
            <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">Edit Profile</h2>
            <p class="text-gray-500 text-sm sm:text-base md:text-lg">Update your profile information below.</p>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-6 sm:space-y-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <!-- Username -->
              <div class="space-y-2">
                <label class="flex items-center gap-3 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                  <User class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                  Username
                </label>
                <input 
                  v-model="editForm.username" 
                  type="text" 
                  placeholder="Enter username"
                  class="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base md:text-lg placeholder-gray-400"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <label class="flex items-center gap-3 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                  <Mail class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                  Email
                </label>
                <input 
                  v-model="editForm.email" 
                  type="email" 
                  placeholder="Enter email"
                  class="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base md:text-lg placeholder-gray-400"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Phone -->
              <div class="space-y-2">
                <label class="flex items-center gap-3 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                  <Phone class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                  Phone
                </label>
                <input 
                  v-model="editForm.phone" 
                  type="text" 
                  placeholder="Enter phone number"
                  class="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base md:text-lg placeholder-gray-400"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Date of Birth -->
              <div class="space-y-2">
                <label class="flex items-center gap-3 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                  <Calendar class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                  Date of Birth
                </label>
                <input 
                  v-model="editForm.date_of_birth" 
                  type="date"
                  class="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base md:text-lg"
                  :disabled="isSubmitting"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="flex items-center gap-3 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                <Shield class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                New Password (leave blank to keep current)
              </label>
              <input 
                v-model="editForm.password" 
                type="password" 
                placeholder="Enter new password"
                class="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base md:text-lg placeholder-gray-400"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Profile Image Upload -->
            <div class="space-y-2">
              <label class="flex items-center gap-3 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                <Upload class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-indigo-600" />
                Profile Image
              </label>
              <div class="flex items-center gap-4 sm:gap-6">
                <input 
                  type="file" 
                  @change="handleImageChange" 
                  accept="image/*"
                  class="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white file:mr-4 sm:mr-5 file:py-2 sm:py-2.5 md:py-3 file:px-4 sm:px-5 file:rounded-lg file:border-0 file:text-sm sm:file:text-base file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  :disabled="isSubmitting"
                />
                <div v-if="previewImage" class="w-12 sm:w-14 md:w-16 lg:w-20 h-12 sm:h-14 md:h-16 lg:h-20 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                  <img :src="previewImage" class="w-full h-full object-cover" @error="handleImageError" />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 sm:pt-8">
              <button 
                type="submit" 
                class="inline-flex items-center gap-3 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base md:text-lg"
                :disabled="isSubmitting"
              >
                <Save class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
              <button 
                type="button" 
                @click="editMode = false" 
                class="inline-flex items-center gap-3 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold text-sm sm:text-base md:text-lg"
                :disabled="isSubmitting"
              >
                <X class="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>