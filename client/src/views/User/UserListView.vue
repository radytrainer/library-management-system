
<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">User Management</h2>
      <button @click="openAdd" class="px-4 py-2 bg-blue-600 text-white rounded">Add User</button>
    </div>

    <UserTable :users="userStore.users" @view="viewUser" @edit="editUser" @delete="deleteUser" />

    <UserForm :show="showForm" :form="form" :roles="userStore.roles" :isEditing="isEditing"
              @close="showForm=false" @submit="submitUser"/>

    <UserViewModal :show="showView" :user="userStore.viewedUser" @close="showView=false"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import UserTable from '@/components/Users/UserTable.vue'
import UserForm from '@/components/Users/UserForm.vue'
import UserViewModal from '@/components/Users/UserViewModal.vue'

const userStore = useUserStore()

const showForm = ref(false)
const showView = ref(false)
const isEditing = ref(false)
const form = ref({ username:'', email:'', phone:'', RoleId:'' })

onMounted(() => {
  userStore.fetchUsers()
  userStore.fetchRoles()
})

function openAdd() {
  showForm.value = true
  isEditing.value = false
  form.value = { username:'', email:'', phone:'', RoleId:'' }
}

function viewUser(user) {
  userStore.viewUser(user.id)
  showView.value = true
}

function editUser(user) {
  isEditing.value = true
  showForm.value = true
  form.value = { ...user }
}

async function submitUser(data) {
  if (isEditing.value) {
    await userStore.updateUser(data.id, data)
  } else {
    await userStore.createUser(data)
  }
  showForm.value = false
}

async function deleteUser(id) {
  await userStore.deleteUser(id)
}
</script>

