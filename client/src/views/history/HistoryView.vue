<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
          Borrowing History
        </h1>
        <p class="text-base text-gray-600 mt-2">
          Browse and manage your library's borrowing records
        </p>
      </div>

      <!-- Search and Filter Bar -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title or author..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>
        <div class="flex gap-4">
          <select
            v-model="categoryFilter"
            class="px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
          <select
            v-model="statusFilter"
            class="px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
          </select>
          <select
            v-model="userFilter"
            class="px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="">All Borrowers</option>
            <option v-for="borrower in borrowers" :key="borrower" :value="borrower">{{ borrower }}</option>
          </select>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm shadow-sm">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center text-gray-600 py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2">Loading books...</p>
      </div>

      <!-- Quick Stats -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Books</div>
          <div class="mt-2 text-2xl font-semibold text-gray-900">{{ filteredBooks.length }}</div>
        </div>
        <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Available</div>
          <div class="mt-2 text-2xl font-semibold text-green-600">{{ availableBooks }}</div>
        </div>
        <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">OVERDUE</div>
          <div class="mt-2 text-2xl font-semibold text-red-600">{{ borrowedBooks }}</div>
        </div>
      </div>

      <!-- Book List -->
      <div v-if="!isLoading && filteredBooks.length" class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class-RS
            class="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div class="col-span-1"></div>
            <div class="col-span-3">Book</div>
            <div class="col-span-2">Borrower</div>
            <div class="col-span-2">Category</div>
            <div class="col-span-2">Return Date</div>
            <div class="col-span-2 text-right">Status</div>
          </div>
        </div>
        <div>
          <div
            v-for="(book, index) in filteredBooks"
            :key="book.id"
            :class="[
              'transition-all duration-200 cursor-pointer hover:bg-gray-50',
              index !== filteredBooks.length - 1 ? 'border-b border-gray-100' : ''
            ]"
            @click="openBookDetails(book)"
          >
            <div class="px-6 py-4">
              <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-1">
                  <div class="w-12 h-16 rounded-lg border overflow-hidden shadow-sm">
                    <img
                      :src="book.cover_image"
                      :alt="book.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div class="col-span-3">
                  <h3 class="font-semibold text-gray-900 mb-1 line-clamp-1">{{ book.title }}</h3>
                  <p class="text-sm text-gray-600">by {{ book.author }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-sm text-gray-700">{{ book.borrower || '—' }}</p>
                </div>
                <div class="col-span-2">
                  <span 
                    :class="[
                      'inline-block px-3 py-1 rounded-full text-xs font-medium',
                      getCategoryStyle(book.category)
                    ]"
                  >
                    {{ book.category }}
                  </span>
                </div>
                <div class="col-span-2">
                  <p class="text-sm text-gray-700">{{ formatDate(book.return_date) }}</p>
                </div>
                <div class="col-span-2 text-right">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      book.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    <span 
                      :class="[
                        'w-2 h-2 rounded-full mr-1.5',
                        book.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      ]"
                    ></span>
                    {{ book.isAvailable ? 'Available' : 'Borrowed' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && !filteredBooks.length" class="text-center py-8 bg-white rounded-xl border shadow-sm">
        <p class="text-base text-gray-500">No books found matching your filters</p>
      </div>

      <!-- Book Details Modal -->
      <div
        v-if="selectedBook"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
        @click="closeBookDetails"
      >
        <div
          class="bg-white rounded-xl shadow-2xl max-w-2xl w-full transform transition-all duration-300"
          @click.stop
        >
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Book Details</h2>
            <button
              @click="closeBookDetails"
              class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X class="w-6 h-6" />
            </button>
          </div>
          <div class="p-6">
            <div class="flex flex-col md:flex-row gap-6">
              <div class="flex-shrink-0">
                <img
                  :src="selectedBook.cover_image"
                  :alt="selectedBook.title"
                  class="w-40 h-56 object-cover rounded-lg border shadow-sm mx-auto md:mx-0"
                />
                <div class="mt-4 text-center md:text-left">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      selectedBook.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    <span 
                      :class="[
                        'w-2 h-2 rounded-full mr-1.5',
                        selectedBook.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      ]"
                    ></span>
                    {{ selectedBook.isAvailable ? 'Available' : 'Currently Borrowed' }}
                  </span>
                </div>
              </div>
              <div class="flex-1">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedBook.title }}</h1>
                <p class="text-base text-gray-600 mb-3">by {{ selectedBook.author }}</p>
                <div class="mb-4">
                  <span 
                    :class="[
                      'inline-block px-3 py-1 rounded-full text-sm font-medium',
                      getCategoryStyle(selectedBook.category)
                    ]"
                  >
                    {{ selectedBook.category }}
                  </span>
                </div>
                <div class="mb-6">
                  <h3 class="text-base font-semibold text-gray-900 mb-2">Description</h3>
                  <p class="text-sm text-gray-700 leading-relaxed">{{ selectedBook.description || 'No description available' }}</p>
                </div>
              </div>
            </div>
            <div class="mt-6">
              <h3 class="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <History class="w-5 h-5 mr-2 text-gray-500" />
                Borrowing History
              </h3>
              <div v-if="selectedBook.borrowHistory.length > 0" class="border rounded-lg overflow-hidden shadow-sm">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Borrower</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Borrowed</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Returned</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Librarian</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr
                      v-for="(record, index) in selectedBook.borrowHistory"
                      :key="index"
                      class="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td class="px-4 py-3 text-sm">{{ record.user.name }}</td>
                      <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(record.borrow_date) }}</td>
                      <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(record.return_date) }}</td>
                      <td class="px-4 py-3 text-sm">{{ record.librarian.name }}</td>
                      <td class="px-4 py-3">
                        <span
                          :class="[
                            'inline-block px-3 py-1 rounded-full text-xs font-medium',
                            record.status === 'returned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          ]"
                        >
                          {{ record.status === 'returned' ? 'Returned' : 'Not Returned' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center py-6 bg-gray-50 rounded-lg border">
                <p class="text-sm text-gray-500">No borrowing history available</p>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
            <button
              v-if="selectedBook.isAvailable"
              @click="handleBorrowBook(selectedBook.id)"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Borrowing...' : 'Borrow Book' }}
            </button>
            <button
              v-else
              @click="handleReturnBook(selectedBook.id)"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Returning...' : 'Return Book' }}
            </button>
            <button
              @click="closeBookDetails"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              :disabled="isLoading"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { History, X } from 'lucide-vue-next'
import { getBorrows } from '@/services/Api/borrow'

const books = ref([])
const selectedBook = ref(null)
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const userFilter = ref('')

// Available categories (derived dynamically from data)
const categories = computed(() => {
  const uniqueCategories = new Set(books.value.map(book => book.category).filter(category => category))
  return [...uniqueCategories].sort()
})

// Available borrowers (derived from data)
const borrowers = computed(() => {
  const uniqueBorrowers = new Set(books.value.map(book => book.borrower).filter(borrower => borrower !== '—'))
  return [...uniqueBorrowers].sort()
})

// Transform API data into book-centric structure
const transformApiData = (apiData) => {
  const bookMap = new Map()
  apiData.forEach(record => {
    const bookId = record.book.id || record.id
    const bookData = {
      id: bookId,
      title: record.book.title || 'Unknown Title',
      author: record.book.author || 'Unknown Author',
      category: record.book.category || 'Uncategorized',
      cover_image: record.book.cover_image || 'https://via.placeholder.com/150',
      description: record.book.description || 'No description available',
      borrower: record.user?.name || '—',
      return_date: record.return_date || null,
      borrowHistory: [],
      isAvailable: true
    }
    if (!bookMap.has(bookId)) {
      bookMap.set(bookId, bookData)
    }
    bookMap.get(bookId).borrowHistory.push({
      user: { name: record.user?.name || 'Unknown' },
      borrow_date: record.borrow_date,
      return_date: record.return_date,
      librarian: { name: record.librarian?.name || 'Unknown' },
      status: record.status || 'unknown'
    })
  })

  const booksArray = Array.from(bookMap.values()).map(book => {
    const latestRecord = book.borrowHistory[book.borrowHistory.length - 1]
    book.isAvailable = !latestRecord || latestRecord.status === 'returned'
    book.borrower = latestRecord ? latestRecord.user.name : '—'
    book.return_date = latestRecord ? latestRecord.return_date : null
    return book
  })

  console.log('Transformed Books:', booksArray)
  return booksArray
}

// Fetch borrowing records
onMounted(async () => {
  try {
    isLoading.value = true
    const response = await getBorrows()
    console.log('API Response:', response.data)
    books.value = transformApiData(response.data)
  } catch (err) {
    error.value = 'Failed to load borrowing data. Please check if the server is running.'
    console.error('Fetch Error:', err.message, err.response?.data)
  } finally {
    isLoading.value = false
  }
})

// Filtered books for search and filters
const filteredBooks = computed(() => {
  let filtered = books.value

  // Apply search query filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(book => book.category === categoryFilter.value)
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(book => 
      statusFilter.value === 'available' ? book.isAvailable : !book.isAvailable
    )
  }

  // Apply user filter
  if (userFilter.value) {
    filtered = filtered.filter(book => book.borrower === userFilter.value)
  }

  return filtered
})

// Stats
const availableBooks = computed(() => filteredBooks.value.filter(book => book.isAvailable).length)
const borrowedBooks = computed(() => filteredBooks.value.filter(book => !book.isAvailable).length)

// Modal controls
const openBookDetails = (book) => {
  selectedBook.value = book
  document.body.style.overflow = 'hidden'
}

const closeBookDetails = () => {
  selectedBook.value = null
  document.body.style.overflow = 'auto'
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Category styling
const getCategoryStyle = (category) => {
  switch (category?.toLowerCase()) {
    case 'history':
      return 'bg-yellow-100 text-yellow-800'
    case 'programming':
      return 'bg-blue-100 text-blue-800'
    case 'fiction':
      return 'bg-purple-100 text-purple-800'
    case 'biography':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Borrow and Return functions
const handleBorrowBook = async (bookId) => {
  try {
    isLoading.value = true
    const response = await borrowBook(bookId, { user: { name: 'Current User', email: 'user@example.com' } })
    console.log('Borrow Response:', response.data)
    const newRecord = response.data
    const bookIndex = books.value.findIndex(book => book.id === bookId)
    if (bookIndex !== -1) {
      const updatedBook = { ...books.value[bookIndex] }
      updatedBook.borrowHistory.push({
        user: { name: newRecord.user?.name || 'Current User' },
        borrow_date: newRecord.borrow_date,
        return_date: newRecord.return_date,
        librarian: { name: newRecord.librarian?.name || 'Unknown' },
        status: newRecord.status || 'borrowed'
      })
      updatedBook.isAvailable = newRecord.status === 'returned'
      updatedBook.borrower = newRecord.user?.name || 'Current User'
      updatedBook.return_date = newRecord.return_date
      books.value[bookIndex] = updatedBook
      if (selectedBook.value?.id === bookId) {
        selectedBook.value = updatedBook
      }
    } else {
      console.warn(`Book with ID ${bookId} not found`)
      error.value = `Book with ID ${bookId} not found`
    }
  } catch (err) {
    error.value = `Failed to borrow book: ${err.message}`
    console.error('Borrow Error:', err.message, err.response?.data)
  } finally {
    isLoading.value = false
  }
}

const handleReturnBook = async (bookId) => {
  try {
    isLoading.value = true
    const response = await returnBook(bookId)
    console.log('Return Response:', response.data)
    const updatedRecord = response.data
    const bookIndex = books.value.findIndex(book => book.id === bookId)
    if (bookIndex !== -1) {
      const updatedBook = { ...books.value[bookIndex] }
      const historyIndex = updatedBook.borrowHistory.findIndex(
        record => record.borrow_date === updatedRecord.borrow_date && !record.return_date
      )
      if (historyIndex !== -1) {
        updatedBook.borrowHistory[historyIndex] = {
          user: { name: updatedRecord.user?.name || 'Current User' },
          borrow_date: updatedRecord.borrow_date,
          return_date: updatedRecord.return_date,
          librarian: { name: updatedRecord.librarian?.name || 'Unknown' },
          status: updatedRecord.status || 'returned'
        }
        updatedBook.isAvailable = updatedRecord.status === 'returned'
        updatedBook.borrower = updatedRecord.user?.name || 'Current User'
        updatedBook.return_date = updatedRecord.return_date
        books.value[bookIndex] = updatedBook
        if (selectedBook.value?.id === bookId) {
          selectedBook.value = updatedBook
        }
      } else {
        console.warn(`Active borrow record for book ID ${bookId} not found`)
        error.value = `No active borrow record found for book ID ${bookId}`
      }
    } else {
      console.warn(`Book with ID ${bookId} not found`)
      error.value = `Book with ID ${bookId} not found`
    }
  } catch (err) {
    error.value = `Failed to return book: ${err.message}`
    console.error('Return Error:', err.message, err.response?.data)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Add animations for cards */
@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid-cols-1 > div {
  animation: card-appear 0.3s ease-out forwards;
  animation-delay: calc(var(--index) * 0.1s);
}

.grid-cols-1 > div:nth-child(1) { --index: 1; }
.grid-cols-1 > div:nth-child(2) { --index: 2; }
.grid-cols-1 > div:nth-child(3) { --index: 3; }

/* Modal animation */
@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.max-w-2xl {
  animation: slide-up 0.3s ease-out;
}
</style>