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
          <th class="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
          <td class="px-4 py-3 text-gray-600">{{ user.id }}</td>
          <td class="px-4 py-3">
            <div class="flex items-center space-x-3">
              <img
                :src="user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`"
                class="w-9 h-9 rounded-full border object-cover"
              />
              <span class="font-medium text-gray-900">{{ user.name }}</span>
            </div>
          </td>
          <td class="px-4 py-3 text-gray-700">{{ user.email }}</td>
          <td class="px-4 py-3 text-gray-700">{{ user.phone || '-' }}</td>
          <td class="px-4 py-3">
            <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ user.role }}
            </span>
          </td>
          <td class="px-4 py-3 text-gray-600">{{ user.birthday || '-' }}</td>
          <td class="px-4 py-3 text-gray-600">{{ user.barcode || '-' }}</td>
          <td class="px-4 py-3 text-right">
            <slot name="actions" :user="user"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.min-w-full th,
.min-w-full td {
  min-width: 120px; /* Adjust as needed */
}
</style>

<script setup>
defineProps({
  users: {
    type: Array,
    default: () => []
  }
})
</script>
