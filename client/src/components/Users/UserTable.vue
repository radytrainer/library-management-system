<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  users: Array,
  roles: Array,
});

const emits = defineEmits(['edit-user', 'delete-user', 'view-user', 'print-user']);

const openMenuId = ref(null);

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

// Compute the first letter of the email for each user
const getProfileInitial = (user) => {
  return user?.email?.charAt(0)?.toUpperCase() || '?';
};

// Compute whether a user has a valid profile image
const hasValidProfileImage = (user) => {
  const image = user?.profile_image || '';
  return image && (image.startsWith('http') || image.startsWith('data:image'));
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
    <!-- Table Layout for Small Screens and Above (sm: 640px+) -->
    <div class="hidden sm:block overflow-x-auto">
      <table class="rounded-lg w-full divide-y p-4 divide-gray-200 text-xs sm:text-sm">
        <thead class="bg-gray-50 text-left sticky top-0 z-10">
          <tr>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Profile</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Email</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Phone</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Role</th>
            <!-- <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Birthday</th> -->
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Barcode</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Barcode</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">QR</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 text-right whitespace-nowrap">Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-3 mt-[0.372rem]">
              <div
                class="w-7 h-7 sm:w-8 md:w-9 h-7 sm:h-8 md:h-9 rounded-full border flex items-center justify-center bg-indigo-500 text-white cursor-pointer"
                @click="$emit('view-user', user)">
                <img v-if="hasValidProfileImage(user)" :src="user.profile_image"
                  class="w-full h-full rounded-full object-cover" @error="user.profile_image = null" />
                <span v-else class="text-[10px] sm:text-xs md:text-base font-semibold">
                  {{ getProfileInitial(user) }}
                </span>
              </div>
              <span class="truncate max-w-[100px] sm:max-w-[150px]">{{ user.username }}</span>
            </td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 truncate max-w-[120px] sm:max-w-[200px]">{{ user.email }}</td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap">{{ user.phone || '-' }}</td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
              <span
                class="px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 whitespace-nowrap">
                {{ user.role?.name || 'User' }}
              </span>
            </td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap">{{ user.barcode || '-' }}</td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
              <img v-if="user.barcode_image" :src="user.barcode_image" class="h-8 sm:h-10 md:h-12 w-auto" />
              <span v-else>-</span>
            </td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
              <img v-if="user.qr_code_image" :src="user.qr_code_image" class="h-8 sm:h-10 md:h-12 w-auto" />
              <span v-else>-</span>
            </td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-right relative">
              <button @click="toggleMenu(user.id)"
                class="user-action-button p-1 sm:p-1.5 md:p-2 hover:bg-gray-100 rounded">
                <span class="material-symbols-outlined text-base sm:text-lg md:text-xl">more_vert</span>
              </button>
              <div v-if="openMenuId === user.id"
                class="user-action-menu absolute right-0 mt-1 sm:mt-2 w-24 sm:w-28 md:w-32 bg-white border rounded shadow-md z-50">
                <button @click="$emit('view-user', user); openMenuId = null"
                  class="block w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-gray-100 text-blue-500 text-[11px] sm:text-xs md:text-sm">View</button>
                <button @click="$emit('edit-user', user); openMenuId = null"
                  class="block w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-gray-100 text-green-500 text-[11px] sm:text-xs md:text-sm">Edit</button>
                <button @click="$emit('delete-user', user.id); openMenuId = null"
                  class="block w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-gray-100 text-red-500 text-[11px] sm:text-xs md:text-sm">Delete</button>
                <button @click="$emit('print-user', user.id); openMenuId = null"
                  class="block w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-gray-100 text-gray-700 text-[11px] sm:text-xs md:text-sm">Print</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card Layout for Mobile (below 640px) -->
    <div class="block sm:hidden space-y-3 p-3">
      <div v-for="user in users" :key="user.id"
        class="bg-white border border-gray-200 rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div
              class="w-9 h-9 rounded-full border flex items-center justify-center bg-indigo-500 text-white cursor-pointer"
              @click="$emit('view-user', user)">
              <img v-if="hasValidProfileImage(user)" :src="user.profile_image"
                class="w-full h-full rounded-full object-cover" @error="user.profile_image = null" />
              <span v-else class="text-xs font-semibold">
                {{ getProfileInitial(user) }}
              </span>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800 truncate max-w-[150px]">{{ user.username }}</p>
              <p class="text-xs text-gray-500 truncate max-w-[150px]">{{ user.email }}</p>
            </div>
          </div>
          <div class="relative">
            <button @click="toggleMenu(user.id)" class="user-action-button p-1.5 hover:bg-gray-100 rounded">
              <span class="material-symbols-outlined text-lg">more_vert</span>
            </button>
            <div v-if="openMenuId === user.id"
              class="user-action-menu absolute right-0 mt-1 w-24 bg-white border rounded shadow-md z-50">
              <button @click="$emit('view-user', user); openMenuId = null"
                class="block w-full text-left px-2 py-1 hover:bg-gray-100 text-blue-500 text-[11px]">View</button>
              <button @click="$emit('edit-user', user); openMenuId = null"
                class="block w-full text-left px-2 py-1 hover:bg-gray-100 text-green-500 text-[11px]">Edit</button>
              <button @click="$emit('delete-user', user.id); openMenuId = null"
                class="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500 text-[11px]">Delete</button>
              <button @click="$emit('print-user', user.id); openMenuId = null"
                class="block w-full text-left px-2 py-1 hover:bg-gray-100 text-gray-700 text-[11px]">Print</button>
            </div>
          </div>
        </div>
        <div class="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p class="font-medium text-gray-600">ID</p>
            <p>{{ user.id }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Phone</p>
            <p>{{ user.phone || '-' }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Role</p>
            <span class="px-1 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
              {{ user.role?.name || 'User' }}
            </span>
          </div>
          <div>
            <p class="font-medium text-gray-600">Status</p>
            <span :class="{
              'px-1 py-0.5 rounded-full text-xs': true,
              'bg-green-100 text-green-800': user.status === 'active',
              'bg-red-100 text-red-800': user.status === 'inactive',
            }">
              {{ user.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div>
            <p class="font-medium text-gray-600">Birthday</p>
            <p>{{ user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : '-' }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Barcode</p>
            <p>{{ user.barcode || '-' }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Barcode Image</p>
            <img v-if="user.barcode_image" :src="user.barcode_image" class="h-8 w-auto" />
            <span v-else>-</span>
          </div>
          <div>
            <p class="font-medium text-gray-600">QR Code</p>
            <img v-if="user.qr_code_image" :src="user.qr_code_image" class="h-8 w-auto" />
            <span v-else>-</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>