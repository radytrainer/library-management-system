<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit User' : 'Add User' }}</h3>

      <form @submit.prevent="onSubmit" class="space-y-3">
        <input v-model="form.username" type="text" placeholder="Username" class="w-full p-2 border rounded" required />
        <input v-model="form.email" type="email" placeholder="Email" class="w-full p-2 border rounded" required />
        <input v-model="form.password" type="password" placeholder="Password" class="w-full p-2 border rounded" :required="!isEditing" />
        <input v-model="form.phone" type="text" placeholder="Phone" class="w-full p-2 border rounded" />

        <select v-model="form.RoleId" class="w-full p-2 border rounded" required>
          <option disabled value="">Select role</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>

        <input v-model="form.date_of_birth" type="date" class="w-full p-2 border rounded" />

        <input type="file" accept="image/*" @change="handleAvatar" class="w-full p-2 border rounded" />
        <div v-if="form.profile_image" class="mt-2 flex justify-center">
          <img :src="previewImage" class="w-24 h-24 rounded-full object-cover border" />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {{ isEditing ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  isEditing: Boolean,
  roles: Array,
  form: Object
})

const emit = defineEmits(['submit', 'close'])

const onSubmit = () => emit('submit')

const handleAvatar = (e) => {
  const file = e.target.files[0]
  if (file) props.form.profile_image = file
}

const previewImage = computed(() => 
  typeof props.form.profile_image === 'string'
    ? props.form.profile_image
    : URL.createObjectURL(props.form.profile_image)
)
</script>
