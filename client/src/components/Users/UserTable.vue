<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  users: Array,
  roles: Array,
});

const emits = defineEmits(['edit-user', 'delete-user', 'view-user', 'print-user']);

const openMenuId = ref(null);

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const menus = document.querySelectorAll('.user-action-menu');
  const buttons = document.querySelectorAll('.user-action-button');

  let clickedInside = false;
  menus.forEach((menu) => {
    if (menu.contains(event.target)) clickedInside = true;
  });
  buttons.forEach((btn) => {
    if (btn.contains(event.target)) clickedInside = true;
  });

  if (!clickedInside) {
    openMenuId.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg">
    <table class="min-w-full divide-y divide-gray-200 text-sm">
      <thead class="bg-gray-50 text-left">
        <tr>
          <th class="px-4 py-3 font-medium text-gray-600">ID</th>
          <th class="px-4 py-3 font-medium text-gray-600">Profile</th>
          <th class="px-4 py-3 font-medium text-gray-600">Email</th>
          <th class="px-4 py-3 font-medium text-gray-600">Phone</th>
          <th class="px-4 py-3 font-medium text-gray-600">Role</th>
          <th class="px-4 py-3 font-medium text-gray-600">Birthday</th>
          <th class="px-4 py-3 font-medium text-gray-600">Barcode</th>
          <th class="px-4 py-3 font-medium text-gray-600">Barcode Image</th>
          <th class="px-4 py-3 font-medium text-gray-600">QR Code Image</th> <!-- New column -->
          <th class="px-4 py-3 font-medium text-gray-600">Status</th>
          <th class="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
          <td class="px-4 py-3">{{ user.id }}</td>
          <td class="px-4 py-3 flex items-center space-x-3">
            <img v-if="user.profile_image" :src="user.profile_image" @click="$emit('view-user', user)"
              class="w-9 h-9 rounded-full border object-cover" />
            <div v-else class="w-9 h-9 rounded-full bg-gray-200"></div>
            <span>{{ user.username }}</span>
          </td>
          <td class="px-4 py-3">{{ user.email }}</td>
          <td class="px-4 py-3">{{ user.phone || '-' }}</td>
          <td class="px-4 py-3">
            <span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {{ user.role?.name || 'User' }}
            </span>
          </td>
          <td class="px-4 py-3">{{ user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : '-' }}</td>
          <td class="px-4 py-3">{{ user.barcode || '-' }}</td>
          <td class="px-4 py-3">
            <img v-if="user.barcode_image" :src="user.barcode_image" class="h-12 w-auto" />
            <span v-else>-</span>
          </td>
          <td class="px-4 py-3">
            <img v-if="user.qr_code_image" :src="user.qr_code_image" class="h-12 w-auto" />
            <span v-else>-</span>
          </td>
          <td class="px-4 py-3">
            <span :class="{
              'px-2 py-1 rounded-full text-xs': true,
              'bg-green-100 text-green-800': user.status === 'active',
              'bg-red-100 text-red-800': user.status === 'inactive',
            }">
              {{ user.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="px-4 py-3 text-right relative">
            <button @click="toggleMenu(user.id)" class="user-action-button p-2 hover:bg-gray-100 rounded">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
            <div v-if="openMenuId === user.id"
              class="user-action-menu absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
              <button @click="$emit('view-user', user); openMenuId = null"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-500">View</button>
              <button @click="$emit('edit-user', user); openMenuId = null"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-green-500">Edit</button>
              <button @click="$emit('delete-user', user.id); openMenuId = null"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Delete</button>
              <button @click="$emit('print-user', user.id); openMenuId = null"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">Print</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>