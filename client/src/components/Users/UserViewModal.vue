<script setup>
const props = defineProps({
  show: Boolean,
  user: Object
})

const emits = defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded w-96 max-h-[90vh] overflow-auto">
      <h2 class="text-lg font-bold mb-2">User Details</h2>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone || '-' }}</p>
      <p><strong>Role:</strong> {{ user.role || '-' }}</p>
      <p><strong>Birthday:</strong> {{ user.date_of_birth || '-' }}</p>
      <p><strong>Barcode:</strong> {{ user.barcode || '-' }}</p>
      <div class="mt-2">
        <strong>Profile Image:</strong><br />
        <img v-if="user.profile_image" :src="user.profile_image" alt="Profile" class="w-24 h-24 rounded object-cover" />
        <span v-else>-</span>
      </div>
      <div class="mt-2">
        <strong>Barcode Image:</strong><br />
        <img v-if="user.barcode_image" :src="user.barcode_image" alt="Barcode" class="h-20 w-auto" />
        <span v-else>-</span>
      </div>

      <button @click="$emit('close')" class="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
    </div>
  </div>
</template>
