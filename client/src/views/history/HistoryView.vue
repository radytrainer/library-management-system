<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-gray-900">
          View Borrowing History
        </h1>
        <p class="text-sm text-gray-600 mt-1">
          Click on any book to view details
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg p-4 text-center border">
          <div class="text-2xl font-bold text-gray-900">{{ books.length }}</div>
          <div class="text-sm text-gray-500">Total Books</div>
        </div>
        <div class="bg-white rounded-lg p-4 text-center border">
          <div class="text-2xl font-bold text-green-600">{{ availableBooks }}</div>
          <div class="text-sm text-gray-500">Available</div>
        </div>
        <div class="bg-white rounded-lg p-4 text-center border">
          <div class="text-2xl font-bold text-red-600">{{ borrowedBooks }}</div>
          <div class="text-sm text-gray-500">Currently Borrowed</div>
        </div>
      </div>

      <!-- Book List -->
      <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div class="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div class="col-span-1"></div>
            <div class="col-span-3">Book Details</div>
            <div class="col-span-2">Category</div>
            <div class="col-span-4">Description</div>
            <div class="col-span-2 text-right">Status</div>
          </div>
        </div>

        <!-- Book Rows -->
        <div>
          <div v-for="(book, index) in books" :key="book.id" :class="[
            'transition-all duration-200 cursor-pointer hover:bg-gray-50',
            index !== books.length - 1 ? 'border-b border-gray-100' : ''
          ]" @click="openBookDetails(book)">
            <!-- Main Book Row -->
            <div class="px-6 py-4">
              <div class="grid grid-cols-12 gap-4 items-center">
                <!-- Book Cover -->
                <div class="col-span-1">
                  <div class="w-12 h-16 rounded border overflow-hidden">
                    <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover" />
                  </div>
                </div>

                <!-- Book Details -->
                <div class="col-span-3">
                  <h3 class="font-medium text-gray-900 mb-1 line-clamp-1">{{ book.title }}</h3>
                  <p class="text-xs text-gray-600">by {{ book.author }}</p>
                </div>

                <!-- Category -->
                <div class="col-span-2">
                  <span :class="[
                    'inline-block px-2 py-1 rounded-full text-xs',
                    getCategoryStyle(book.category)
                  ]">
                    {{ book.category }}
                  </span>
                </div>

                <!-- Description -->
                <div class="col-span-4">
                  <p class="text-xs text-gray-700 line-clamp-2">{{ book.description }}</p>
                </div>

                <!-- Status -->
                <div class="col-span-2 text-right">
                  <div class="flex items-center justify-end">
                    <span :class="[
                      'inline-flex items-center px-2 py-1 rounded-full text-xs',
                      book.isAvailable
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    ]">
                      <span :class="[
                        'w-1.5 h-1.5 rounded-full mr-1',
                        book.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      ]"></span>
                      {{ book.isAvailable ? 'Available' : 'Borrowed' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book Details Modal - Simplified and Clean -->
    <div v-if="selectedBook" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
      @click="closeBookDetails">
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full" @click.stop>
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold text-gray-900">Book Details</h2>
          <button @click="closeBookDetails" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Book Cover -->
            <div class="flex-shrink-0">
              <img :src="selectedBook.cover" :alt="selectedBook.title"
                class="w-32 h-44 object-cover rounded border mx-auto md:mx-0" />
              <div class="mt-3 text-center md:text-left">
                <span :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs',
                  selectedBook.isAvailable
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                ]">
                  <span :class="[
                    'w-1.5 h-1.5 rounded-full mr-1',
                    selectedBook.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  ]"></span>
                  {{ selectedBook.isAvailable ? 'Available' : 'Currently Borrowed' }}
                </span>
              </div>
            </div>

            <!-- Book Information -->
            <div class="flex-1">
              <h1 class="text-xl font-bold text-gray-900 mb-1">{{ selectedBook.title }}</h1>
              <p class="text-sm text-gray-600 mb-2">by {{ selectedBook.author }}</p>

              <div class="mb-4">
                <span :class="[
                  'inline-block px-2 py-1 rounded-full text-xs',
                  getCategoryStyle(selectedBook.category)
                ]">
                  {{ selectedBook.category }}
                </span>
              </div>

              <div class="mb-4">
                <h3 class="text-sm font-medium text-gray-900 mb-1">Description</h3>
                <p class="text-sm text-gray-700">{{ selectedBook.description }}</p>
              </div>
            </div>
          </div>

          <!-- Borrowing History -->
          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <History class="w-4 h-4 mr-1 text-gray-500" />
              Borrowing History
            </h3>

            <div v-if="selectedBook.borrowHistory.length > 0" class="border rounded-lg overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Borrower</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Borrowed</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Returned</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(record, index) in selectedBook.borrowHistory" :key="index">
                    <td class="px-3 py-2 text-xs">
                      {{ record.borrower }}
                    </td>
                    <td class="px-3 py-2 text-xs text-gray-600">
                      {{ formatDate(record.borrowedOn) }}
                    </td>
                    <td class="px-3 py-2 text-xs text-gray-600">
                      {{ record.returnedOn ? formatDate(record.returnedOn) : '—' }}
                    </td>
                    <td class="px-3 py-2">
                      <span :class="[
                        'inline-block px-2 py-0.5 rounded-full text-xs',
                        record.returnedOn
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      ]">
                        {{ record.returnedOn ? 'Returned' : 'Not Returned' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="text-center py-4 bg-gray-50 rounded-lg border">
              <p class="text-sm text-gray-500">No borrowing history available</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-3 bg-gray-50 border-t flex justify-end">
          <button v-if="selectedBook.isAvailable"
            class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 mr-2">
            Borrow Book
          </button>
          <button v-else class="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 mr-2">
            Return Book
          </button>
          <button @click="closeBookDetails"
            class="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 text-sm rounded hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { History, X } from 'lucide-vue-next'

const selectedBook = ref(null)

const books = ref([
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C Martin',
    category: 'Programming',
    description: 'A handbook of agile software craftsmanship that teaches developers how to write clean, maintainable code.',
    cover: 'https://euro-libris.ro/site_img/products/400/2013/10/9780132350884.jpg',
    isAvailable: false,
    borrowHistory: [
      {
        borrower: 'Alice Johnson',
        borrowedOn: '2025-07-01',
        returnedOn: '2025-07-10'
      },
      {
        borrower: 'Bob Smith',
        borrowedOn: '2025-07-15',
        returnedOn: null
      }
    ]
  },
  {
    id: 2,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    description: 'A classic American novel about the Jazz Age and the American Dream.',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPhjUyQ760_j4k4sEKfv_7ALMg84oQUpR3eg&s',
    isAvailable: true,
    borrowHistory: [
      {
        borrower: 'John Davis',
        borrowedOn: '2025-06-20',
        returnedOn: '2025-06-30'
      }
    ]
  },
  {
    id: 3,
    title: 'Becoming',
    author: 'Michelle Obama',
    category: 'Biography',
    description: 'A memoir by the former First Lady of the United States.',
    cover: 'https://upload.wikimedia.org/wikipedia/en/0/09/Becoming_%28Michelle_Obama_book%29.jpg',
    isAvailable: true,
    borrowHistory: [
      {
        borrower: 'Emma Wilson',
        borrowedOn: '2025-08-01',
        returnedOn: '2025-08-12'
      }
    ]
  }
])

const availableBooks = computed(() => {
  return books.value.filter(book => book.isAvailable).length
})

const borrowedBooks = computed(() => {
  return books.value.filter(book => !book.isAvailable).length
})

const openBookDetails = (book) => {
  selectedBook.value = book
  document.body.style.overflow = 'hidden'
}

const closeBookDetails = () => {
  selectedBook.value = null
  document.body.style.overflow = 'auto'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getCategoryStyle = (category) => {
  switch (category.toLowerCase()) {
    case 'programming':
      return 'bg-blue-50 text-blue-700'
    case 'fiction':
      return 'bg-purple-50 text-purple-700'
    case 'biography':
      return 'bg-green-50 text-green-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
