<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import UserTable from '@/components/Users/UserTable.vue';
import UserForm from '@/components/Users/UserForm.vue';
import UserViewModal from '@/components/Users/UserViewModal.vue';
import UserCard from '@/components/Users/UserCard.vue';
import Swal from 'sweetalert2';

const userStore = useUserStore();

const showFormModal = ref(false);
const showViewModal = ref(false);
const isEditing = ref(false);
const selectedUser = ref(null);
const selectedUserId = ref(null);
const selectedUserForPrint = ref(null);
const printCardRef = ref(null);
const formUserData = ref({}); // Added missing formUserData ref

const searchQuery = ref('');
const roleFilter = ref('all');
const activeStatusFilter = ref('all');
const startDate = ref(null);
const endDate = ref(null);

const currentPage = ref(1);
const itemsPerPage = ref(5);

// Fetch users and roles on mount
onMounted(() => {
  userStore.fetchUsers().catch(e => {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: e.message || 'Failed to load users',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  });
  userStore.fetchRoles().catch(e => {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: e.message || 'Failed to load roles',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  });
});

// Computed: Filter users based on search, role, status, and createdAt
const filteredUsers = computed(() => {
  let filtered = userStore.users;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(user =>
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.id && user.id.toString().includes(query))
    );
  }

  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role?.name.toLowerCase() === roleFilter.value);
  }

  if (activeStatusFilter.value !== 'all') {
    filtered = filtered.filter(user => user.status.toLowerCase() === activeStatusFilter.value);
  }

  if (startDate.value && endDate.value) {
    filtered = filtered.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= new Date(startDate.value) && createdAt <= new Date(endDate.value);
    });
  }

  return filtered;
});

// Computed: Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value) || 1;
});

// Computed: Paginated users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

// Computed: Dynamic page buttons (current page ± 2, up to 5 buttons)
const pageButtons = computed(() => {
  const maxButtons = 5;
  const half = Math.floor(maxButtons / 2);
  let startPage = Math.max(1, currentPage.value - half);
  let endPage = Math.min(totalPages.value, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

// Reset current page when filters change
watch([searchQuery, roleFilter, activeStatusFilter, startDate, endDate, itemsPerPage], () => {
  currentPage.value = 1;
});

function openAddUser() {
  isEditing.value = false;
  formUserData.value = {
    username: '',
    email: '',
    password: '',
    phone: '',
    RoleId: '',
    date_of_birth: '',
    profile_image: '',
    status: 'active',
  };
  selectedUserId.value = null;
  showFormModal.value = true;
}

function openEditUser(user) {
  isEditing.value = true;
  formUserData.value = {
    username: user.username || '',
    email: user.email || '',
    password: '', // Clear password for security
    date_of_birth: user.date_of_birth || '',
    phone: user.phone || '',
    RoleId: user.role?.id || '', // Map role.id to RoleId
    profile_image: user.profile_image || '',
    status: user.status || 'active',
  };
  selectedUserId.value = user.id;
  showFormModal.value = true;
}

function openViewUser(user) {
  selectedUser.value = user;
  showViewModal.value = true;
}

function handleFormSubmitSuccess() {
  showFormModal.value = false;
  userStore.fetchUsers().catch(e => {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: e.message || 'Failed to reload users',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  });
}

async function confirmDeleteUser(id) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    background: '#fff',
    willClose: () => {
      document.body.style.filter = 'none';
    },
  });

  if (!result.isConfirmed) return;

  const res = await userStore.deleteUser(id);
  if (res.success) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'User has been deleted.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  } else {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: res.error || 'Failed to delete user',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  }
}

const handlePrintUser = async (userId) => {
  const user = userStore.users.find(u => u.id === userId);
  if (user) {
    selectedUserForPrint.value = user;
    await nextTick();
    if (printCardRef.value) {
      printCardRef.value.generateCard();
      setTimeout(() => {
        if (printCardRef.value && printCardRef.value.generatePDF) {
          printCardRef.value.generatePDF();
          setTimeout(() => {
            selectedUserForPrint.value = null;
          }, 500);
        }
      }, 2000);
    }
  }
};

async function submitForm() {
  let res;
  if (isEditing.value) {
    const formData = new FormData();
    formData.append('username', formUserData.value.username);
    formData.append('email', formUserData.value.email);
    if (formUserData.value.password) {
      formData.append('password', formUserData.value.password);
    }
    if (formUserData.value.phone) {
      formData.append('phone', formUserData.value.phone);
    }
    if (formUserData.value.RoleId) {
      formData.append('RoleId', formUserData.value.RoleId);
    }
    if (formUserData.value.date_of_birth) {
      formData.append('date_of_birth', formUserData.value.date_of_birth);
    }
    if (formUserData.value.profile_image_file) {
      formData.append('profile_image', formUserData.value.profile_image_file);
    }
    formData.append('status', formUserData.value.status);

    res = await userStore.updateUser(selectedUserId.value, formData);
  } else {
    const formData = new FormData();
    formData.append('username', formUserData.value.username);
    formData.append('email', formUserData.value.email);
    formData.append('password', formUserData.value.password);
    if (formUserData.value.phone) {
      formData.append('phone', formUserData.value.phone);
    }
    if (formUserData.value.RoleId) {
      formData.append('RoleId', formUserData.value.RoleId);
    }
    if (formUserData.value.date_of_birth) {
      formData.append('date_of_birth', formUserData.value.date_of_birth);
    }
    if (formUserData.value.profile_image_file) {
      formData.append('profile_image', formUserData.value.profile_image_file);
    }
    formData.append('status', formUserData.value.status);

    res = await userStore.createUser(formData);
  }

  if (res.success) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: isEditing.value ? 'User updated successfully.' : 'User created successfully.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
    handleFormSubmitSuccess();
  } else {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: res.error || 'Something went wrong',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  }
}
</script>

<template>
    <div class="rounded-md p-4">
      <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900">Manage Users</h2>
          <p class="text-gray-600 mt-1 max-w-md leading-relaxed">
            Overview of all users including total count, active users, and new users added this month.
          </p>
        </div>
        <div class="flex items-center space-x-4 flex-wrap gap-4">
          <!-- Search Input -->
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search Name, Email, or ID"
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-sm"
              aria-label="Search"
            />
            <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
          </div>
          <!-- Role Filter -->
          <select
            v-model="roleFilter"
            class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-sm"
            aria-label="Filter by role"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
            <option value="user">User</option>
          </select>
          <!-- Status Filter -->
          <select
            v-model="activeStatusFilter"
            class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-sm"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <!-- Add User Button -->
          <button
            @click="openAddUser"
            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow-sm"
          >
            + Add User
          </button>
        </div>
      </div>
  
      <div class="max-w-7xl mx-auto py-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-blue-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-6 border border-blue-100 cursor-pointer"
          >
            <div class="flex items-center space-x-5">
              <div
                class="p-4 bg-blue-200 rounded-full text-blue-700 flex items-center justify-center"
                style="width: 56px; height: 56px;"
              >
                <span class="material-icons text-3xl">group</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Users</p>
                <p class="mt-1 text-3xl font-bold text-gray-900">{{ userStore.users.length }}</p>
              </div>
            </div>
          </div>
          <div
            class="bg-green-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-6 border border-green-100 cursor-pointer"
          >
            <div class="flex items-center space-x-5">
              <div
                class="p-4 bg-green-200 rounded-full text-green-700 flex items-center justify-center"
                style="width: 56px; height: 56px;"
              >
                <span class="material-icons text-3xl">verified_user</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-green-700 uppercase tracking-wide">Active Users</p>
                <p class="mt-1 text-3xl font-bold text-gray-900">{{ userStore.activeUsersCount }}</p>
              </div>
            </div>
          </div>
          <div
            class="bg-purple-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-6 border border-purple-100 cursor-pointer"
          >
            <div class="flex items-center space-x-5">
              <div
                class="p-4 bg-purple-200 rounded-full text-purple-700 flex items-center justify-center"
                style="width: 56px; height: 56px;"
              >
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
  
      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="text-center py-4 text-gray-600">
        No matching users found.
      </div>
  
      <UserTable
        :users="paginatedUsers"
        :roles="userStore.roles"
        @edit-user="openEditUser"
        @view-user="openViewUser"
        @delete-user="confirmDeleteUser"
        @print-user="handlePrintUser"
      />
  
      <!-- Pagination Controls -->
      <div class="flex items-center justify-between mt-4">
        <select
          v-model="itemsPerPage"
          class="px-3 py-1 border rounded"
          aria-label="Select number of users per page"
        >
          <option value="5">5</option>
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <nav class="flex space-x-1">
          <button
            @click="currentPage = Math.max(currentPage - 1, 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded border disabled:opacity-50"
          >
            Previous
          </button>
          <button
            v-for="page in pageButtons"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1 rounded border',
              currentPage === page ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="currentPage = Math.min(currentPage + 1, totalPages)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
  
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

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>