<template>
  <div class="space-y-6 p-8 bg-[#F8F8F8]">
    <!-- Notification Area -->
    <transition enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2">
      <div v-if="notification.visible" :class="[
        'fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-xl shadow-2xl border-l-4 p-6',
        notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800',
      ]">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold">{{ notification.type === "success" ? "Success" : "Error" }}</p>
            <p class="text-sm mt-1">{{ notification.message }}</p>
          </div>
          <button @click="notification.visible = false"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this author?</p>
        <div class="flex justify-center gap-4">
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Yes, Delete
          </button>
          <button @click="cancelDelete"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div class="bg-sky-600 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Left -->
        <div>
          <h2 class="text-3xl font-bold text-white">Directory Author </h2>
          <p class="text-white/90 mt-1 max-w-2xl leading-relaxed">
            View and manage all authors associated with your library in one simple, streamlined interface.
          </p>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3">
          <select v-model="selectedNationality"
            class="border border-white/40 bg-white/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/50 transition-colors">
            <option value="" class="bg-black text-white">All Nationalities</option>
            <option v-for="nation in nationalities" :key="nation" :value="nation" class="bg-black text-white">
              {{ nation }}
            </option>
          </select>

          <select v-model="limit"
            class="border border-white/40 bg-white/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/50 transition-colors">
            <option value="" class="bg-black text-white">All Authors</option>
            <option v-for="n in [10, 20, 50]" :key="n" :value="n" class="bg-black text-white">
              Show {{ n }}
            </option>
          </select>
        </div>
      </div>

      <!-- Search and Add -->
      <div class="mt-6 flex flex-col md:flex-row justify-between gap-4">
        <input v-model="search" type="text" placeholder="Search Author Name..."
          class="border border-white/40 bg-white/30 text-white placeholder-white/70 rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-white/50 transition-colors">
        <button @click="openAddDialog"
          class="bg-white text-sky-700 px-4 py-2 rounded-lg hover:bg-sky-100 transition flex items-center gap-2"
          :disabled="isLoading">
          <span class="material-icons">add</span> Add Author
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-2xl">
      <table class="min-w-full text-sm">
        <thead class="bg-sky-50 text-sky-700">
          <tr>
            <th class="px-4 py-3 text-left font-semibold">ID</th>
            <th class="px-4 py-3 text-left font-semibold">name</th>
            <th class="px-4 py-3 text-left font-semibold">Nationality</th>
            <th class="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(author, index) in filteredAuthors" :key="author.id"
            class="hover:bg-sky-50 transition-shadow hover:shadow-sm">
            <td class="px-4 py-3 text-gray-700 font-medium">{{ index + 1 }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <span class="font-semibold text-gray-900">{{ author.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-700">{{ author.nationality }}</td>
            <td class="px-4 py-3 text-right">
              <div class="relative">
                <button @click="toggleActionMenu(author.id)" class="text-2xl hover:text-sky-600 transition p-2"
                  :disabled="isLoading">
                  ⋮
                </button>

                <div v-if="activeActionMenu === author.id"
                  class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black/10 z-10 py-1">
                  <button @click="editAuthor(author)"
                    class="block w-full text-left px-4 py-2 hover:bg-sky-50">Edit</button>
                  <button @click="openDeleteConfirm(author.id)"
                    class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Author Modal -->
    <div v-if="showAddEditModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold">{{ isEditing ? 'Edit Author' : 'Add Author' }}</h3>
        <form @submit.prevent="submitAuthor" class="space-y-3">
          <input v-model="currentAuthor.name" type="text" placeholder="Name"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 transition" required
            :disabled="isLoading" />
          <input v-model="currentAuthor.nationality" type="text" placeholder="Nationality"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 transition" :disabled="isLoading" />

          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="closeAddEditDialog"
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition" :disabled="isLoading">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
              :disabled="isLoading">
              <span v-if="isLoading" class="animate-spin">⟳</span>
              {{ isEditing ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Author Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div class="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-5 border-b border-gray-100">
          <h3 class="text-2xl font-semibold text-gray-800">Author Profile</h3>
        </div>
        <div class="p-6 max-h-[calc(90vh-140px)]">
          <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8 mb-8">
            <div class="flex-1 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                  <p class="text-lg font-semibold text-gray-900">{{ selectedAuthorDetails.name }}</p>
                </div>
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-500 uppercase tracking-wide">Nationality</label>
                  <p class="text-gray-800">{{ selectedAuthorDetails.nationality }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
          <button @click="closeViewDialog"
            class="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="mt-6 flex justify-between items-center">
      <div>Page {{ currentPage }} of {{ totalPages }}</div>

      <div class="flex items-center gap-4">
        <button :disabled="currentPage === 1 || isLoading" @click="prevPage"
          class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-sky-50 transition">
          ‹
        </button>

        <div class="px-4 py-1 font-medium">
          {{ currentPage }}
        </div>

        <button :disabled="currentPage === totalPages || isLoading" @click="nextPage"
          class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-sky-50 transition">
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '@/services/Api/author'

const authors = ref([])
const activeActionMenu = ref(null)
const closeMenuTimeout = ref(null)
const isLoading = ref(false)
const notification = ref({
  visible: false,
  message: '',
  type: ''
})
const showDeleteConfirm = ref(false)
const authorToDelete = ref(null)

const selectedNationality = ref('')
const limit = ref('')
const search = ref('')

const showAddEditModal = ref(false)
const isEditing = ref(false)
const currentAuthor = ref({
  id: null,
  name: '',
  nationality: '',
})

const showViewModal = ref(false)
const selectedAuthorDetails = ref({})
const currentPage = ref(1)
const rowsPerPage = 10

const nationalities = computed(() => {
  const set = new Set()
  authors.value.forEach(author => {
    if (author.nationality) set.add(author.nationality)
  })
  return [...set]
})

const filteredAuthors = computed(() => {
  let result = authors.value

  if (selectedNationality.value) {
    result = result.filter(author => author.nationality === selectedNationality.value)
  }

  if (search.value.trim()) {
    const keyword = search.value.toLowerCase()
    result = result.filter(author => author.name.toLowerCase().includes(keyword))
  }

  result = result.sort((a, b) => b.id - a.id)

  const start = (currentPage.value - 1) * rowsPerPage
  const end = start + rowsPerPage

  return result.slice(start, end)
})

const totalPages = computed(() => {
  let result = authors.value

  if (selectedNationality.value) {
    result = result.filter(author => author.nationality === selectedNationality.value)
  }

  if (search.value.trim()) {
    const keyword = search.value.toLowerCase()
    result = result.filter(author => author.name.toLowerCase().includes(keyword))
  }

  return Math.ceil(result.length / rowsPerPage)
})

const showNotification = (message, type) => {
  notification.value = { visible: true, message, type }
  setTimeout(() => {
    notification.value.visible = false
  }, 3000)
}

const fetchAuthors = async () => {
  try {
    isLoading.value = true
    const res = await getAuthors()
    authors.value = res.data
  } catch (err) {
    showNotification('Failed to fetch authors', 'error')
    console.error('Error fetching authors:', err)
  } finally {
    isLoading.value = false
  }
}

const toggleActionMenu = (id) => {
  if (activeActionMenu.value === id) {
    activeActionMenu.value = null
    if (closeMenuTimeout.value) clearTimeout(closeMenuTimeout.value)
  } else {
    activeActionMenu.value = id
    if (closeMenuTimeout.value) clearTimeout(closeMenuTimeout.value)
    closeMenuTimeout.value = setTimeout(() => {
      activeActionMenu.value = null
    }, 3000)
  }
}

const openAddDialog = () => {
  resetCurrentAuthor()
  isEditing.value = false
  showAddEditModal.value = true
}

const closeAddEditDialog = () => {
  showAddEditModal.value = false
  if (currentAuthor.value.profile_preview) {
    URL.revokeObjectURL(currentAuthor.value.profile_preview)
  }
  resetCurrentAuthor()
}

const resetCurrentAuthor = () => {
  currentAuthor.value = {
    id: null,
    name: '',
    nationality: '',
  }
}

const submitAuthor = async () => {
  try {
    isLoading.value = true

    const payload = {
      name: currentAuthor.value.name,
      nationality: currentAuthor.value.nationality
    }

    if (isEditing.value) {
      await updateAuthor(currentAuthor.value.id, payload)
      showNotification('Author updated successfully', 'success')
    } else {
      await createAuthor(payload)
      showNotification('Author added successfully', 'success')
    }

    await fetchAuthors()
    closeAddEditDialog()
  } catch (error) {
    showNotification(`Failed to ${isEditing.value ? 'update' : 'add'} author`, 'error')
    console.error('Failed to submit author:', error.response?.data || error)
  } finally {
    isLoading.value = false
  }
}


const closeViewDialog = () => {
  showViewModal.value = false
  selectedAuthorDetails.value = {}
}

const editAuthor = (author) => {
  currentAuthor.value = {
    id: author.id,
    name: author.name,
    nationality: author.nationality,
  }
  isEditing.value = true
  showAddEditModal.value = true
  activeActionMenu.value = null
}

const openDeleteConfirm = (id) => {
  authorToDelete.value = id
  showDeleteConfirm.value = true
  activeActionMenu.value = null
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  authorToDelete.value = null
}

const confirmDelete = async () => {
  try {
    isLoading.value = true
    await deleteAuthor(authorToDelete.value)
    showNotification('Author deleted successfully', 'success')
    await fetchAuthors()
  } catch (error) {
    showNotification('Failed to delete author', 'error')
    console.error('Failed to delete author:', error)
  } finally {
    isLoading.value = false
    showDeleteConfirm.value = false
    authorToDelete.value = null
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

onMounted(() => {
  fetchAuthors()
})
</script>