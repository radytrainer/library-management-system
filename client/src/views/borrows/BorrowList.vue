<template>
  <div>
    <!-- Header Section -->
    <div class="mb-10 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">Borrow Records</h2>
        <p class="text-gray-500">Track, filter, and manage all book borrowing activities</p>
      </div>
      <div class="flex gap-4">
        <select v-model="selectedCategory" class="border rounded px-4 py-2">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
        </select>

        <select v-model="limit" class="border rounded px-4 py-2">
          <option v-for="n in [10, 20, 50]" :key="n" :value="n">Show {{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Search & Actions -->
    <div class="flex justify-between items-center mb-4">
      <input v-model="search" type="text" placeholder="Search book title..." class="border rounded px-4 py-2 w-1/3" />

      <div class="flex items-center gap-4">
        <button class="bg-gray-200 px-6 py-2 rounded cursor-not-allowed">Export</button>
        <button @click="navigateToAdd" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Add Borrow
        </button>

      </div>
    </div>

    <!-- Borrow Table -->
    <table class="w-full border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left border-b border-gray-300">#</th>
          <th class="px-4 py-2 text-left border-b border-gray-300">Book</th>
          <th class="px-4 py-2 text-left border-b border-gray-300">Category</th>
          <th class="px-4 py-2 text-left border-b border-gray-300">Borrower</th>
          <th class="px-4 py-2 text-left border-b border-gray-300">Qty</th>
          <th class="px-4 py-2 text-left border-b border-gray-300">Borrow Date</th>
          <th class="px-4 py-2 text-left border-b border-gray-300">Return Date</th>
          <th class="px-4 py-2 text-left border-b border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredBorrowData" :key="item.id" class="hover:bg-gray-50 relative">
          <td class="px-4 py-2 border-b border-gray-300">{{ index + 1 + (currentPage - 1) * limit }}</td>
          <td class="px-4 py-2 flex items-center gap-3 border-b border-gray-300">
            <img :src="item.book.cover_image" alt="cover" class="w-8 h-10 object-cover rounded" />
            <span class="text-blue-600 cursor-pointer hover:underline" @click="handleShow(item)">
              {{ item.book.title }}
            </span>
          </td>

          <td class="px-4 py-2 border-b border-gray-300">{{ item.book.category }}</td>
          <td class="px-4 py-2 font-medium capitalize border-b border-gray-300">{{ item.user.name }}</td>
          <td class="px-4 py-2 border-b border-gray-300">1</td>
          <td class="px-4 py-2 border-b border-gray-300">{{ item.borrow_date }}</td>
          <td class="px-4 py-2 border-b border-gray-300">{{ item.return_date }}</td>

          <td class="px-4 py-2 border-b border-gray-300 relative">
            <button @click.stop="toggleDropdown(item.id)" class="text-gray-600 hover:text-black focus:outline-none"
              aria-label="Actions menu">
              <span class="material-symbols-outlined">more_vert</span>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="openDropdown === item.id"
              class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-md z-20">
              <button @click="handleShow(item)"
                class="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100">
                <span class="material-symbols-outlined text-base">visibility</span>
                Show
              </button>
              <button @click="handleUpdate(item)"
                class="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100">
                <span class="material-symbols-outlined text-base">edit</span>
                Update
              </button>
              <button @click="handleDelete(item.id)"
                class="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-100">
                <span class="material-symbols-outlined text-base">delete</span>
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-6 flex justify-between items-center">
      <div>Page {{ currentPage }} of {{ totalPages }}</div>
      <div class="flex gap-2">
        <button :disabled="currentPage === 1" @click="currentPage--"
          class="px-3 py-1 border rounded disabled:opacity-50">
          ‹
        </button>

        <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
          'px-3 py-1 border rounded',
          currentPage === page ? 'bg-blue-500 text-white' : ''
        ]">
          {{ page }}
        </button>

        <button :disabled="currentPage === totalPages" @click="currentPage++"
          class="px-3 py-1 border rounded disabled:opacity-50">
          ›
        </button>
      </div>
    </div>

    <!-- Book Detail Modal -->
    <div v-if="showBookDetail"
      class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showBookDetail = false">
      <div
        class="relative w-full max-w-3xl mx-4 md:mx-0 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all">

        <!-- Close Button -->
        <button class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          @click="showBookDetail = false">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2">

          <!-- Book Cover -->
          <div class="bg-gray-100 p-5 flex items-center justify-center">
            <img v-if="selectedBook.book?.cover_image" :src="selectedBook.book.cover_image" alt="Book Cover"
              class="w-full h-80 object-cover rounded-lg shadow-md" />
            <div v-else
              class="w-full h-80 bg-white border flex items-center justify-center text-gray-400 text-sm rounded-lg">
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
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="showModal = false">
      <div class="bg-white p-6 rounded shadow-md w-[400px]">
        <h3 class="text-lg font-semibold mb-4">Add Borrow Record</h3>
        <!-- Add your form fields here -->

        <button @click="showModal = false" class="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'  // <-- add this
const router = useRouter()              // <-- and this
const borrowData = ref([
  {
    id: 1,
    book: {
      title: 'Angkor Cambodia',
      author: 'Horth',
      category: 'Khmer',
      cover_image: 'https://www.mickshippen.com/wp-content/gallery/blog-images/cambodia-cover-1.jpg',
    },
    user: { name: 'sor' },
    borrow_date: '2025-07-01',
    return_date: '2025-07-21',
  },
  {
    id: 2,
    book: {
      title: 'Angkor Cambodia',
      author: 'Horth',
      category: 'Khmer',
      cover_image: 'https://www.mickshippen.com/wp-content/gallery/blog-images/cambodia-cover-1.jpg',
    },
    user: { name: 'sor' },
    borrow_date: '2025-07-05',
    return_date: '2025-07-25',
  },
])


const categories = ref([{ id: 1, name: 'Khmer' }])
const authors = ref([{ id: 1, name: 'Horth' }])

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
function formatDate(date) {
  return new Date(date).toLocaleDateString()
}
// Close dropdown on outside click
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
})

const filteredBorrowData = computed(() => {
  let filtered = borrowData.value
  if (selectedCategory.value) {
    filtered = filtered.filter((item) => item.book.category === selectedCategory.value)
  }
  if (selectedAuthor.value) {
    filtered = filtered.filter((item) => item.book.author === selectedAuthor.value)
  }
  if (search.value) {
    filtered = filtered.filter((item) =>
      item.book.title.toLowerCase().includes(search.value.toLowerCase())
    )
  }
  const start = (currentPage.value - 1) * limit.value
  return filtered.slice(start, start + limit.value)
})

const totalPages = computed(() => {
  let filteredLength = borrowData.value.filter((item) => {
    return (
      (!selectedCategory.value || item.book.category === selectedCategory.value) &&
      (!selectedAuthor.value || item.book.author === selectedAuthor.value) &&
      (!search.value || item.book.title.toLowerCase().includes(search.value.toLowerCase()))
    )
  }).length
  return Math.ceil(filteredLength / limit.value)
})

// Action handlers (replace alerts with real logic)
const showBookDetail = ref(false)
const selectedBook = ref({})

// When user clicks on a book name
function handleShow(item) {
  selectedBook.value = item
  showBookDetail.value = true
  closeDropdown()
}

function handleUpdate(item) {
  alert(`Edit borrow record for: ${item.book.title}`)
  closeDropdown()
}

function handleDelete(id) {
  const confirmed = confirm('Are you sure you want to delete this record?')
  if (confirmed) {
    borrowData.value = borrowData.value.filter((item) => item.id !== id)
    closeDropdown()
  }
}
function navigateToAdd() {
  router.push({ name: 'borrow-add' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
</style>
