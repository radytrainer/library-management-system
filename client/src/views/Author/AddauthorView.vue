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

    <!-- Authors Table -->
    <div class=" bg-white border border-gray-200 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-600">ID</th>
            <th class="px-4 py-3 font-medium text-gray-600">Profile</th>
            <th class="px-4 py-3 font-medium text-gray-600">Email</th>
            <th class="px-4 py-3 font-medium text-gray-600">Role</th>
            <th class="px-4 py-3 font-medium text-gray-600">Bio</th>
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
            <td class="px-4 py-3">
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ author.role }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ author.bio || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">{{ author.birthday || '-' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="relative inline-block text-left">
                <button @click="toggleActionMenu(author.id)" aria-label="Actions menu">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </svg>
                </button>

                <!-- Pop-up Action Menu -->
                <div
                  v-if="activeActionMenu === author.id"
                  class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 py-1"
                >
                  <button
                    @click="editAuthor(author)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteAuthor(author.id)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Author Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Add Author</h3>
        <form @submit.prevent="submitNewAuthor" class="space-y-3">
          <input v-model="newAuthor.name" type="text" placeholder="Name" class="w-full p-2 border rounded" required />
          <input v-model="newAuthor.email" type="email" placeholder="Email" class="w-full p-2 border rounded" required />
          <input v-model="newAuthor.role" type="text" placeholder="Role" class="w-full p-2 border rounded" />
          <textarea v-model="newAuthor.bio" placeholder="Bio" class="w-full p-2 border rounded"></textarea>
          <input v-model="newAuthor.birthday" type="date" class="w-full p-2 border rounded" />
          <div class="flex justify-end gap-2 mt-4">
            <button @click="showAddModal = false" type="button" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="authors.length === 0" class="text-center py-12 text-gray-500">
      No authors found.
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const authors = ref([])

const showAddModal = ref(false)
const activeActionMenu = ref(null)

const newAuthor = ref({
  name: '',
  email: '',
  role: '',
  status: 'active',
  bio: '',
  birthday: ''
})

// Load authors from localStorage on mount
onMounted(() => {
  const stored = localStorage.getItem('authors')
  if (stored) {
    authors.value = JSON.parse(stored)
  }
})

// Watch authors and store in localStorage on change
watch(authors, (newVal) => {
  localStorage.setItem('authors', JSON.stringify(newVal))
}, { deep: true })

function openAddDialog() {
  showAddModal.value = true
  newAuthor.value = {
    name: '',
    email: '',
    role: '',
    status: 'active',
    bio: '',
    birthday: ''
  }
}

function submitNewAuthor() {
  const newId = authors.value.length ? Math.max(...authors.value.map(a => a.id)) + 1 : 1
  const joined = new Date().toISOString().split('T')[0]

  authors.value.push({
    id: newId,
    name: newAuthor.value.name,
    email: newAuthor.value.email,
    role: newAuthor.value.role || 'Author',
    status: newAuthor.value.status,
    joinDate: joined,
    avatar: '',
    bio: newAuthor.value.bio,
    birthday: newAuthor.value.birthday
  })

  showAddModal.value = false
}

function toggleActionMenu(id) {
  activeActionMenu.value = activeActionMenu.value === id ? null : id
}

function editAuthor(author) {
  alert('Edit clicked for: ' + author.name)
}

function deleteAuthor(id) {
  if (confirm('Are you sure you want to delete this author?')) {
    authors.value = authors.value.filter(author => author.id !== id)
  }
}
</script>
