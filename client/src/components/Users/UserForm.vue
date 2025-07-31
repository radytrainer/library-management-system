<template>
  <div v-if="show" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <h3 class="text-lg font-bold mb-4">{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
      <form @submit.prevent="$emit('submit', form)">
        <input v-model="form.username" placeholder="Username" class="w-full p-2 border rounded mb-2"/>
        <input v-model="form.email" placeholder="Email" class="w-full p-2 border rounded mb-2"/>
        <input v-if="!isEditing" v-model="form.password" type="password" placeholder="Password" class="w-full p-2 border rounded mb-2"/>
        <input v-model="form.phone" placeholder="Phone" class="w-full p-2 border rounded mb-2"/>
        <select v-model="form.RoleId" class="w-full p-2 border rounded mb-2">
          <option disabled value="">Select role</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">{{ isEditing ? 'Update' : 'Add' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean, isEditing: Boolean, form: Object, roles: Array })
defineEmits(['close', 'submit'])
</script>
