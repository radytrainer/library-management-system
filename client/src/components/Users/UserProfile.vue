<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
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

// Watch for changes in userProfile to update previewImage
watch(() => userStore.userProfile?.profile_image, (newImage) => {
  previewImage.value = newImage ? `${newImage}?t=${new Date().getTime()}` : null // Add timestamp for cache busting
  console.log('Profile image updated in store at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), previewImage.value)
})

onMounted(async () => {
  console.log('Starting profile fetch at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
  isLoading.value = true
  console.log('Loading state set to:', isLoading.value)
  try {
    await userStore.fetchUserProfile()
    console.log('Profile data fetched at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), userStore.userProfile)
    if (userStore.userProfile && userStore.userProfile.user && Object.keys(userStore.userProfile.user).length > 0) {
      const userData = userStore.userProfile.user
      Object.assign(editForm.value, {
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
      })
      previewImage.value = userStore.userProfile.profile_image ? `${userStore.userProfile.profile_image}?t=${new Date().getTime()}` : null
      console.log('Edit form updated with:', editForm.value)
      console.log('Nested user data:', userData)
    } else {
      console.warn('No user data available in profile at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), userStore.userProfile)
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
  console.log('Component unmounted, preview image revoked at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
})

const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (previewImage.value && previewImage.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage.value)
    }
    imageFile.value = file
    previewImage.value = URL.createObjectURL(file)
    console.log('Image changed, new file:', file.name, 'preview URL:', previewImage.value, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
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
  // Optional: Validate date_of_birth (e.g., not future date)
  if (editForm.value.date_of_birth) {
    const dob = new Date(editForm.value.date_of_birth)
    if (dob > new Date()) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Date of birth cannot be in the future' })
      return false
    }
  }
  console.log('Form validated successfully with:', editForm.value, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
  return true
}

const updateProfile = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  const formData = new FormData()
  formData.append('username', editForm.value.username)
  formData.append('email', editForm.value.email)
  formData.append('phone', editForm.value.phone)
  formData.append('date_of_birth', editForm.value.date_of_birth)
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


  const result = await userStore.updateUser(userId, formData)
  if (result.success) {
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated',
      text: 'Your profile was updated successfully.',
      timer: 2000,
      showConfirmButton: false,
    })
    editMode.value = false
    await userStore.fetchUserProfile()
    imageFile.value = null
    previewImage.value = userStore.userProfile?.profile_image || null
  } else {
    Swal.fire({ icon: 'error', title: 'Error', text: result.error || 'Failed to update profile' })
  }
  isSubmitting.value = false
}



const goBack = () => {
  router.back()
  console.log('Navigated back at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
}

const handleImageError = (event) => {
  // event.target.src = '/placeholder.png'
  console.log('Image load failed, switched to placeholder at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }))
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <button 
          @click="goBack" 
          class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span class="font-medium">Back</span>
        </button>
      </div>

      <!-- Profile Card -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <p class="text-slate-600">Loading profile...</p>
      </div>
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Cover Section -->
        <div class="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex justify-end items-center pr-4">
          <img class="w-20" src="/logo.png" alt="Logo" />
        </div>
        
        <!-- Profile Content -->
        <div class="relative px-8 pb-8">
          <!-- Profile Image -->
          <div class="relative -mt-16 mb-6">
            <div class="relative inline-block">
              <img
                :src="previewImage || userStore.profileImage || 'https://placehold.co/128x128'"
                class="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-slate-100"
                @error="handleImageError"
              />
              <!-- Online Status -->
              <div 
                class="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white shadow-sm"
                :class="userStore.userProfile?.isOnline ? 'bg-green-500' : 'bg-slate-400'"
              ></div>
              
              <!-- Camera Icon for Edit Mode -->
              <div v-if="editMode" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                <Camera class="w-8 h-8 text-white" />
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
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div class="flex-1">
              <div class="mb-6">
                <h1 class="text-3xl font-bold text-slate-900 mb-2">
                  {{ userStore.userProfile?.user?.username || 'Unknown User' }}
                </h1>
                <div v-if="!editMode" class="space-y-2 text-slate-600">
                  <div class="flex items-center gap-2">
                    <Mail class="w-4 h-4" />
                    <span>{{ userStore.userProfile?.user?.email || 'Not provided' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Phone class="w-4 h-4" />
                    <span>{{ userStore.userProfile?.user?.phone || 'Not provided' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4" />
                    <span>{{ userStore.userProfile?.user?.date_of_birth || 'Not provided' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Shield class="w-4 h-4" />
                    <span class="capitalize">{{ userStore.userProfile?.user?.role?.name || 'No Role Assigned' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div v-if="!editMode" class="flex-shrink-0">
              <button
                @click="editMode = true"
                class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl font-medium"
                :disabled="isSubmitting"
              >
                <Edit3 class="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          <!-- Edit Form -->
          <div v-if="editMode" class="mt-8 border-t border-slate-200 pt-8">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-slate-900 mb-2">Edit Profile</h2>
              <p class="text-slate-600">Update your profile information below.</p>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Username -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <User class="w-4 h-4" />
                    Username
                  </label>
                  <input 
                    v-model="editForm.username" 
                    type="text" 
                    placeholder="Enter username"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    :disabled="isSubmitting"
                  />
                </div>

                <!-- Email -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Mail class="w-4 h-4" />
                    Email
                  </label>
                  <input 
                    v-model="editForm.email" 
                    type="email" 
                    placeholder="Enter email"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    :disabled="isSubmitting"
                  />
                </div>

                <!-- Phone -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Phone class="w-4 h-4" />
                    Phone
                  </label>
                  <input 
                    v-model="editForm.phone" 
                    type="text" 
                    placeholder="Enter phone number"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    :disabled="isSubmitting"
                  />
                </div>

                <!-- Date of Birth -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar class="w-4 h-4" />
                    Date of Birth
                  </label>
                  <input 
                    v-model="editForm.date_of_birth" 
                    type="date"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    :disabled="isSubmitting"
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Shield class="w-4 h-4" />
                  New Password (leave blank to keep current)
                </label>
                <input 
                  v-model="editForm.password" 
                  type="password" 
                  placeholder="Enter new password"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Profile Image Upload -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Upload class="w-4 h-4" />
                  Profile Image
                </label>
                <div class="flex items-center gap-4">
                  <input 
                    type="file" 
                    @change="handleImageChange" 
                    accept="image/*"
                    class="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    :disabled="isSubmitting"
                  />
                  <div v-if="previewImage" class="w-16 h-16 rounded-lg overflow-hidden border-2 border-slate-200">
                    <img :src="previewImage" class="w-full h-full object-cover" @error="handleImageError" />
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl font-medium"
                  :disabled="isSubmitting"
                >
                  <Save class="w-4 h-4" />
                  <span v-if="isSubmitting">Saving...</span>
                  <span v-else>Save Changes</span>
                </button>
                <button 
                  type="button" 
                  @click="editMode = false" 
                  class="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors duration-200 font-medium"
                  :disabled="isSubmitting"
                >
                  <X class="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>