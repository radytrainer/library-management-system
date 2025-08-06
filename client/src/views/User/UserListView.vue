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
  <div class=" p-8">
    <div class="flex justify-between items-center mb-2">
  <div>
    <h2 class="text-2xl font-extrabold text-gray-900">Manage Users</h2>
    <p class="text-gray-600 mt-1 max-w-md leading-relaxed">
      Overview of all users including total count, active users, and new users added this month.
    </p>
  </div>
  <div>
    <button @click="openAddUser" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow-sm">
      + Add User
    </button>
  </div>
</div>

    <div class="max-w-7xl mx-auto  py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- Total Users -->
        <div
          class="bg-blue-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-6 border border-blue-100 cursor-pointer">
          <div class="flex items-center space-x-5">
            <div class="p-4 bg-blue-200 rounded-full text-blue-700 flex items-center justify-center"
              style="width: 56px; height: 56px;">
              <span class="material-icons text-3xl">group</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Users</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ userStore.users.length }}</p>
            </div>
          </div>
        </div>

        <!-- Active Users -->
        <div
          class="bg-green-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-6 border border-green-100 cursor-pointer">
          <div class="flex items-center space-x-5">
            <div class="p-4 bg-green-200 rounded-full text-green-700 flex items-center justify-center"
              style="width: 56px; height: 56px;">
              <span class="material-icons text-3xl">verified_user</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-green-700 uppercase tracking-wide">Active Users</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ userStore.activeUsersCount }}</p>
            </div>
          </div>
        </div>

        <!-- New This Month -->
        <div
          class="bg-purple-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-6 border border-purple-100 cursor-pointer">
          <div class="flex items-center space-x-5">
            <div class="p-4 bg-purple-200 rounded-full text-purple-700 flex items-center justify-center"
              style="width: 56px; height: 56px;">
              <span class="material-icons text-3xl">person_add</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-purple-700 uppercase tracking-wide">New This Month</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ userStore.newUsersCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UserTable :users="userStore.users" :roles="userStore.roles" @edit-user="openEditUser" @view-user="openViewUser"
      @delete-user="confirmDeleteUser" @print-user="handlePrintUser" />
    <UserForm :show="showFormModal" :isEditing="isEditing" :formData="formUserData" :userId="selectedUserId"
      @close="showFormModal = false" @submit-success="handleFormSubmitSuccess" />
    <UserViewModal :show="showViewModal" :user="selectedUser" @close="showViewModal = false" />
    <UserCard v-if="selectedUserForPrint" ref="printCardRef" :user="selectedUserForPrint" systemName="Library Digital"
      logoUrl="/path/to/your/logo.png" />
  </div>
</template>
<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>