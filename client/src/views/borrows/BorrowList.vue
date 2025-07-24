<template>
<div>
<!-- Header Section -->
    <div class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-3xl font-semibold text-gray-800">Borrow Records</h2>
        <p class="text-gray-500 mt-1">Track, filter, and manage all book borrowing activities</p>
      </div>
      <div class="flex flex-wrap gap-4">
        <select v-model="selectedCategory"
          class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
        </select>

        <select v-model="limit"
          class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
          <option v-for="n in [10, 20, 50]" :key="n" :value="n">Show {{ n }}</option>
        </select>
      </div>
    </div>
    <!-- Search & Actions -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <input v-model="search" type="text" placeholder="Search book title..."
        class="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />

      <div class="flex items-center gap-4">
        <button disabled class="bg-gray-200 px-6 py-2 rounded-md cursor-not-allowed text-gray-500 select-none">
          Export
        </button>
        <button @click="showModal = true"
          class="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition shadow-md">
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
            <th class="px-5 py-3 border-b border-gray-300">Status</th>
            <th class="px-5 py-3 border-b border-gray-300">Borrow Date</th>
            <th class="px-5 py-3 border-b border-gray-300">Return Date</th>
            <th class="px-5 py-3 border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredBorrowData" :key="item.id" class="hover:bg-gray-50 transition">
            <td class="px-5 py-3 border-b border-gray-300 align-middle">
              {{ index + 1 + (currentPage - 1) * limit }}
            </td>
            <td class="px-5 py-3 border-b border-gray-300 flex items-center gap-3 align-middle">
              <img :src="item.book.cover_image" alt="cover" class="w-10 h-12 object-cover rounded-md shadow-sm" />
              <span class="text-blue-600 cursor-pointer hover:underline font-medium" @click="handleShow(item)">
                {{ item.book.title }}
              </span>
            </td>
            <td class="px-5 py-3 border-b border-gray-300 align-middle">{{ item.book.category }}</td>
            <td class="px-5 py-3 border-b border-gray-300 capitalize font-semibold align-middle">{{ item.user.name }}
            </td>
            <td class="px-5 py-3 border-b border-gray-300 align-middle">{{ item.borrowed_quantity || 0 }}</td>
            <!-- Action Button -->
            <td class="px-5 py-3 border-b border-gray-300 align-middle">
              <button v-if="item.status === 'borrowed'" @click="confirmReturn(item.id)"
                class="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700">
                Return
              </button>
              <span v-else class="text-green-700 font-semibold bg-green-100 px-3 py-1 rounded">
                Returned
              </span>
            </td>
            <td class="px-5 py-3 border-b border-gray-300 align-middle">{{ formatDate(item.borrow_date) }}</td>
            <td class="px-5 py-3 border-b border-gray-300 align-middle">{{ formatDate(item.return_date) }}</td>
            <td class="px-5 py-3 border-b border-gray-300 relative align-middle">
              <button @click.stop="toggleDropdown(item.id)" class="text-gray-600 hover:text-black focus:outline-none"
                aria-label="Actions menu">
                <span class="material-symbols-outlined text-lg">more_vert</span>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="openDropdown === item.id"
                class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <button @click="handleShow(item)"
                  class="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 transition">
                  <span class="material-symbols-outlined text-base">visibility</span>
                  Show
                </button>
                <button @click="openUpdateModal(item)"
                  class="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 transition">
                  <span class="material-symbols-outlined text-base">edit</span>
                  Update
                </button>
                <button @click="handleDelete(item.id)"
                  class="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-100 transition">
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
        <button :disabled="currentPage === 1" @click="currentPage--"
          class="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition">
          ‹
        </button>

        <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
          'px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition',
          currentPage === page ? 'bg-blue-600 text-white border-blue-600' : ''
        ]">
          {{ page }}
        </button>

        <button :disabled="currentPage === totalPages" @click="currentPage++"
          class="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition">
          ›
        </button>
      </div>
    </div>

    <!-- Book Detail Modal -->
    <div v-if="showBookDetail"
      class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showBookDetail = false">
      <div class="relative w-full max-w-3xl mx-4 md:mx-0 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all">
        <button class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          @click="showBookDetail = false" aria-label="Close book details">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="bg-gray-100 p-5 flex items-center justify-center">
            <img v-if="selectedBook.book?.cover_image" :src="selectedBook.book.cover_image" alt="Book Cover"
              class="w-full h-80 object-cover rounded-lg shadow-md" />
            <div v-else
              class="w-full h-80 bg-white border flex items-center justify-center text-gray-400 text-sm rounded-lg">
              No Cover Image
            </div>
          </div>
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

    <!-- update Borrow Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="showModal = false">
      <div class="bg-white p-6 rounded-xl shadow-lg w-[400px] max-w-full">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Add Borrow Record</h3>
        <button @click="showModal = false"
          class="mt-4 bg-red-500 text-white px-5 py-2 rounded-md w-full hover:bg-red-600 transition">
          Close
        </button>
      </div>
    </div>
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      @click.self="closeUpdateModal">
      <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
        <h3 class="text-2xl font-semibold mb-6 text-gray-800">Update Borrow Record</h3>

        <form @submit.prevent="submitUpdate" class="space-y-5">
          <div>
            <label for="bookTitle" class="block mb-1 font-medium text-gray-700">Book Title</label>
            <input id="bookTitle" type="text" v-model="updateForm.bookTitle" placeholder="Enter book title" required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              maxlength="255" />
          </div>

          <div>
            <label for="userName" class="block mb-1 font-medium text-gray-700">User Name</label>
            <input id="userName" type="text" v-model="updateForm.userName" placeholder="Enter user name" required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              maxlength="255" />
          </div>

          <div>
            <label for="return_date" class="block mb-1 font-medium text-gray-700">Return Date</label>
            <input id="return_date" type="date" v-model="updateForm.return_date" required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
          <div>
            <label for="borrowed_quantity" class="block mb-1 font-medium text-gray-700">Quantity</label>
            <input id="borrowed_quantity" type="number" min="1" v-model.number="updateForm.borrowed_quantity" required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>

          <div>
            <label for="status" class="block mb-1 font-medium text-gray-700">Status</label>
            <select id="status" v-model="updateForm.status" required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select></div>
          <div v-if="formError" class="text-red-600 text-sm mb-2">
            {{ formError }}
          </div>
          <div class="flex justify-end gap-4 mt-4">
            <button type="button" @click="closeUpdateModal"
              class="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100 transition font-medium text-gray-700">
              Cancel
            </button>
            <button type="submit"
              class="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-semibold">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Borrow Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50"
      @click.self="showModal = false">
      <div class="bg-white p-6 rounded-xl shadow-lg w-[600px] max-w-full">
        <h3 class="text-2xl font-semibold mb-6 text-blue-800">Add Borrow Record</h3>
        <form @submit.prevent="submitAddBorrow" class="space-y-5">
          <div>
            <label class="block mb-1 font-medium">User Name</label>
            <input v-model="addForm.user_name" type="text" required class="w-full border px-3 py-2 rounded" placeholder="User name...."/>
          </div>
          <div>
            <label class="block mb-1 font-medium">Book Title </label>
            <input v-model="addForm.book_name" type="text" required class="w-full border px-3 py-2 rounded" placeholder="Title ...."/>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 font-medium">ISBN</label>
              <input v-model="addForm.isbn" type="text" required class="w-full border px-3 py-2 rounded" placeholder="123456789 ...." />
            </div>
            <div>
              <label class="block mb-1 font-medium">Quantity</label>
              <input v-model.number="addForm.quantity" type="number" min="1" required class="w-full border px-3 py-2 rounded" />
            </div>
          </div>
          <div>
            <label class="block mb-1 font-medium">Librarian</label>
            <input v-model="addForm.librarian_name" type="text" required class="w-full border px-3 py-2 rounded" placeholder="Name  ...." />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 font-medium">Borrow Date</label>
              <input v-model="addForm.date_borrow" type="date" required class="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label class="block mb-1 font-medium">Return Date</label>
              <input v-model="addForm.date_return" type="date" required class="w-full border px-3 py-2 rounded" />
            </div>
          </div>
          <div>
            <label class="block mb-1 font-medium">Status</label>
            <select v-model="addForm.status" required class="w-full border px-3 py-2 rounded">
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          <div class="flex justify-end gap-4 pt-4">
            <button type="button" @click="showModal = false"
              class="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100 transition font-medium text-gray-700">
              Cancel
            </button>
            <button type="submit"
              class="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-semibold">
              Add Borrow
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Notification Toast -->
  <transition name="fade">
    <div v-if="message" :class="[
      'fixed bottom-6 right-6 z-50 w-full max-w-sm flex items-start justify-between gap-4 px-5 py-4 rounded-lg shadow-xl border-l-4',
      messageType === 'success'? 'bg-green-100 border-green-600 text-green-700': 'bg-red-50 border-red-600 text-red-700']">
      <div class="mt-1">
        <svg v-if="messageType === 'success'" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="font-semibold">
          {{ messageType === 'success' ? 'Success' : 'Error' }}
        </p>
        <p class="text-sm">{{ message }}</p>
      </div>
      <button @click="message = ''" class="text-xl font-bold leading-none hover:opacity-60 text-gray-400">
        &times;
      </button>
    </div>
  </transition>

  <!-- Confirmation Modal -->
  <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 md:p-8 relative">
      <div class="flex justify-center mb-4">
        <svg class="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M13 16h-1v-4h-1m0-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-2">Confirm Return</h2>
      <p class="text-center text-gray-600 mb-6">
        Are you sure you want to mark this book as <span class="font-medium text-green-600">Returned</span>?
      </p>
      <div class="flex justify-center gap-4">
        <button @click="handleConfirmReturn"
          class="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg transition-all duration-150">
          Yes, Return
        </button>
        <button @click="showConfirmModal = false"
          class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded-lg transition-all duration-150">
          Cancel
        </button>
      </div>
    </div>
  </div>

</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getBorrows, createBorrow, updateBorrow, deleteBorrow } from '@/services/Api/borrow'
import Swal from 'sweetalert2'

const router = useRouter()

const borrowData = ref([])
const loading = ref(false)
const error = ref(null)

// Categories extracted from borrowData
const categories = computed(() => {
  const set = new Set(borrowData.value.map(item => item.book.category))
  return Array.from(set).map((name, index) => ({ id: index + 1, name }))
})

// Added authors filter dropdown (you had computed but no dropdown in template)
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
  // Added dropdown-menu class to dropdown div in template or adjusted selector
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
    borrowData.value = response.data
  } catch (err) {
    error.value = 'Failed to load borrow records.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

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

// Modal & selected items
const showBookDetail = ref(false)
const selectedBook = ref({})

function handleShow(item) {
  selectedBook.value = item
  showBookDetail.value = true
  closeDropdown()
}

const showUpdateModal = ref(false)

const updateForm = ref({
  id: null,
  bookTitle: '',
  userName: '',
  return_date: '',
  borrowed_quantity: 0,
  status: 'borrowed'
})

function openUpdateModal(item) {
  updateForm.value.id = item.id
  updateForm.value.bookTitle = item.book.title
  updateForm.value.userName = item.user.name
  updateForm.value.return_date = item.return_date || ''
  updateForm.value.borrowed_quantity = item.borrowed_quantity || 0
  updateForm.value.status = item.status || 'borrowed'
  showUpdateModal.value = true
}
const statusOptions = ref([
  { value: 'borrowed', label: 'Borrowed' },
  { value: 'returned', label: 'Returned' }
])

function closeUpdateModal() {
  showUpdateModal.value = false
}

async function submitUpdate() {
  try {
    // Example payload — adjust fields according to your API
    const payload = {
      bookTitle: updateForm.value.bookTitle,
      userName: updateForm.value.userName,
      return_date: updateForm.value.return_date,
      borrowed_quantity: updateForm.value.borrowed_quantity,
      status: updateForm.value.status,
    }
    await updateBorrow(updateForm.value.id, payload)
    await fetchBorrowData()
    showUpdateModal.value = false
    showToast('Borrow record updated successfully.', 'success')
  }
  catch (error) {
    console.error('Update failed:', error)
    showToast('Failed to update borrow record.', 'error')
  }
}


// Add form data and submit handler
const addForm = ref({
  user_name: '',
  email_borrower: '',
  book_name: '',
  isbn: '',
  quantity: 0,
  librarian_name: '',
  date_borrow: '',
  date_return: '',
  status: 'borrowed'
})

async function submitAddBorrow() {
  try {
    const payload = { ...addForm.value }
    await createBorrow(payload)
    await fetchBorrowData()
    showModal.value = false
    addForm.value = {
      user_name: '',
      email_borrower: '',
      book_name: '',
      isbn: '',
      quantity: 1,
      librarian_name: '',
      date_borrow: '',
      date_return: '',
      status: 'borrowed',

    }
    showToast('Borrow record added successfully.', 'success')
  } catch (error) {
    console.error('Failed to add borrow record:', error)
    showToast('Failed to add borrow record.', 'error')
  }
}

// Delete a borrow record with confirmation
async function handleDelete(id) {
  try {
    await deleteBorrow(id)
    await fetchBorrowData()
    showToast('Borrow record deleted successfully.', 'success')
  } catch (error) {
    console.error(error)
    showToast('Failed to delete record.', 'error')
  }
}

const message = ref('')
const messageType = ref('success') // 'success' | 'error'

// Function to show alert
function showToast(msg, type = 'success') {
  message.value = msg
  messageType.value = type

  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

const showConfirmModal = ref(false)
const returnId = ref(null)

function confirmReturn(id) {
  returnId.value = id
  showConfirmModal.value = true
}

async function handleConfirmReturn() {
  try {
    await updateBorrow(returnId.value, {
      status: 'returned',
      date_return: new Date().toISOString().slice(0, 10),
    })
    await fetchBorrowData()
    showToast('Book marked as returned successfully.', 'success')
  } catch (error) {
    console.error('Return failed:', error)
    showToast('Failed to mark as returned.', 'error')
  } finally {
    showConfirmModal.value = false
  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
</style>
