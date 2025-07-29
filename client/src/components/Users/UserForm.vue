<template>
  <div v-if="show" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <h3 class="text-lg font-bold mb-4">{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
      <div v-if="userStore.error" class="text-red-500 mb-2">{{ userStore.error }}</div>
      <div v-else-if="localError" class="text-red-500 mb-2">{{ localError }}</div>
      <form @submit.prevent="handleSubmit">
        <input v-model="form.username" placeholder="Username" class="w-full p-2 border rounded mb-2" required />
        <input v-model="form.email" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" required />
        <input v-if="!isEditing" v-model="form.password" type="password" placeholder="Password" class="w-full p-2 border rounded mb-2" required />
        <input v-model="form.phone" placeholder="Phone" class="w-full p-2 border rounded mb-2" />
        <input
          v-model="form.avatar"
          type="text"
          placeholder="Avatar URL"
          class="w-full p-2 border rounded mb-2"
        />
        <select v-model="form.RoleId" class="w-full p-2 border rounded mb-2" required>
          <option disabled value="">Select role</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded" :disabled="userStore.loading">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded" :disabled="userStore.loading">
            {{ isEditing ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const props = defineProps({
  show: Boolean,
  isEditing: Boolean,
  form: {
    type: Object,
    default: () => ({ username: '', email: '', password: '', phone: '', RoleId: '', avatar: '' })
  },
  roles: Array
});
const emit = defineEmits(['close', 'submit']);
const localError = ref('');

function handleSubmit() {
  if (!props.form.username || !props.form.email || (!props.isEditing && !props.form.password) || !props.form.RoleId) {
    localError.value = 'Please fill in all required fields';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.form.email)) {
    localError.value = 'Please enter a valid email';
    return;
  }
  localError.value = '';
  emit('submit', props.form);
}
</script>