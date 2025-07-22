<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">Author Management</h2>
      <button
        @click="openAddDialog"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Author
      </button>
    </div>

    <!-- Author Table -->
    <div class="bg-white border border-gray-200 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-600">ID</th>
            <th class="px-4 py-3 font-medium text-gray-600">Profile</th>
            <th class="px-4 py-3 font-medium text-gray-600">Email</th>
            <th class="px-4 py-3 font-medium text-gray-600">Description</th>
            <th class="px-4 py-3 font-medium text-gray-600">Birthday</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="author in authors" :key="author.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-600">{{ author.id }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center space-x-3">
                <img
                  :src="author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`"
                  class="w-9 h-9 rounded-full border object-cover"
                  alt="Avatar"
                />
                <span class="font-medium text-gray-900">{{ author.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-700">{{ author.email }}</td>
            <td class="px-4 py-3 text-gray-600">{{ author.description || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">{{ author.birthday || '-' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="relative inline-block text-left">
                <button @click="toggleActionMenu(author.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </svg>
                </button>
                <div
                  v-if="activeActionMenu === author.id"
                  class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 py-1"
                >
                  <button @click="openEditDialog(author)" class="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-gray-100">Edit</button>
                  <button @click="deleteAuthor(author.id)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
                  <button @click="viewAuthor(author)" class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100">View</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-xl shadow-lg w-full max-w-sm space-y-4">
        <h3 class="text-base font-semibold text-gray-800">{{ isEditing ? 'Edit Author' : 'Add New Author' }}</h3>
        <form @submit.prevent="isEditing ? updateAuthor() : submitNewAuthor()" class="space-y-3 text-sm">
          <div>
            <label class="block font-medium text-gray-700 mb-1">Name</label>
            <input v-model="form.name" type="text" class="w-full p-2 border rounded focus:ring focus:outline-none" required />
          </div>
          <div>
            <label class="block font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full p-2 border rounded focus:ring focus:outline-none" required />
          </div>
          <div>
            <label class="block font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" rows="2" class="w-full p-2 border rounded"></textarea>
          </div>
          <div>
            <label class="block font-medium text-gray-700 mb-1">Birthday</label>
            <input v-model="form.birthday" type="date" class="w-full p-2 border rounded" />
          </div>
          <div>
            <label class="block font-medium text-gray-700 mb-1">Upload Avatar</label>
            <input type="file" accept="image/*" @change="handleAvatarUpload" class="w-full p-2 border rounded" />
          </div>
          <div v-if="form.avatar" class="text-center">
            <img :src="form.avatar" alt="Avatar Preview" class="w-20 h-20 mx-auto mt-2 rounded-full object-cover border" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeModal" class="px-3 py-1.5 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">{{ isEditing ? 'Update' : 'Add' }}</button>
          </div>
        </form>
      </div>
    </div>
     <!-- View Author Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4 text-sm">
        <h3 class="text-lg font-semibold text-gray-800">Author Information</h3>
        <div class="text-center">
          <img
            :src="viewedAuthor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewedAuthor.name)}&background=random`"
            class="w-24 h-24 rounded-full mx-auto object-cover border"
            alt="Avatar"
          />
        </div>
        <div><strong>Name:</strong> {{ viewedAuthor.name }}</div>
        <div><strong>Email:</strong> {{ viewedAuthor.email }}</div>
        <div><strong>Description:</strong> {{ viewedAuthor.description || '-' }}</div>
        <div><strong>Birthday:</strong> {{ viewedAuthor.birthday || '-' }}</div>
        <div class="text-right">
          <button @click="closeViewModal" class="px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">Close</button>
        </div>
      </div>
    </div>
    <!-- Empty State -->
    <div v-if="authors.length === 0" class="text-center py-12 text-gray-500">
      No authors found.
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const authors = ref([])
const showModal = ref(false)
const showViewModal = ref(false)
const isEditing = ref(false)
const activeActionMenu = ref(null)
const editId = ref(null)
const viewedAuthor = ref({})

const form = ref({
  name: '', email: '', role: '', description: '', birthday: '', avatar: ''
})

onMounted(() => {
  const stored = localStorage.getItem('authors')
  if (stored) authors.value = JSON.parse(stored)
})

watch(authors, (newVal) => {
  localStorage.setItem('authors', JSON.stringify(newVal))
}, { deep: true })

function openAddDialog() {
  showModal.value = true
  isEditing.value = false
  editId.value = null
  form.value = { name: '', email: '', role: '', description: '', birthday: '', avatar: '' }
}

function openEditDialog(author) {
  showModal.value = true
  isEditing.value = true
  editId.value = author.id
  form.value = { ...author }
}

function closeModal() {
  showModal.value = false
  form.value = { name: '', email: '', role: '', description: '', birthday: '', avatar: '' }
  editId.value = null
  isEditing.value = false
}

function viewAuthor(author) {
  viewedAuthor.value = { ...author }
  showViewModal.value = true
}

function closeViewModal() {
  viewedAuthor.value = {}
  showViewModal.value = false
}

function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => form.value.avatar = reader.result
  reader.readAsDataURL(file)
}

function submitNewAuthor() {
  const newId = authors.value.length ? Math.max(...authors.value.map(a => a.id)) + 1 : 1
  authors.value.push({ ...form.value, id: newId })
  closeModal()
}

function updateAuthor() {
  const index = authors.value.findIndex(a => a.id === editId.value)
  if (index !== -1) authors.value[index] = { ...form.value, id: editId.value }
  closeModal()
}

function deleteAuthor(id) {
  if (confirm('Are you sure you want to delete this author?')) {
    authors.value = authors.value.filter(author => author.id !== id)
  }
}

function toggleActionMenu(id) {
  if (activeActionMenu.value === id) {
    activeActionMenu.value = null
  } else {
    activeActionMenu.value = id
    setTimeout(() => {
      if (activeActionMenu.value === id) {
        activeActionMenu.value = null
      }
    }, 3000) // 3 seconds
  }
}


</script>
