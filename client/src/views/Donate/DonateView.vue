<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="w-full bg-blue-50 rounded-xl shadow-md p-6 space-y-4 flex flex-row justify-between items-center">
      <!-- Title and Description -->
      <div class="gap-6 flex flex-col">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">📚 Book Inventory</h1>
          <p class="text-sm text-gray-600 mt-1">
            Browse and manage the list of available books in our library. You can search, filter, and keep track
            of the book inventory below.
          </p>
        </div>
        <!-- Button: Donate Books -->
        <div>
          <button @click="openAddDialog"
            class="flex items-end gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-md hover:bg-blue-700 text-sm shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 4v16m8-8H4" />
            </svg>
            Donate Books
          </button>
        </div>
      </div>
      <!-- Image at the End -->
      <div class="flex justify-end items-center p-6">
        <img src="https://i.pinimg.com/736x/a7/7a/8b/a77a8b275f7c0894bcf0f8094fde7ad6.jpg" alt="Book Inventory Image"
          class="w-40 h-40 object-cover rounded-xl shadow-md" />
      </div>
    </div>

    <!-- Search -->
    <div>
      <input v-model="searchTerm" type="text" placeholder="Search by title, ISBN, or owner..."
        class="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
    </div>

    <!-- Book Cards -->
    <div class="overflow-x-auto">
      <div class="flex gap-6 snap-x snap-mandatory px-2">
        <!-- Book Card -->
        <div v-for="book in paginatedBooks" :key="book.id"
          class="book-card min-w-[300px] max-w-[300px] flex-shrink-0 snap-start bg-white shadow-md border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <!-- Image and Action -->
          <div class="relative">
            <!-- Book Cover -->
            <img v-if="book.cover_image" :src="book.cover_image" alt="Book Cover"
              class="w-full h-64 object-cover bg-gray-100" />


            <!-- Three Dot Button -->
            <button @click="toggleMenu(book.id)"
              class="absolute top-2 right-2 text-white  hover:bg-black/80 rounded-full p-1 text-xl z-20">
              ⋮
            </button>

            <!-- Dropdown Menu -->
            <div v-if="activeMenuId === book.id"
              class="absolute top-10 right-2 w-28 bg-white border border-gray-200 rounded-md shadow z-30">
              <button @click="openEditDialog(book); closeMenu()"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Edit
              </button>
              <button @click="deleteBook(book.id); closeMenu()"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-4 space-y-2">
            <!-- Title and ISBN -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 leading-tight">{{ book.title }}</h2>
              <p class="text-sm text-gray-500">ISBN: {{ book.isbn }}</p>
            </div>

            <!-- Quantity Badge -->
            <div>
              <span class="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                Quantity: {{ book.quantity }}
              </span>
            </div>

            <!-- Book Info -->
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2">
              <div>
                <span class="font-medium text-gray-800">Language:</span>
                {{ getLanguageName(book.language_id) }}
              </div>
              <div>
                <span class="font-medium text-gray-800">Category:</span>
                {{ getCategoryName(book.category_id) }}
              </div>
              <div>
                <span class="font-medium text-gray-800">Owner:</span>
                {{ book.owner }}
              </div>
              <div>
                <span class="font-medium text-gray-800">ID:</span>
                {{ book.id }}
              </div>
            </div>
          </div>

        </div>

        <!-- No Results -->
        <div v-if="paginatedBooks.length === 0" class="col-span-full text-center text-gray-500 italic">
          No books found.
        </div>
      </div>
    </div>
  </div>



  <!-- Pagination -->
  <div class="flex justify-end items-center gap-4 pt-6">
    <button @click="currentPage--" :disabled="currentPage === 1"
      class="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50">Previous</button>
    <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="currentPage++" :disabled="currentPage === totalPages"
      class="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50">Next</button>
  </div>

  <!-- Add/Edit Modal -->
  <div v-if="showAddDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-5 sm:p-6 rounded-xl w-full max-w-md shadow-lg relative">
      <!-- Close Button -->
      <button class="absolute top-2.5 right-3 text-gray-400 hover:text-gray-800 text-xl" @click="closeDialog"
        aria-label="Close">
        ×
      </button>
      <!-- Title -->
      <h2 class="text-xl font-bold text-center text-gray-800 mb-5">
        {{ isEditing ? '✏️ Edit Book' : '📘 Donate a New Book' }}
      </h2>
      <!-- Form -->
      <form @submit.prevent="submitDonation" class="space-y-3 text-sm">
        <div>
          <label class="block mb-1 text-gray-700">Title</label>
          <input v-model="donation.title" type="text" required
            class="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label class="block mb-1 text-gray-700">ISBN</label>
          <input v-model="donation.isbn" type="text" required
            class="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label class="block mb-1 text-gray-700">Quantity</label>
          <input v-model.number="donation.quantity" type="number" min="1" required
            class="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label class="block mb-1 text-gray-700">Owner</label>
          <input v-model="donation.owner" type="text" required
            class="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block mb-1 text-gray-700">Language</label>
            <select v-model="donation.language_id" required
              class="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              <option disabled value="">Select</option>
              <option :value="1">English</option>
              <option :value="2">French</option>
              <option :value="3">Khmer</option>
            </select>
          </div>
          <div>
            <label class="block mb-1 text-gray-700">Category</label>
            <select v-model="donation.category_id" required
              class="w-full border border-gray-300 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              <option disabled value="">Select</option>
              <option :value="1">Fiction</option>
              <option :value="2">Classic</option>
              <option :value="3">Science</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block mb-1 text-gray-700">Cover Image (optional)</label>
          <input type="file" accept="image/*" @change="handleImageUpload" class="text-sm w-full" />
          <div v-if="donation.cover_image" class="mt-2">
            <img :src="donation.cover_image" alt="Preview" class="h-28 object-contain rounded border" />
          </div>
        </div>
        <!-- Submit Button -->
        <div class="flex justify-end pt-2">
          <button type="submit"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md font-medium shadow-sm transition">
            {{ isEditing ? 'Update Book' : 'Donate' }}
          </button>
        </div>
      </form>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// State
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const showAddDialog = ref(false)
const isEditing = ref(false)
const editingBookId = ref(null)
const activeMenuId = ref(null)
let menuTimeout = null

// Load books from localStorage on mount
const books = ref(JSON.parse(localStorage.getItem('books')) || [
  {
    id: 1,
    title: 'The Great Gatsby',
    isbn: '978-3-16-148410-0',
    quantity: 12,
    language_id: 1,
    cover_image: 'https://i.pinimg.com/736x/23/54/a3/2354a34faaf6f53ca97542a62fbd5545.jpg',
    owner: 'Admin',
    category_id: 2
  },
  {
    id: 2,
    title: '1984',
    isbn: '978-0-452-28423-4',
    quantity: 7,
    language_id: 2,
    cover_image: 'https://i.pinimg.com/736x/b3/c7/a6/b3c7a60e11b25e3d908924832ff23509.jpg',
    owner: 'Librarian',
    category_id: 1
  }
])

const donation = ref({
  title: '',
  isbn: '',
  quantity: 1,
  owner: '',
  language_id: '',
  category_id: '',
  cover_image: ''
})

// Watch books and save to localStorage whenever it changes
watch(books, (newBooks) => {
  localStorage.setItem('books', JSON.stringify(newBooks))
}, { deep: true })

// Menu Logic
const toggleMenu = (bookId) => {
  if (activeMenuId.value === bookId) {
    closeMenu()
    return
  }
  closeMenu()
  activeMenuId.value = bookId
  menuTimeout = setTimeout(() => {
    closeMenu()
  }, 3000)
}

const closeMenu = () => {
  activeMenuId.value = null
  if (menuTimeout) {
    clearTimeout(menuTimeout)
    menuTimeout = null
  }
}

// Dialog Methods
const openAddDialog = () => {
  isEditing.value = false
  resetForm()
  showAddDialog.value = true
}

const openEditDialog = (book) => {
  isEditing.value = true
  editingBookId.value = book.id
  Object.assign(donation.value, { ...book })
  showAddDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(donation.value, {
    title: '',
    isbn: '',
    quantity: 1,
    owner: '',
    language_id: '',
    category_id: '',
    cover_image: ''
  })
  editingBookId.value = null
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    donation.value.cover_image = e.target.result
  }
  reader.readAsDataURL(file)
}

const submitDonation = () => {
  if (isEditing.value) {
    const index = books.value.findIndex(b => b.id === editingBookId.value)
    if (index !== -1) books.value[index] = { ...donation.value, id: editingBookId.value }
  } else {
    books.value.push({ ...donation.value, id: Date.now() })
  }
  closeDialog()
}

const deleteBook = (id) => {
  books.value = books.value.filter(b => b.id !== id)
}

// Computed Properties
const filteredBooks = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return books.value.filter(
    b =>
      b.title.toLowerCase().includes(term) ||
      b.isbn.toLowerCase().includes(term) ||
      b.owner.toLowerCase().includes(term)
  )
})

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredBooks.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage))

const getLanguageName = (id) => ({ 1: 'English', 2: 'French', 3: 'Khmer' }[id] || 'Unknown')
const getCategoryName = (id) => ({ 1: 'Fiction', 2: 'Classic', 3: 'Science' }[id] || 'Unknown')
</script>