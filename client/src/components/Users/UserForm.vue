<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { useUserStore } from '@/stores/userStore';
import UserCard from './UserCard.vue';

const userStore = useUserStore();

const props = defineProps({
  show: Boolean,
  isEditing: Boolean,
  formData: Object,
  userId: [String, Number],
});

const emits = defineEmits(['close', 'submit-success']);

const localForm = ref({
  username: '',
  email: '',
  password: '',
  phone: '',
  RoleId: '', // Changed from roleId to RoleId
  date_of_birth: '',
  profile_image: '',
  profile_image_file: null,
  profile_image_preview: null,
  status: 'active', // Added status field
});

const errorMessage = ref('');
const idCardRef = ref(null);
const newUser = ref(null);

onMounted(async () => {
  const result = await userStore.fetchRoles();
  if (!result.success) {
    errorMessage.value = result.error;
  }
});

watch(
  () => props.formData,
  (val) => {
    if (val) {
      localForm.value = {
        username: val.username || '',
        email: val.email || '',
        password: '',
        phone: val.phone || '',
        RoleId: val.RoleId || '', // Changed from roleId to RoleId
        date_of_birth: val.date_of_birth || '',
        profile_image: val.profile_image || '',
        profile_image_file: null,
        profile_image_preview: val.profile_image || null,
        status: val.status || 'active', // Added status
      };
    }
  },
  { immediate: true }
);

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Please select a valid image file (JPG, PNG)';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Image size should be less than 5MB';
      return;
    }
    localForm.value.profile_image_file = file;
    localForm.value.profile_image_preview = URL.createObjectURL(file);
  }
}

function triggerFileInput() {
  const fileInput = document.getElementById('profile-image-input');
  if (fileInput) {
    fileInput.click();
  }
}

async function submitForm() {
  errorMessage.value = '';

  if (!props.isEditing) {
    if (!localForm.value.username || !localForm.value.email || !localForm.value.password) {
      errorMessage.value = 'Please provide a username, email, and password';
      return;
    }
  }

  const formData = new FormData();
  formData.append('username', localForm.value.username);
  formData.append('email', localForm.value.email);
  if (localForm.value.password) {
    formData.append('password', localForm.value.password);
  }
  if (localForm.value.phone) {
    formData.append('phone', localForm.value.phone);
  }
  if (localForm.value.RoleId) { // Changed from roleId to RoleId
    formData.append('RoleId', localForm.value.RoleId);
  }
  if (localForm.value.date_of_birth) {
    formData.append('date_of_birth', localForm.value.date_of_birth);
  }
  if (localForm.value.profile_image_file) {
    formData.append('profile_image', localForm.value.profile_image_file);
  }
  formData.append('status', localForm.value.status); // Added status

  let result;
  try {
    if (props.isEditing) {
      result = await userStore.updateUser(props.userId, formData);
    } else {
      result = await userStore.createUser(formData);
      if (result.success) {
        newUser.value = result.data;
        console.log('New user created:', newUser.value);
        if (idCardRef.value) {
          await nextTick();
          console.log('Generating card for user:', newUser.value.id);
          idCardRef.value.generateCard();
        } else {
          console.error('idCardRef is not initialized');
        }
      }
    }

    if (result.success) {
      emits('submit-success', localForm.value);
      closeModal();
    } else {
      errorMessage.value = result.error || 'Failed to save user. Please try again.';
    }
  } catch (error) {
    errorMessage.value = error.message || 'An unexpected error occurred.';
  }
}

function closeModal() {
  emits('close');
  if (localForm.value.profile_image_preview && localForm.value.profile_image_preview.startsWith('blob:')) {
    URL.revokeObjectURL(localForm.value.profile_image_preview);
  }
  localForm.value = {
    username: '',
    email: '',
    password: '',
    phone: '',
    RoleId: '', // Changed from roleId to RoleId
    date_of_birth: '',
    profile_image: '',
    profile_image_file: null,
    profile_image_preview: null,
    status: 'active', // Added status
  };
  errorMessage.value = '';
  newUser.value = null;
}
</script>

<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-6 animate-in fade-in duration-300"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
      <div class="flex-shrink-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-6 rounded-t-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white mb-1">
              {{ isEditing ? 'Edit User' : 'Create New User' }}
            </h2>
            <p class="text-indigo-100 text-sm opacity-90">
              {{ isEditing ? 'Update user information' : 'Add a new user to the system' }}
            </p>
          </div>
          <button 
            @click="closeModal"
            class="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-full hover:rotate-90 transform"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 p-8 bg-gradient-to-b from-gray-50/30 to-white overflow-hidden">
        <div 
          v-if="errorMessage" 
          class="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 rounded-r-lg text-red-800 text-sm flex items-start gap-3 shadow-sm"
        >
          <div class="flex-shrink-0 mt-0.5">
            <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <p class="font-medium">Error</p>
            <p class="mt-1">{{ errorMessage }}</p>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="h-full flex flex-col">
          <div class="flex-1 grid grid-cols-12 gap-8">
            <div class="col-span-4 flex flex-col items-center justify-start">
              <div class="w-full max-w-xs">
                <h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">Profile Photo</h3>
                <div class="relative group mb-4">
                  <div 
                    class="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 group-hover:scale-105 mx-auto"
                    @click="triggerFileInput"
                  >
                    <img 
                      v-if="localForm.profile_image_preview" 
                      :src="localForm.profile_image_preview" 
                      alt="Profile Preview" 
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400 group-hover:text-gray-500 transition-colors">
                      <div class="text-center">
                        <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p class="text-sm font-medium">Click to upload</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    @click="triggerFileInput"
                    class="absolute -bottom-3 -right-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <p class="text-center text-sm text-gray-500">Max 5MB • JPG, PNG</p>
                <input 
                  id="profile-image-input"
                  type="file" 
                  @change="onFileChange" 
                  accept="image/*" 
                  class="hidden" 
                />
              </div>
            </div>

            <div class="col-span-8">
              <div class="grid grid-cols-2 gap-6 h-full">
                <div class="space-y-5">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Username <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                      <input 
                        v-model="localForm.username" 
                        required 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="Enter username"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Email Address <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                      <input 
                        type="email" 
                        v-model="localForm.email" 
                        required 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="Enter email address"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      {{ isEditing ? 'New Password' : 'Password' }}
                      <span v-if="!isEditing" class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                      <input 
                        type="password" 
                        v-model="localForm.password" 
                        :required="!isEditing" 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-300"
                        :placeholder="isEditing ? 'Leave blank to keep current' : 'Enter password'"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-5">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <div class="relative">
                      <input 
                        v-model="localForm.phone" 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="Enter phone number"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Role <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                      <select 
                        v-model="localForm.RoleId" 
                        required 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-300 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select a role</option>
                        <option v-for="role in userStore.roles" :key="role.id" :value="role.id">
                          {{ role.name }}
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Status <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                      <select 
                        v-model="localForm.status" 
                        required 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-300 appearance-none cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Date of Birth</label>
                    <div class="relative">
                      <input 
                        type="date" 
                        v-model="localForm.date_of_birth" 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-gray-300"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-shrink-0 flex justify-end gap-4 pt-6 border-t border-gray-200 mt-6">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-8 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-semibold hover:shadow-md transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
              :disabled="userStore.loading || (!isEditing && (!localForm.username || !localForm.email || !localForm.password || !localForm.RoleId))"
            >
              <svg 
                v-if="userStore.loading" 
                class="w-5 h-5 animate-spin" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ userStore.loading ? 'Processing...' : isEditing ? 'Save Changes' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <UserCard
    v-if="newUser"
    ref="idCardRef"
    :user="newUser"
    systemName="Library Digital"
    logoUrl="/path/to/your/logo.png"
  />
</template>