
<template>
  <div class="space-y-6 p-10">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800">📚 Category Management</h2>
    </div>

    <!-- Controls: Search, Per Page & Add Button -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <!-- Search Input -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search categories..."
        class="border border-gray-300 rounded-md px-5 py-2.5 w-full sm:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <!-- Right Side Controls -->
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <!-- Per Page Dropdown -->
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <label class="text-gray-700 text-sm font-medium whitespace-nowrap">Show:</label>
          <select
            v-model="perPage"
            class="border border-gray-300 rounded-md px-5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
          </select>
        </div>

        <!-- Add Category Button -->
        <button
          @click="openAddDialog"
          class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm shadow whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 font-semibold text-gray-700 text-center">#</th>
            <th class="px-4 py-3 font-semibold text-gray-700 text-center">Name</th>
            <th class="px-4 py-3 font-semibold text-gray-700 text-center">Description</th>
            <th class="px-4 py-3 font-semibold text-gray-700 text-center">QTY</th>
            <th class="px-4 py-3 font-semibold text-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="category in paginatedCategories" :key="category.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-center">{{ category.id }}</td>
            <td class="px-4 py-3 font-medium text-gray-900 text-center">{{ category.name }}</td>
            <td class="px-4 py-3 text-gray-700 text-center">{{ category.description || '-' }}</td>
            <td class="px-4 py-3 text-center">{{ category.qty }}</td>
            <td class="px-4 py-3 text-center relative">
              <button
                @click.stop="toggleActionMenu(category.id)"
                class="focus:outline-none"
                aria-label="Actions menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                </svg>
              </button>

              <div
                v-if="activeActionMenu === category.id"
                ref="actionMenu"
                class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow z-20 border border-gray-100 py-1"
              >
                <button @click="openEditDialog(category)" class="block w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100">Edit</button>
                <button @click="deleteCategory(category.id)" class="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">Delete</button>
                <button @click="viewCategory(category)" class="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100">View</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h3 class="text-lg font-semibold">{{ isEditing ? '✏️ Edit Category' : '➕ Add New Category' }}</h3>
        <form @submit.prevent="isEditing ? updateCategory() : submitNewCategory()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="form.name" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full border rounded px-3 py-2"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">QTY</label>
            <input v-model.number="form.qty" type="number" min="0" class="w-full border rounded px-3 py-2" required />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{{ isEditing ? 'Update' : 'Add' }}</button>
          </div>
        </form>
      </div>
    </div>

   <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-3 text-sm">
        <h3 class="text-lg font-semibold text-gray-800">📘 Category Details</h3>
        <div><strong>Name:</strong> {{ viewedCategory.name }}</div>
        <div><strong>Description:</strong> {{ viewedCategory.description || '-' }}</div>
        <div><strong>QTY:</strong> {{ viewedCategory.qty }}</div>
        <div class="text-right">
          <button @click="closeViewModal" class="mt-3 px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">Close</button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="paginatedCategories.length === 0" class="text-center py-12 text-gray-400 italic">
      ⚠️ No categories found.
    </div>
  </div>
  
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'

const categories = ref([])
const searchQuery = ref('')
const perPage = ref(10)
const showModal = ref(false)
const showViewModal = ref(false)
const isEditing = ref(false)
const activeActionMenu = ref(null)
const editId = ref(null)
const viewedCategory = ref({})
const form = ref({ name: '', description: '', qty: 0 })

// Load categories from localStorage
onMounted(() => {
  const stored = localStorage.getItem('categories')
  if (stored) categories.value = JSON.parse(stored)

  document.addEventListener('click', handleClickOutside)
})

// Cleanup listener on unmount
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event) {
  const menu = document.querySelector('.absolute.right-0.mt-2.w-40.bg-white')
  if (menu && !menu.contains(event.target)) {
    activeActionMenu.value = null
  }
}

// Save categories on change
watch(categories, (val) => {
  localStorage.setItem('categories', JSON.stringify(val))
}, { deep: true })

// Create
function submitNewCategory() {
  const newId = categories.value.length ? Math.max(...categories.value.map(c => c.id)) + 1 : 1
  categories.value.push({ ...form.value, id: newId })
  closeModal()
}

// Update
function updateCategory() {
  const index = categories.value.findIndex(c => c.id === editId.value)
  if (index !== -1) categories.value[index] = { ...form.value, id: editId.value }
  closeModal()
}

// Delete
function deleteCategory(id) {
  if (confirm('Are you sure you want to delete this category?')) {
    categories.value = categories.value.filter(c => c.id !== id)
  }
}

// Open/Close modals
function openAddDialog() {
  showModal.value = true
  isEditing.value = false
  editId.value = null
  form.value = { name: '', description: '', qty: 0 }
}

function openEditDialog(category) {
  showModal.value = true
  isEditing.value = true
  editId.value = category.id
  form.value = { ...category }
}

function closeModal() {
  showModal.value = false
  form.value = { name: '', description: '', qty: 0 }
  editId.value = null
  isEditing.value = false
}

function viewCategory(category) {
  viewedCategory.value = { ...category }
  showViewModal.value = true
}

function closeViewModal() {
  viewedCategory.value = {}
  showViewModal.value = false
}

// Toggle action menu for row
function toggleActionMenu(id) {
  activeActionMenu.value = activeActionMenu.value === id ? null : id
}

// Filtered & paginated
const filteredCategories = computed(() =>
  categories.value.filter(c =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const paginatedCategories = computed(() =>
  filteredCategories.value.slice(0, perPage.value)
)
</script>
