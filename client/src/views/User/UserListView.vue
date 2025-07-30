<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>
    <div v-if="userStore.loading" class="mb-4">Loading users...</div>
    <div v-else-if="userStore.error" class="text-red-500 mb-4">{{ userStore.error }}</div>
    <div class="">
      <a class="border p-2 rounded-md bg-blue-500 text-white" href="http://localhost:5000/api/users/barcodes/excel"
        target="_blank">
        Download Excel with Profile & Barcode
      </a>

      <button @click="showForm = true" class="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        :disabled="userStore.loading">Add User</button>
    </div>
    <UserTable :users="userStore.users" @edit="editUser" @delete="deleteUser" />
    <UserForm :show="showForm" :is-editing="isEditing" :form="form" :roles="userStore.roles" @close="closeForm"
      @submit="submitForm" />
    <UserViewModal :show="showViewModal" :user="userStore.viewedUser" @close="showViewModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import UserTable from '@/components/Users/UserTable.vue';
import UserForm from '@/components/Users/UserForm.vue';
import UserViewModal from '@/components/Users/UserViewModal.vue';

const userStore = useUserStore();
const showForm = ref(false);
const isEditing = ref(false);
const showViewModal = ref(false);
const form = ref({
  username: '',
  email: '',
  password: '',
  phone: '',
  RoleId: '',
  avatar: '',
});

onMounted(async () => {
  await userStore.fetchUsers();
  await userStore.fetchRoles();
});

function editUser(user) {
  form.value = { ...user, password: '', avatar: user.avatar || '' };
  isEditing.value = true;
  showForm.value = true;
}

async function deleteUser(id) {
  await userStore.deleteUser(id);
}

function closeForm() {
  showForm.value = false;
  isEditing.value = false;
  form.value = { username: '', email: '', password: '', phone: '', RoleId: '', avatar: '' };
}

async function submitForm(data) {
  const result = isEditing.value
    ? await userStore.updateUser(data.id, data)
    : await userStore.createUser(data);
  if (result.success) {
    closeForm();
  }
}
</script>