<template>
  <div>
    <!-- Header Section -->
    <div class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-3xl font-semibold text-gray-800">Borrow Records</h2>
        <p class="text-gray-500 mt-1">Track, filter, and manage all book borrowing activities</p>
      </div>
      <div class="flex flex-wrap gap-4">
        <select v-model="selectedCategory" class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
        </select>

        <select v-model="limit" class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
          <option v-for="n in [10, 20, 50]" :key="n" :value="n">Show {{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Search & Actions -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <input 
        v-model="search" 
        type="text" 
        placeholder="Search book title..." 
        class="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
      />

      <div class="flex items-center gap-4">
        <button disabled class="bg-gray-200 px-6 py-2 rounded-md cursor-not-allowed text-gray-500 select-none">
          Export
        </button>
        <button 
          @click="navigateToAdd" 
          class="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition shadow-md"
        >
          + Add Borrow
        </button>
      </div>
    </div>

    <!-- Borrow Table -->
    <div class=" rounded-lg border border-gray-300">
      <table class="w-full table-auto text-left">
        <thead class="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th class="px-5 py-3 border-b border-gray-300">#</th>
            <th class="px-5 py-3 border-b border-gray-300">Book</th>
            <th class="px-5 py-3 border-b border-gray-300">Category</th>
            <th class="px-5 py-3 border-b border-gray-300">Borrower</th>
            <th class="px-5 py-3 border-b border-gray-300">Qty</th>
            <th class="px-5 py-3 border-b border-gray-300">Borrow Date</th>
            <th class="px-5 py-3 border-b border-gray-300">Return Date</th>
            <th class="px-5 py-3 border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(item, index) in filteredBorrowData" 
            :key="item.id" 
            class="hover:bg-gray-50 transition"
          >
            <td class="px-5 py-3 border-b border-gray-300 align-middle">
              {{ index + 1 + (currentPage - 1) * limit }}
            </td>
            <td class="px-5 py-3 border-b border-gray-300 flex items-center gap-3 align-middle">
              <img 
                :src="item.book.cover_image" 
                alt="cover" 
                class="w-10 h-12 object-cover rounded-md shadow-sm"
              />
              <span 
                class="text-blue-600 cursor-pointer hover:underline font-medium" 
                @click="handleShow(item)"
              >
                {{ item.book.title }}
              </span>
            </td>
            <td class="px-5 py-3 border-b border-gray-300 align-middle">{{ item.book.category }}</td>
            <td class="px-5 py-3 border-b border-gray-300 capitalize font-semibold align-middle">{{ item.user.name }}</td>
            <td class="px-5 py-3 border-b border-gray-300 align-middle">{{ item.borrowed_quantity || 0 }}</td>
            <td class="px-5 py-3 border-b border-gray-300 align-middle">{{ formatDate(item.borrow_date) }}</td>
            <td class="px-5 py-3 border-b border-gray-300 align-middle">{{ formatDate(item.return_date) }}</td>
            <td class="px-5 py-3 border-b border-gray-300 relative align-middle">
              <button 
                @click.stop="toggleDropdown(item.id)" 
                class="text-gray-600 hover:text-black focus:outline-none" 
                aria-label="Actions menu"
              >
                <span class="material-symbols-outlined text-lg">more_vert</span>
              </button>

              <!-- Dropdown Menu -->
              <div 
                v-if="openDropdown === item.id"
                class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20"
              >
                <button 
                  @click="handleShow(item)"
                  class="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <span class="material-symbols-outlined text-base">visibility</span>
                  Show
                </button>
                <button 
                  @click="openUpdateModal(item)" 
                  class="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <span class="material-symbols-outlined text-base">edit</span>
                  Update
                </button>
                <button 
                  @click="handleDelete(item.id)"
                  class="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-100 transition"
                >
                  <span class="material-symbols-outlined text-base">delete</span>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
      <div class="text-gray-700 font-medium">Page {{ currentPage }} of {{ totalPages }}</div>
      <div class="flex gap-2">
        <button 
          :disabled="currentPage === 1" 
          @click="currentPage--"
          class="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition"
        >
          ‹
        </button>

        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="currentPage = page" 
          :class="[
            'px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition',
            currentPage === page ? 'bg-blue-600 text-white border-blue-600' : ''
          ]"
        >
          {{ page }}
        </button>

        <button 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
          class="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Book Detail Modal -->
    <div
      v-if="showBookDetail"
      class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showBookDetail = false"
    >
      <div 
        class="relative w-full max-w-3xl mx-4 md:mx-0 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all"
      >
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          @click="showBookDetail = false"
          aria-label="Close book details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2">
          <!-- Book Cover -->
          <div class="bg-gray-100 p-5 flex items-center justify-center">
            <img
              v-if="selectedBook.book?.cover_image"
              :src="selectedBook.book.cover_image"
              alt="Book Cover"
              class="w-full h-80 object-cover rounded-lg shadow-md"
            />
            <div
              v-else
              class="w-full h-80 bg-white border flex items-center justify-center text-gray-400 text-sm rounded-lg"
            >
              No Cover Image
            </div>
          </div>

          <!-- Book Info -->
          <div class="p-6 flex flex-col justify-center space-y-5">
            <div>
              <h2 class="text-2xl font-bold text-blue-700">
                {{ selectedBook.book?.title }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">
                Detailed information about the borrowed book
              </p>
            </div>

            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex justify-between">
                <span class="font-medium text-gray-600">Author:</span>
                <span>{{ selectedBook.book?.author }}</span>
              </li>
              <li class="flex justify-between">
                <span class="font-medium text-gray-600">Category:</span>
                <span>{{ selectedBook.book?.category }}</span>
              </li>
              <li class="flex justify-between">
                <span class="font-medium text-gray-600">Borrowed By:</span>
                <span class="text-blue-600 font-semibold">{{ selectedBook.user?.name }}</span>
              </li>
              <li class="flex justify-between">
                <span class="font-medium text-gray-600">Borrow Date:</span>
                <span>{{ selectedBook.borrow_date }}</span>
              </li>
              <li class="flex justify-between">
                <span class="font-medium text-gray-600">Return Date:</span>
                <span>{{ selectedBook.return_date }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Borrow Modal -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="showModal = false"
    >
      <div class="bg-white p-6 rounded-xl shadow-lg w-[400px] max-w-full">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Add Borrow Record</h3>
        <!-- Add your form fields here -->

        <button 
          @click="showModal = false" 
          class="mt-4 bg-red-500 text-white px-5 py-2 rounded-md w-full hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Update Modal -->
    <div
      v-if="showUpdateModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      @click.self="closeUpdateModal"
    >
      <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
        <h3 class="text-2xl font-semibold mb-6 text-gray-800">Update Borrow Record</h3>

        <form @submit.prevent="submitUpdate" class="space-y-5">
          <div>
            <label for="bookTitle" class="block mb-1 font-medium text-gray-700">Book Title</label>
            <input
              id="bookTitle"
              type="text"
              v-model="updateForm.bookTitle"
              placeholder="Enter book title"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              maxlength="255"
            />
          </div>

          <div>
            <label for="userName" class="block mb-1 font-medium text-gray-700">User Name</label>
            <input
              id="userName"
              type="text"
              v-model="updateForm.userName"
              placeholder="Enter user name"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              maxlength="255"
            />
          </div>

          <div>
            <label for="return_date" class="block mb-1 font-medium text-gray-700">Return Date</label>
            <input
              id="return_date"
              type="date"
              v-model="updateForm.return_date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label for="status" class="block mb-1 font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="updateForm.status"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          <div v-if="formError" class="text-red-600 text-sm mb-2">
            {{ formError }}
          </div>

          <div class="flex justify-end gap-4 mt-4">
            <button
              type="button"
              @click="closeUpdateModal"
              class="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100 transition font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getBorrows, getBorrowById, createBorrow, updateBorrow, deleteBorrow } from '@/services/Api/borrow'

const router = useRouter()

const borrowData = ref([])
const loading = ref(false)
const error = ref(null)

const categories = computed(() => {
  const set = new Set(borrowData.value.map(item => item.book.category))
  return Array.from(set).map((name, index) => ({ id: index + 1, name }))
})

const authors = computed(() => {
  const set = new Set(borrowData.value.map(item => item.book.author))
  return Array.from(set).map((name, index) => ({ id: index + 1, name }))
})

const selectedCategory = ref('')
const selectedAuthor = ref('')
const search = ref('')
const limit = ref(10)
const currentPage = ref(1)
const showModal = ref(false)
const openDropdown = ref(null)

function toggleDropdown(id) {
  openDropdown.value = openDropdown.value === id ? null : id
}

function closeDropdown() {
  openDropdown.value = null
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

function onClickOutside(event) {
  const dropdownMenus = document.querySelectorAll('.dropdown-menu, .material-symbols-outlined')
  let clickedInside = false
  dropdownMenus.forEach((el) => {
    if (el.contains(event.target)) clickedInside = true
  })
  if (!clickedInside) closeDropdown()
}

onMounted(() => {
  window.addEventListener('click', onClickOutside)
  fetchBorrowData()
})

async function fetchBorrowData() {
  loading.value = true
  error.value = null
  try {
    const response = await getBorrows()
    // Assuming your API returns data array in response.data
    borrowData.value = response.data
  } catch (err) {
    error.value = 'Failed to load borrow records.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Filtered data with pagination:
const filteredBorrowData = computed(() => {
  let filtered = borrowData.value
  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.book.category === selectedCategory.value)
  }
  if (selectedAuthor.value) {
    filtered = filtered.filter(item => item.book.author === selectedAuthor.value)
  }
  if (search.value) {
    filtered = filtered.filter(item => item.book.title.toLowerCase().includes(search.value.toLowerCase()))
  }
  const start = (currentPage.value - 1) * limit.value
  return filtered.slice(start, start + limit.value)
})

const totalPages = computed(() => {
  let filteredLength = borrowData.value.filter(item => {
    return (
      (!selectedCategory.value || item.book.category === selectedCategory.value) &&
      (!selectedAuthor.value || item.book.author === selectedAuthor.value) &&
      (!search.value || item.book.title.toLowerCase().includes(search.value.toLowerCase()))
    )
  }).length
  return Math.max(1, Math.ceil(filteredLength / limit.value))
})

watch([selectedCategory, selectedAuthor, search, limit], () => {
  currentPage.value = 1
})

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) currentPage.value = newTotal
})

// Action handlers
const showBookDetail = ref(false)
const selectedBook = ref({})

function handleShow(item) {
  selectedBook.value = item
  showBookDetail.value = true
  closeDropdown()
}

const showUpdateModal = ref(false)

// Form data for update
const updateForm = ref({
  bookTitle: '',
  userName: '',
  return_date: '',
  status: 'borrowed'
})

// Open modal and initialize form with existing data
function openUpdateModal(item) {
  updateForm.value.bookTitle = item.book.title
  updateForm.value.userName = item.user.name
  updateForm.value.return_date = item.return_date || ''
  updateForm.value.status = item.status || 'borrowed'
  showUpdateModal.value = true
}

// Close modal
function closeUpdateModal() {
  showUpdateModal.value = false
}

// Submit handler
function submitUpdate() {
  // Call your API to update borrow record with updateForm data
  console.log('Submitting updated data:', updateForm.value)
  // After success, close modal
  showUpdateModal.value = false
}

function navigateToAdd() {
  router.push({ name: 'borrow-add' })
}

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
</style>
