<template>
  <div class="space-y-6 p-8">
    <div class="bg-sky-600/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Left -->
        <div>
          <h2 class="text-3xl font-bold text-white">Author Management</h2>
          <p class="text-white/90 mt-1 max-w-2xl leading-relaxed">
            Manage author profiles in a sleek, modern dashboard designed for efficiency and clarity.
          </p>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3">
          <select v-model="selectedNationality"
            class="border border-white/40 bg-white/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/50">
            <option value="" class="bg-black text-white">Nationality</option>
            <option v-for="nation in nationalities" :key="nation" :value="nation" class="bg-black text-white">
              {{ nation }}
            </option>
          </select>

          <select v-model="limit"
            class="border border-white/40 bg-white/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/50">
            <option value="" class="bg-black text-white">Authors</option>
            <option v-for="n in [10, 20, 50]" :key="n" :value="n" class="bg-black text-white">
              Show {{ n }}
            </option>
          </select>

        </div>
      </div>

      <!-- Search and Add -->
      <div class="mt-6 flex flex-col md:flex-row justify-between gap-4">
        <input v-model="search" type="text" placeholder=" Search Author Name..."
          class="border border-white/40 bg-white/30 text-white placeholder-white/70 rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-white/50">
        <button @click="openAddDialog" class="bg-white text-sky-700 px-4 py-2 rounded-lg hover:bg-sky-100 transition">
          + Add Author
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-2xl">
      <table class="min-w-full text-sm">
        <thead class="bg-sky-50 text-sky-700">
          <tr>
            <th class="px-4 py-3 text-left font-semibold">ID</th>
            <th class="px-4 py-3 text-left font-semibold">Profile</th>
            <th class="px-4 py-3 text-left font-semibold">Birth Date</th>
            <th class="px-4 py-3 text-left font-semibold">Nationality</th>
            <th class="px-4 py-3 text-left font-semibold">Living</th>
            <th class="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(author, index) in filteredAuthors" :key="author.id"
            class="hover:bg-sky-50 transition-shadow hover:shadow-sm">
            <td class="px-4 py-3 text-gray-700 font-medium">{{ index + 1 }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img
                  :src="author.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`"
                  class="w-10 h-10 rounded-full object-cover border border-sky-200" alt="Author" />
                <span class="font-semibold text-gray-900">{{ author.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-700">{{ formatDate(author.birth_date) }}</td>
            <td class="px-4 py-3 text-gray-700">{{ author.nationality }}</td>
            <td class="px-4 py-3">
              <span class="px-3 py-1 rounded-full text-xs font-medium"
                :class="author.isLiving ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ author.isLiving ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="relative">
                <button @click="toggleActionMenu(author.id)" class="text-2xl hover:text-sky-600 transition p-2">
                  ⋮
                </button>

                <div v-if="activeActionMenu === author.id"
                  class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black/10 z-10 py-1">
                  <button @click="viewAuthor(author)"
                    class="block w-full text-left px-4 py-2 hover:bg-sky-50">View</button>
                  <button @click="editAuthor(author)"
                    class="block w-full text-left px-4 py-2 hover:bg-sky-50">Edit</button>
                  <button @click="handleDeleteAuthor(author.id)"
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
            class="w-full p-2 border rounded resize-none" rows="2"></textarea>
          <div
            class="flex flex-col items-center border-2 border-dashed border-sky-300 rounded-xl p-1 cursor-pointer hover:bg-sky-50 transition">
            <label class="flex flex-col items-center cursor-pointer">
              <!-- Upload Icon -->
              <svg class="w-10 h-10 text-sky-500 mb-2" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12"></path>
              </svg>
              <span class="text-sky-600 font-medium">Click to upload</span>
              <input type="file" accept="image/*" @change="handleProfileImage" class="hidden" />
            </label>

            <!-- Square Preview -->
            <div v-if="currentAuthor.profile_preview" class="flex justify-center mt-4">
              <img :src="currentAuthor.profile_preview" alt="Preview"
                class="w-24 h-24 object-cover border-2 border-sky-300 shadow rounded-lg" />
            </div>
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
const closeMenuTimeout = ref(null)

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