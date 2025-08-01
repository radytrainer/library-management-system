<script setup>
import { ref, watch, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const props = defineProps({
  show: Boolean,
  isEditing: Boolean,
  formData: Object, // user data object
  userId: [String, Number], // Add userId prop for editing
});

const emits = defineEmits(['close', 'submit-success']);

const localForm = ref({
  username: '',
  email: '',
  password: '',
  phone: '',
  roleId: '',
  date_of_birth: '',
  profile_image: '',
  profile_image_file: null,
  profile_image_preview: null,
});

const errorMessage = ref(''); // To display errors from the store

// Watch for changes in formData (when editing)
watch(
  () => props.formData,
  (val) => {
    if (val) {
      localForm.value = {
        username: val.username || '',
        email: val.email || '',
        password: '',
        phone: val.phone || '',
        roleId: val.roleId || '',
        date_of_birth: val.date_of_birth || '',
        profile_image: val.profile_image || '',
        profile_image_file: null,
        profile_image_preview: val.profile_image || null,
      };
    }
  },
  { immediate: true }
);

// Fetch roles when the component is mounted
onMounted(async () => {
  const result = await userStore.fetchRoles();
  if (!result.success) {
    errorMessage.value = result.error;
  }
});

// Handle file input change
function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    localForm.value.profile_image_file = file;
    localForm.value.profile_image_preview = URL.createObjectURL(file);
  }
}

// Handle form submission
async function submitForm() {
  errorMessage.value = ''; // Reset error message
  let result;

  if (props.isEditing) {
    // Update user
    result = await userStore.updateUser(props.userId, localForm.value);
  } else {
    // Create user
    result = await userStore.createUser(localForm.value);
  }

  if (result.success) {
    emits('submit-success', localForm.value); // Emit success event
    closeModal(); // Close the modal on success
  } else {
    errorMessage.value = result.error; // Display error from the store
  }
}

// Close the modal
function closeModal() {
  emits('close');
  localForm.value = {
    username: '',
    email: '',
    password: '',
    phone: '',
    roleId: '',
    date_of_birth: '',
    profile_image: '',
    profile_image_file: null,
    profile_image_preview: null,
  }; // Reset form
  errorMessage.value = ''; // Reset error
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div class="bg-white rounded p-6 w-96 max-h-[90vh] overflow-auto">
      <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit User' : 'Add User' }}</h2>

      <!-- Display error message -->
      <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>

      <form @submit.prevent="submitForm" class="space-y-3">
        <label>
          Username
          <input v-model="localForm.username" required class="w-full border rounded p-1" />
        </label>

        <label>
          Email
          <input type="email" v-model="localForm.email" required class="w-full border rounded p-1" />
        </label>

        <label>
          {{ isEditing ? 'New Password (leave blank to keep)' : 'Password' }}
          <input type="password" v-model="localForm.password" :required="!isEditing" class="w-full border rounded p-1" />
        </label>

        <label>
          Phone
          <input v-model="localForm.phone" class="w-full border rounded p-1" />
        </label>

        <label>
          Role
          <select v-model="localForm.roleId" required class="w-full border rounded p-1">
            <option value="" disabled>Select role</option>
            <option v-for="role in userStore.roles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </label>

        <label>
          Birthday
          <input type="date" v-model="localForm.date_of_birth" class="w-full border rounded p-1" />
        </label>

        <label>
          Profile Image
          <input type="file" @change="onFileChange" accept="image/*" />
          <div v-if="localForm.profile_image_preview" class="mt-2">
            <img :src="localForm.profile_image_preview" alt="Preview" class="w-20 h-20 object-cover rounded" />
          </div>
        </label>

        <div class="flex justify-end space-x-2 mt-4">
          <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded" :disabled="userStore.loading">
            {{ userStore.loading ? 'Processing...' : isEditing ? 'Save' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>