<template>
  <div class="max-w-7xl mx-auto space-y-6 p-8">
    <!-- Header -->
    <div class="w-full bg-sky-600 rounded-xl shadow-md p-12 flex flex-col md:flex-row md:justify-between justify-center gap-12 py-5">
      <div class="flex flex-col gap-4 pr-4 md:pr-12">
        <div>
          <h1 class="text-4xl font-bold text-white mt-8">📚 Book Inventory</h1>
          <p class="text-sm text-white mt-3">
            Easily explore and manage all the books in our library collection.
            Use powerful search and filter tools to quickly find titles,
            check availability, and keep the inventory up to date.
            Whether you're donating, editing, or reviewing book details, everything you need is just a few clicks away.
          </p>
        </div>
        <div class="flex flex-wrap gap-4 items-center">
          <button @click="openAddDialog"
            class="flex items-center gap-2 px-5 py-2.5 bg-sky-300 text-white rounded-md hover:bg-blue-400 text-sm shadow"
            aria-label="Donate Book">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 4v16m8-8H4" />
            </svg>
            Donate Books
          </button>
        </div>
      </div>
      <div class="flex-shrink-0">
        <img src="../../../public/pic.png" alt="Bookshelf" class="w-80 h-auto object-contain" />
      </div>
    </div>

    <!-- Search -->
    <div>
      <input v-model="searchTerm" type="text" placeholder="Search by title, ISBN, or owner..."
        class="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
    </div>

    <!-- Book Cards -->
    <div v-if="visibleBooks.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 pb-4">
      <div v-for="book in visibleBooks" :key="book.id"
        class="bg-white shadow border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div class="relative">
          <img v-if="book.cover_image" :src="book.cover_image" alt="Book Cover"
            class="w-full h-44 object-cover bg-gray-100" />
          <button @click.stop="toggleMenu(book.id)"
            class="absolute top-2 right-2 text-white hover:bg-black/80 rounded-full p-1 text-lg z-30"
            aria-label="Open Menu">⋮</button>
          <div v-if="activeMenuId === book.id"
            class="absolute top-10 right-2 w-24 bg-white border border-gray-200 rounded-md shadow z-30">
            <button @click="viewBook(book); closeMenu()"
              class="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100">View</button>
            <button @click="openEditDialog(book); closeMenu()"
              class="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100">Edit</button>
            <button @click="deleteBook(book.id); closeMenu()"
              class="block w-full text-left px-3 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
          </div>
        </div>
        <div class="p-4 space-y-2 text-sm">
          <h2 class="font-semibold text-gray-800 truncate">{{ book.title }}</h2>
          <p class="text-xs text-gray-500 truncate">ISBN: {{ book.isbn }}</p>
          <span class="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-medium">
            Qty: {{ book.quantity }}
          </span>
          <div class="grid grid-cols-2 gap-1 text-[11px] text-gray-600 pt-1">
            <div><span class="font-medium">Lang:</span> {{ getLanguageName(book.language_id) }}</div>
            <div><span class="font-medium">Cat:</span> {{ getCategoryName(book.category_id) }}</div>
            <div><span class="font-medium">Owner:</span> {{ book.owner }}</div>
            <div><span class="font-medium">ID:</span> {{ book.id }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Show More Button -->
    <div v-if="canShowMore" class="flex justify-center mt-6">
      <button @click="showMore"
        class="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-00 transition shadow">
        Show More
      </button>
    </div>

    <!-- No Results -->
    <div v-else-if="!visibleBooks.length" class="text-center text-gray-500 italic p-6 w-full">
      No books found.
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div role="dialog" aria-modal="true" class="bg-white p-5 sm:p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <button class="absolute top-2.5 right-3 text-gray-400 hover:text-gray-800 text-xl" @click="closeDialog"
          aria-label="Close Modal">×</button>
        <h2 class="text-xl font-bold text-center text-gray-800 mb-5">
          {{ isEditing ? '✏️ Edit Book' : '📘 Donate a New Book' }}
        </h2>
        <form @submit.prevent="submitDonation" class="space-y-3 text-sm">
          <div><label class="block mb-1 text-gray-700">Title</label><input v-model="donation.title" required
              class="w-full border px-3 py-1.5 rounded-md" /></div>
          <div><label class="block mb-1 text-gray-700">ISBN</label><input v-model="donation.isbn" required
              class="w-full border px-3 py-1.5 rounded-md" /></div>
          <div><label class="block mb-1 text-gray-700">Quantity</label><input v-model.number="donation.quantity"
              type="number" min="1" required class="w-full border px-3 py-1.5 rounded-md" /></div>
          <div><label class="block mb-1 text-gray-700">Owner</label><input v-model="donation.owner" required
              class="w-full border px-3 py-1.5 rounded-md" /></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block mb-1 text-gray-700">Language</label>
              <select v-model="donation.language_id" required class="w-full border px-3 py-1.5 rounded-md">
                <option disabled value="">Select</option>
                <option :value="1">English</option>
                <option :value="2">French</option>
                <option :value="3">Khmer</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 text-gray-700">Category</label>
              <select v-model="donation.category_id" required class="w-full border px-3 py-1.5 rounded-md">
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
          <div class="flex justify-end pt-2">
            <button type="submit"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md font-medium shadow-sm transition">
              {{ isEditing ? 'Update Book' : 'Donate' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const searchTerm = ref('')
const visibleCount = ref(8)
const sortBy = ref('')
const showAddDialog = ref(false)
const isEditing = ref(false)
const editingBookId = ref(null)
const activeMenuId = ref(null)

const books = ref(JSON.parse(localStorage.getItem('books')) || [])
const donation = ref({
  title: '',
  isbn: '',
  quantity: 1,
  owner: '',
  language_id: '',
  category_id: '',
  cover_image: ''
})

watch(books, newBooks => {
  localStorage.setItem('books', JSON.stringify(newBooks))
}, { deep: true })

watch(searchTerm, () => {
  visibleCount.value = 8 // reset on search
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (e) => {
  if (!e.target.closest('.dropdown-menu')) closeMenu()
}

const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id
}
const closeMenu = () => activeMenuId.value = null

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
  reader.onload = e => donation.value.cover_image = e.target.result
  reader.readAsDataURL(file)
}

const submitDonation = () => {
  const duplicate = !isEditing.value && books.value.some(b => b.isbn === donation.value.isbn)
  if (duplicate) return alert('A book with this ISBN already exists.')

  if (isEditing.value) {
    const i = books.value.findIndex(b => b.id === editingBookId.value)
    if (i !== -1) books.value[i] = { ...donation.value, id: editingBookId.value }
  } else {
    books.value.push({ ...donation.value, id: Date.now() })
  }
  closeDialog()
}

const deleteBook = (id) => {
  books.value = books.value.filter(b => b.id !== id)
}
const viewBook = (book) => {
  alert(`Viewing Book: ${book.title}`)
}

const filteredBooks = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return books.value.filter(b =>
    b.title.toLowerCase().includes(term) ||
    b.isbn.toLowerCase().includes(term) ||
    b.owner.toLowerCase().includes(term)
  )
})

const sortedBooks = computed(() => {
  const copy = [...filteredBooks.value]
  if (sortBy.value === 'title') return copy.sort((a, b) => a.title.localeCompare(b.title))
  if (sortBy.value === 'quantity') return copy.sort((a, b) => b.quantity - a.quantity)
  return copy
})

const visibleBooks = computed(() => sortedBooks.value.slice(0, visibleCount.value))
const canShowMore = computed(() => visibleCount.value < sortedBooks.value.length)
const showMore = () => visibleCount.value += 8

const getLanguageName = id => ({ 1: 'English', 2: 'French', 3: 'Khmer' }[id] || 'Unknown')
const getCategoryName = id => ({ 1: 'Fiction', 2: 'Classic', 3: 'Science' }[id] || 'Unknown')
</script>
