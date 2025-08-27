```vue
<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { ArrowLeft, Edit3, Save, X, Upload, User, Mail, Phone, Calendar, Shield, Camera } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const userStore = useUserStore();
const router = useRouter();

const editForm = ref({
  username: '',
  email: '',
  phone: '',
  date_of_birth: '',
  password: '',
});

const previewImage = ref(null);
const imageFile = ref(null);
const editMode = ref(false);
const isSubmitting = ref(false);
const isLoading = ref(true);

const profileInitial = computed(() => userStore.userProfile?.user?.email?.charAt(0)?.toUpperCase() || '?');
const hasValidProfileImage = computed(() => {
  const image = previewImage.value || userStore.userProfile?.user?.profile_image || userStore.profileImage || '';
  return image && (image.startsWith('http') || image.startsWith('data:image') || image.startsWith('blob:'));
});

watch(() => userStore.userProfile?.user?.profile_image, (newImage) => {
  const imageUrl = newImage ? `${newImage}?t=${new Date().getTime()}` : userStore.profileImage || null;
  previewImage.value = imageUrl;
  console.log('Profile image updated in store at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), 'Image:', imageUrl, 'profileImage:', userStore.profileImage);
});

onMounted(async () => {
  console.log('Starting profile fetch at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  isLoading.value = true;
  try {
    await userStore.fetchUserProfile();
    console.log('Profile data fetched at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), 'Data:', userStore.userProfile, 'profileImage:', userStore.profileImage, 'qr_code_image:', userStore.userProfile?.user?.qr_code_image);
    if (userStore.userProfile && userStore.userProfile.user && Object.keys(userStore.userProfile.user).length > 0) {
      const userData = userStore.userProfile.user;
      Object.assign(editForm.value, {
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
      });
      previewImage.value = userData.profile_image ? `${userData.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null;
      if (!userData.qr_code_image) {
        console.warn('No QR code image found in profile data:', userData);
        Swal.fire({ icon: 'warning', title: 'No QR Code', text: 'No QR code available. Try generating a new one.' });
      } else {
        // Add cache-busting for QR code
        userData.qr_code_image = `${userData.qr_code_image}?t=${new Date().getTime()}`;
      }
    } else {
      console.warn('No user data available in profile at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), userStore.userProfile);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No user data found. Please try again.' });
    }
  } catch (err) {
    console.error('Failed to load user profile at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), err);
    Swal.fire({ icon: 'error', title: 'Error', text: 'Unable to load profile data. Please try again later.' });
  } finally {
    isLoading.value = false;
    console.log('Loading state set to:', isLoading.value);
  }
});

onUnmounted(() => {
  if (previewImage.value && previewImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.value);
  }
  previewImage.value = null;
  imageFile.value = null;
  console.log('Component unmounted, preview image revoked at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
});

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      Swal.fire({ icon: 'error', title: 'Invalid File', text: 'Please select a valid image file (JPG, PNG)' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'File Too Large', text: 'Image size should be less than 5MB' });
      return;
    }
    if (previewImage.value && previewImage.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage.value);
    }
    imageFile.value = file;
    previewImage.value = URL.createObjectURL(file);
    console.log('Image changed, file:', file.name, 'size:', file.size, 'type:', file.type, 'preview URL:', previewImage.value, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  } else {
    console.log('No file selected at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
    imageFile.value = null;
    previewImage.value = userStore.userProfile?.user?.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null;
  }
};

const validateForm = () => {
  if (!editForm.value.username) {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Username is required' });
    return false;
  }
  if (!editForm.value.email || !/\S+@\S+\.\S+/.test(editForm.value.email)) {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'A valid email is required' });
    return false;
  }
  if (editForm.value.phone && !editForm.value.phone.startsWith('0')) {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Phone number must start with 0' });
    return false;
  }
  if (editForm.value.date_of_birth) {
    const dob = new Date(editForm.value.date_of_birth);
    if (dob > new Date()) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Date of birth cannot be in the future' });
      return false;
    }
  }
  console.log('Form validated successfully with:', editForm.value, 'Image file:', imageFile.value?.name, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  return true;
};

const updateProfile = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  const formData = new FormData();
  formData.append('username', editForm.value.username);
  formData.append('email', editForm.value.email);
  formData.append('phone', editForm.value.phone || '');
  formData.append('date_of_birth', editForm.value.date_of_birth || '');
  if (editForm.value.password) {
    formData.append('password', editForm.value.password);
  }
  if (imageFile.value) {
    formData.append('profile_image', imageFile.value);
    console.log('Appending image to FormData:', imageFile.value.name, 'size:', imageFile.value.size, 'type:', imageFile.value.type, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  } else {
    console.log('No image file to append at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  }

  const userId = userStore.userProfile?.user?.id;
  if (!userId) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'User ID not found' });
    isSubmitting.value = false;
    return;
  }

  try {
    const result = await userStore.updateUser(userId, formData);
    console.log('Update result:', result, 'Profile image from response:', result.profile_image, 'qr_code_image:', result.qr_code_image, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
    if (result.success) {
      Swal.fire({
        toast: true,
        text: 'Profile updated successfully.',
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'rounded-lg shadow-md border border-green-200 bg-green-50 text-green-700 p-2 flex items-center',
          title: 'text-sm font-medium mr-2',
          content: 'text-xs',
        },
      });
      editMode.value = false;
      previewImage.value = result.profile_image ? `${result.profile_image}?t=${new Date().getTime()}` : userStore.userProfile?.user?.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null;
      console.log('Set previewImage after update:', previewImage.value, 'profileImage:', userStore.profileImage, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
      imageFile.value = null;
      await userStore.fetchUserProfile();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: result.error || 'Failed to update profile' });
    }
  } catch (err) {
    console.error('Update failed at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), err);
    Swal.fire({ icon: 'error', title: 'Error', text: 'An unexpected error occurred while updating the profile' });
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.back();
  console.log('Navigated back at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
};

const handleImageError = () => {
  console.log('Image load failed at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  previewImage.value = userStore.userProfile?.user?.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null;
};

const handleQrCodeError = () => {
  console.log('QR code image load failed at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load QR code. Please try generating a new one.' });
};

const generateNewCodes = async () => {
  isSubmitting.value = true;
  try {
    // Placeholder: Assume userStore.generateQrCode exists and returns { success, qr_code_image }
    console.log('Attempting to generate new QR code for user:', userStore.userProfile?.user?.id, 'at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
    Swal.fire({ icon: 'info', title: 'Not Implemented', text: 'QR code generation is not yet available. Please provide the API endpoint.' });
    // Example implementation (uncomment if API exists):
    /*
    const result = await userStore.generateQrCode(userStore.userProfile?.user?.id);
    if (result.success && result.qr_code_image) {
      await userStore.fetchUserProfile(); // Refresh profile to get new QR code
      Swal.fire({ icon: 'success', title: 'Success', text: 'New QR code generated successfully.' });
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: result.error || 'Failed to generate QR code.' });
    }
    */
  } catch (err) {
    console.error('Failed to generate QR code at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }), err);
    Swal.fire({ icon: 'error', title: 'Error', text: 'An unexpected error occurred while generating the QR code.' });
  } finally {
    isSubmitting.value = false;
  }
};

const downloadData = () => {
  Swal.fire({ icon: 'info', title: 'Not Implemented', text: 'Data download is not yet available.' });
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-6 text-center">
      <p class="text-gray-500 text-sm sm:text-base animate-pulse">Loading your profile...</p>
    </div>

    <!-- Profile View -->
    <div v-else-if="!editMode" class="bg-white rounded-lg shadow-md">
      <!-- Profile Header -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg p-4 sm:p-6 text-white">
        <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div class="relative">
            <div class="w-20 sm:w-24 h-20 sm:h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-gray-100">
              <img v-if="hasValidProfileImage"
                :src="previewImage || userStore.userProfile?.user?.profile_image || userStore.profileImage || 'https://placehold.co/128x128'"
                alt="Profile" class="w-full h-full rounded-full object-cover" @error="handleImageError" />
              <span v-else class="text-2xl sm:text-3xl font-bold text-white bg-indigo-600 rounded-full h-full w-full flex items-center justify-center">
                {{ profileInitial }}
              </span>
            </div>
            <div class="absolute -bottom-2 -right-2 bg-green-500 w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 border-white flex items-center justify-center"
              :class="{ 'bg-gray-400': !userStore.userProfile?.isOnline }">
              <span class="text-xs font-bold text-white">✓</span>
            </div>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{{ userStore.userProfile?.user?.username || 'Unknown User' }}</h1>
            <p class="text-blue-100 mb-2 text-sm sm:text-base">{{ userStore.userProfile?.user?.email || 'Not provided' }}</p>
            <div class="flex justify-center sm:justify-start items-center space-x-2">
              <span class="px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white"
                :class="userStore.userProfile?.isOnline ? 'bg-green-500' : 'bg-gray-400'">
                {{ userStore.userProfile?.isOnline ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        <!-- Personal Information -->
        <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h2 class="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
            Personal Information
          </h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-200">
              <span class="text-gray-600 font-medium text-sm sm:text-base">Date of Birth</span>
              <span class="text-gray-800 text-sm sm:text-base">{{ userStore.userProfile?.user?.date_of_birth ? new Date(userStore.userProfile.user.date_of_birth).toLocaleDateString() : 'Not provided' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200">
              <span class="text-gray-600 font-medium text-sm sm:text-base">Phone</span>
              <span class="text-gray-800 text-sm sm:text-base">{{ userStore.userProfile?.user?.phone || 'Not provided' }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600 font-medium text-sm sm:text-base">Role</span>
              <span class="text-gray-800 text-sm sm:text-base capitalize">{{ userStore.userProfile?.user?.role?.name || 'No Role Assigned' }}</span>
            </div>
          </div>
        </div>

        <!-- QR Code & Barcode Section -->
        <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h2 class="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4z" clip-rule="evenodd"/>
            </svg>
            Identification Codes
          </h2>
          <div class="space-y-4">
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-2">QR Code</p>
              <div class="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                <img v-if="userStore.userProfile?.user?.qr_code_image"
                  :src="userStore.userProfile.user.qr_code_image" class="h-12 sm:h-16 md:h-24 w-auto object-contain" @error="handleQrCodeError" />
                <span v-else class="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No QR Code</span>
              </div>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-2">Barcode</p>
              <div class="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <img v-if="userStore.userProfile?.user?.barcode_image"
                  :src="userStore.userProfile.user.barcode_image" class="h-8 sm:h-10 md:h-12 w-auto object-contain" @error="handleImageError" />
                <span v-else class="h-8 sm:h-10 md:h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Barcode</span>
                <p class="text-xs text-gray-500 mt-2">{{ userStore.userProfile?.user?.barcode || 'Not provided' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 justify-center p-4 sm:p-6">
        <button @click="editMode = true" class="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center text-sm sm:text-base">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
          </svg>
          Edit Profile
        </button>
        <button @click="generateNewCodes" class="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center text-sm sm:text-base" :disabled="isSubmitting">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
          </svg>
          Generate New Codes
        </button>
        <button @click="downloadData" class="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center text-sm sm:text-base">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
          Download Data
        </button>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div class="mb-4 sm:mb-6">
        <h2 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">Edit Profile</h2>
        <p class="text-gray-500 text-sm sm:text-base">Update your profile information below.</p>
      </div>

      <form @submit.prevent="updateProfile" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Username -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <User class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
              Username
            </label>
            <input v-model="editForm.username" type="text" placeholder="Enter username"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base placeholder-gray-400"
              :disabled="isSubmitting" />
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <Mail class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
              Email
            </label>
            <input v-model="editForm.email" type="email" placeholder="Enter email"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base placeholder-gray-400"
              :disabled="isSubmitting" />
          </div>

          <!-- Phone -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <Phone class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
              Phone
            </label>
            <input v-model="editForm.phone" type="text" placeholder="Enter phone number"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base placeholder-gray-400"
              :disabled="isSubmitting" />
          </div>

          <!-- Date of Birth -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <Calendar class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
              Date of Birth
            </label>
            <input v-model="editForm.date_of_birth" type="date"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base"
              :disabled="isSubmitting" />
          </div>
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
            <Shield class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
            New Password (leave blank to keep current)
          </label>
          <input v-model="editForm.password" type="password" placeholder="Enter new password"
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base placeholder-gray-400"
            :disabled="isSubmitting" />
        </div>

        <!-- Profile Image Upload -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
            <Upload class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
            Profile Image
          </label>
          <div class="flex items-center gap-4 sm:gap-6">
            <input type="file" @change="handleImageChange" accept="image/*"
              class="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              :disabled="isSubmitting" />
            <div v-if="previewImage"
              class="w-12 sm:w-16 h-12 sm:h-16 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
              <img :src="previewImage" class="w-full h-full object-cover" @error="handleImageError" />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
          <button type="submit"
            class="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold text-sm sm:text-base"
            :disabled="isSubmitting">
            <Save class="w-4 sm:w-5 h-4 sm:h-5" />
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
          <button type="button" @click="editMode = false"
            class="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold text-sm sm:text-base"
            :disabled="isSubmitting">
            <X class="w-4 sm:w-5 h-4 sm:h-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>