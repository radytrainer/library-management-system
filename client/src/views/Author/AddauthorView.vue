<template>
  <div class="space-y-4 p-10">
    <!-- Header -->
    <!-- Blue Card Wrapper -->
    <div class="bg-sky-500 border border-blue-100 rounded-2xl shadow p-6 space-y-6 mb-10">
      <!-- Title and Filters -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-white mt-4">Author Management</h2>
          <p class="text-white">A modern, efficient way to manage authors for your library or publishing team.</p>
        </div>

        <div class="flex gap-4 md:flex-row mt-10">
          <!-- Nationality Filter -->
          <select v-model="selectedNationality"
            class="text-sm border border-white-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-white-200 focus:outline-none justify-center">
            <option value="">Nationality</option>
            <option v-for="nation in nationalities" :key="nation" :value="nation">
              {{ nation }}
            </option>
          </select>

          <!-- Limit -->
          <select v-model="limit"
            class="text-sm border border-blue-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Authors</option>
            <option v-for="n in [10, 20, 50]" :key="n" :value="n">Show {{ n }}</option>
          </select>
        </div>
      </div>
      <!-- Search and Add Button -->
      <div class="flex justify-between items-center">
        <input v-model="search" type="text" placeholder="Search Author Name..."
          class="border border-blue-200 rounded-lg px-4 py-2 w-1/3 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      </div>
    </div>
    <div class="flex justify-end mb-4">
      <button @click="openAddDialog" class="bg-sky-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        + Add Author
      </button>
    </div>
    <!-- Authors Table -->
    <div class="bg-white border border-gray-200 rounded-xl mt-9">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-600">ID</th>
            <th class="px-4 py-3 font-medium text-gray-600">Profile</th>
            <th class="px-4 py-3 font-medium text-gray-600">Birth Date</th>
            <th class="px-4 py-3 font-medium text-gray-600">Nationality</th>
            <th class="px-4 py-3 font-medium text-gray-600">Living</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(author, index) in filteredAuthors" :key="author.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-600">{{ index + 1 }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center space-x-3">
                <img :src="author.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  author.name
                )}&background=random`" class="w-9 h-9 rounded-full border object-cover" alt="Author" />
                <span class="font-medium text-gray-900">{{ author.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-700">{{ formatDate(author.birth_date) }}</td>
            <td class="px-4 py-3 text-gray-700">{{ author.nationality }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 rounded-full text-xs font-medium"
                :class="author.isLiving ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ author.isLiving ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="relative inline-block text-left">
                <button @click="toggleActionMenu(author.id)" aria-label="Actions menu">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </svg>
                </button>
                <div v-if="activeActionMenu === author.id"
                  class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 py-1">
                  <button @click="viewAuthor(author)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    View
                  </button>
                  <button @click="editAuthor(author)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Edit
                  </button>
                  <button @click="handleDeleteAuthor(author.id)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Author Modal -->
    <div v-if="showAddEditModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md space-y-4 max-h-[90vh]">
        <h3 class="text-lg font-semibold">{{ isEditing ? 'Edit Author' : 'Add Author' }}</h3>
        <form @submit.prevent="submitAuthor" class="space-y-3">
          <input v-model="currentAuthor.name" type="text" placeholder="Name" class="w-full p-2 border rounded"
            required />
          <input v-model="currentAuthor.birth_date" type="date" class="w-full p-2 border rounded" required />
          <input v-model="currentAuthor.nationality" type="text" placeholder="Nationality"
            class="w-full p-2 border rounded" />
          <label class="flex items-center space-x-2">
            <input v-model="currentAuthor.isLiving" type="checkbox" class="w-4 h-4" />
            <span>Is Living?</span>
          </label>
          <textarea v-model="currentAuthor.biography" placeholder="Biography"
            class="w-full p-2 border rounded resize-none" rows="4"></textarea>
          <input type="file" accept="image/*" @change="handleProfileImage" class="w-full p-2 border rounded" />
          <div v-if="currentAuthor.profile_preview" class="flex justify-center">
            <img :src="currentAuthor.profile_preview" alt="Preview" class="w-24 h-24 rounded-full object-cover mt-2" />
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="closeAddEditDialog" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {{ isEditing ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Author Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-5 border-b border-gray-100">
          <h3 class="text-2xl font-semibold text-gray-800">Author Profile</h3>
        </div>

        <!-- Content -->
        <div class="p-6 max-h-[calc(90vh-140px)]">
          <!-- Author Profile Section -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8 mb-8">
            <div class="flex-shrink-0">
              <div class="relative">
                <img :src="selectedAuthorDetails.profile_image_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAuthorDetails.name)}&background=random`
                  " alt="Author Portrait"
                  class="w-36 h-36 rounded-2xl object-cover border-4 border-white shadow-lg ring-1 ring-gray-200" />
                <div
                  class="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                  <div :class="selectedAuthorDetails.isLiving ? 'bg-emerald-400' : 'bg-slate-400'"
                    class="w-3 h-3 rounded-full mr-2"></div>
                </div>
              </div>
            </div>

            <div class="flex-1 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                  <p class="text-lg font-semibold text-gray-900">{{ selectedAuthorDetails.name }}</p>
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-500 uppercase tracking-wide">Birth Date</label>
                  <p class="text-gray-800">{{ formatDate(selectedAuthorDetails.birth_date) }}</p>
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-500 uppercase tracking-wide">Nationality</label>
                  <p class="text-gray-800">{{ selectedAuthorDetails.nationality }}</p>
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-500 uppercase tracking-wide">Status</label>
                  <span
                    :class="selectedAuthorDetails.isLiving ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'"
                    class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border">
                    <div :class="selectedAuthorDetails.isLiving ? 'bg-emerald-400' : 'bg-slate-400'"
                      class="w-2 h-2 rounded-full mr-2"></div>
                    {{ selectedAuthorDetails.isLiving ? 'Living' : 'Deceased' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Biography Section -->
          <div class="border-t border-gray-100 pt-6">
            <label class="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Biography</label>
            <div
              class="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-100 max-h-64 overflow-y-auto">
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                {{ selectedAuthorDetails.biography || 'No biography available for this author.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
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
        <button :disabled="currentPage === 1" @click="currentPage--"
          class="px-3 py-1 border rounded disabled:opacity-50">
          ‹
        </button>

        <div class="px-4 py-1 font-medium">
          {{ currentPage }}
        </div>

        <button :disabled="currentPage === totalPages" @click="currentPage++"
          class="px-3 py-1 border rounded disabled:opacity-50">
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

const selectedNationality = ref('')
const limit = ref('')
const search = ref('')

const showAddEditModal = ref(false)
const isEditing = ref(false)
const currentAuthor = ref({
  id: null,
  name: '',
  birth_date: '',
  nationality: '',
  isLiving: true,
  biography: '',
  profile_image: null,
  profile_preview: null,
})

const showViewModal = ref(false)
const selectedAuthorDetails = ref({})
const currentPage = ref(1)
const rowsPerPage = 10

// Unique nationalities for filter dropdown
const nationalities = computed(() => {
  const set = new Set()
  authors.value.forEach(author => {
    if (author.nationality) set.add(author.nationality)
  })
  return [...set]
})

const filteredAuthors = computed(() => {
  let result = authors.value

  // Filter by nationality
  if (selectedNationality.value) {
    result = result.filter(author => author.nationality === selectedNationality.value)
  }

  // Filter by search
  if (search.value.trim()) {
    const keyword = search.value.toLowerCase()
    result = result.filter(author => author.name.toLowerCase().includes(keyword))
  }

  // Sort by newest first (descending by id)
  result = result.sort((a, b) => b.id - a.id)

  // Pagination: calculate start and end indexes
  const start = (currentPage.value - 1) * rowsPerPage
  const end = start + rowsPerPage

  // Return paginated results
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

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
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



const fetchAuthors = async () => {
  try {
    const res = await getAuthors()
    authors.value = res.data
  } catch (err) {
    console.error('Error fetching authors:', err)
  }
}

const toggleActionMenu = (id) => {
  activeActionMenu.value = activeActionMenu.value === id ? null : id
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
    birth_date: '',
    nationality: '',
    isLiving: true,
    biography: '',
    profile_image: null,
    profile_preview: null,
  }
}

const handleProfileImage = (e) => {
  const file = e.target.files[0]
  if (file) {
    currentAuthor.value.profile_image = file
    currentAuthor.value.profile_preview = URL.createObjectURL(file)
  }
}

const submitAuthor = async () => {
  try {
    const formData = new FormData()
    formData.append('name', currentAuthor.value.name)
    formData.append('birth_date', currentAuthor.value.birth_date)
    formData.append('nationality', currentAuthor.value.nationality)
    formData.append('isLiving', currentAuthor.value.isLiving)
    formData.append('biography', currentAuthor.value.biography)
    if (currentAuthor.value.profile_image) {
      formData.append('profile_image', currentAuthor.value.profile_image)
    }

    if (isEditing.value) {
      await updateAuthor(currentAuthor.value.id, formData)
    } else {
      await createAuthor(formData)
    }

    await fetchAuthors()
    closeAddEditDialog()
  } catch (error) {
    console.error('Failed to submit author:', error)
  }
}

const viewAuthor = (author) => {
  selectedAuthorDetails.value = author
  showViewModal.value = true
  activeActionMenu.value = null
}

const closeViewDialog = () => {
  showViewModal.value = false
  selectedAuthorDetails.value = {}
}

const editAuthor = (author) => {
  currentAuthor.value = {
    id: author.id,
    name: author.name,
    birth_date: author.birth_date,
    nationality: author.nationality,
    isLiving: author.isLiving,
    biography: author.biography,
    profile_image: null,
    profile_preview:
      author.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`,
  }
  isEditing.value = true
  showAddEditModal.value = true
  activeActionMenu.value = null
}

const handleDeleteAuthor = async (id) => {
  activeActionMenu.value = null
  const confirmed = window.confirm('Are you sure you want to delete this author?')
  if (!confirmed) return

  try {
    await deleteAuthor(id)
    await fetchAuthors()
  } catch (error) {
    console.error('Failed to delete author:', error)
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchAuthors()
})
</script>