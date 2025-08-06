<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useUserStore } from '@/stores/userStore';
import UserTable from '@/components/Users/UserTable.vue';
import UserForm from '@/components/Users/UserForm.vue';
import UserViewModal from '@/components/Users/UserViewModal.vue';
import UserCard from '@/components/Users/UserCard.vue';

const userStore = useUserStore();

const showFormModal = ref(false);
const showViewModal = ref(false);
const isEditing = ref(false);
const selectedUser = ref(null);
const formUserData = ref({});
const selectedUserId = ref(null);
const selectedUserForPrint = ref(null);
const printCardRef = ref(null);

onMounted(() => {
  userStore.fetchUsers();
  userStore.fetchRoles();
});

function openAddUser() {
  isEditing.value = false;
  formUserData.value = {};
  selectedUserId.value = null;
  showFormModal.value = true;
}

async function openEditUser(user) {
  isEditing.value = true;
  formUserData.value = { ...user, password: '' };
  selectedUserId.value = user.id;
  showFormModal.value = true;
}

function openViewUser(user) {
  selectedUser.value = user;
  showViewModal.value = true;
}

function handleFormSubmitSuccess() {
  showFormModal.value = false;
  userStore.fetchUsers();
}

async function confirmDeleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  const res = await userStore.deleteUser(id);
  if (res.success) {
    console.log('User deleted!');
  } else {
    console.error('Error:', res.error);
  }
}

const handlePrintUser = async (userId) => {
  console.log('Print user:', userId);
  const user = userStore.users.find(u => u.id === userId);
  if (user) {
    selectedUserForPrint.value = user;
    await nextTick();
    if (printCardRef.value) {
      console.log('Generating card for PDF');
      printCardRef.value.generateCard();
      // Trigger PDF generation after card is ready
      setTimeout(() => {
        if (printCardRef.value && printCardRef.value.generatePDF) {
          console.log('Attempting to generate PDF');
          printCardRef.value.generatePDF();
          // Hide the card after PDF is generated
          setTimeout(() => {
            selectedUserForPrint.value = null;
          }, 500);
        } else {
          console.error('printCardRef not ready for PDF');
        }
      }, 2000); // Increased delay to 2 seconds for image loading
    } else {
      console.error('printCardRef is not initialized');
    }
  }
};
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">User Management</h2>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ userStore.users.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ userStore.activeUsersCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">New This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ userStore.newUsersCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mb-4">
      <button @click="openAddUser" class="px-4 py-2 bg-blue-600 text-white rounded-lg">+ Add User</button>
    </div>
    <UserTable
      :users="userStore.users"
      :roles="userStore.roles"
      @edit-user="openEditUser"
      @view-user="openViewUser"
      @delete-user="confirmDeleteUser"
      @print-user="handlePrintUser"
    />
    <UserForm
      :show="showFormModal"
      :isEditing="isEditing"
      :formData="formUserData"
      :userId="selectedUserId"
      @close="showFormModal = false"
      @submit-success="handleFormSubmitSuccess"
    />
    <UserViewModal
      :show="showViewModal"
      :user="selectedUser"
      @close="showViewModal = false"
    />
    <UserCard
      v-if="selectedUserForPrint"
      ref="printCardRef"
      :user="selectedUserForPrint"
      systemName="Library Digital"
      logoUrl="/path/to/your/logo.png"
    />
  </div>
</template>