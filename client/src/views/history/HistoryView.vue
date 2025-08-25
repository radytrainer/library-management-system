<template>
  <div class="max-w-8xl mx-auto p-2 sm:p-4 lg:p-4">
    <!-- Header -->
    <div class="mb-6 sm:mb-8 lg:mb-8">
      <h1 class="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 tracking-tight">
        Borrowing History
      </h1>
      <p class="text-sm sm:text-base lg:text-base text-gray-600 mt-1 sm:mt-2 lg:mt-2">
        Browse and manage your library's borrowing records
      </p>
    </div>

    <!-- Search and Filter Bar -->
    <div class="mb-4 sm:mb-6 lg:mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-4">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-2 sm:pl-3 lg:pl-3 flex items-center pointer-events-none">
          <svg class="h-4 sm:h-5 lg:h-5 w-4 sm:w-5 lg:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title or author..."
          class="w-full pl-8 sm:pl-10 lg:pl-10 pr-3 sm:pr-4 lg:pr-4 py-2 sm:py-3 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white shadow-sm text-xs sm:text-sm lg:text-sm"
        />
      </div>
      <div class="flex flex-wrap gap-2 sm:gap-4 lg:gap-4">
        <select
          v-model="categoryFilter"
          class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[100px] sm:min-w-[120px]"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
        <select
          v-model="userFilter"
          class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[100px] sm:min-w-[120px]"
        >
          <option value="">All Borrowers</option>
          <option v-for="borrower in borrowers" :key="borrower" :value="borrower">{{ borrower }}</option>
        </select>
        <select
          v-model="itemsPerPage"
          class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[80px]"
        >
          <option :value="0">All</option>
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 sm:mb-6 lg:mb-6 p-3 sm:p-4 lg:p-4 bg-red-50 text-red-700 rounded-lg text-xs sm:text-sm lg:text-sm shadow-sm">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center text-gray-600 py-6 sm:py-8 lg:py-8">
      <div class="animate-spin rounded-full h-6 sm:h-8 lg:h-8 w-6 sm:w-8 lg:w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-1 sm:mt-2 lg:mt-2 text-sm sm:text-base lg:text-base">Loading books...</p>
    </div>

    <!-- Book List -->
    <div v-if="!isLoading && paginatedBooks.length" class="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div class="bg-gray-50 px-3 sm:px-6 lg:px-6 py-3 sm:py-4 lg:py-4 border-b border-gray-200">
        <div class="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-4 text-xs sm:text-sm lg:text-sm font-semibold text-gray-700">
          <div class="col-span-2 sm:col-span-1 lg:col-span-1"></div>
          <div class="col-span-4 sm:col-span-3 lg:col-span-3">Book</div>
          <div class="col-span-3 sm:col-span-2 lg:col-span-2 hidden sm:block">Borrower</div>
          <div class="col-span-3 sm:col-span-2 lg:col-span-2">Category</div>
          <div class="col-span-3 sm:col-span-2 lg:col-span-2">Return Date</div>
        </div>
      </div>
      <div>
        <div
          v-for="(book, index) in paginatedBooks"
          :key="book.id"
          :class="[
            'transition-all duration-200 cursor-pointer hover:bg-gray-50',
            index !== paginatedBooks.length - 1 ? 'border-b border-gray-100' : ''
          ]"
          @click="openBookDetails(book)"
        >
          <div class="px-3 sm:px-6 lg:px-6 py-3 sm:py-4 lg:py-4">
            <div class="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-4 items-center">
              <div class="col-span-2 sm:col-span-1 lg:col-span-1">
                <div class="w-10 sm:w-12 lg:w-12 h-14 sm:h-16 lg:h-16 rounded-lg border overflow-hidden shadow-sm">
                  <img
                    :src="book.book_image"
                    :alt="book.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div class="col-span-4 sm:col-span-3 lg:col-span-3">
                <h3 class="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm sm:text-base lg:text-base">{{ book.title }}</h3>
                <p class="text-xs sm:text-sm lg:text-sm text-gray-600">by {{ book.author }}</p>
              </div>
              <div class="col-span-3 sm:col-span-2 lg:col-span-2 hidden sm:block">
                <p class="text-xs sm:text-sm lg:text-sm text-gray-700">{{ book.borrower || '—' }}</p>
              </div>
              <div class="col-span-3 sm:col-span-2 lg:col-span-2">
                <span 
                  :class="[
                    'inline-block px-2 sm:px-3 lg:px-3 py-1 rounded-full text-xs font-medium',
                    getCategoryStyle(book.category)
                  ]"
                >
                  {{ book.category }}
                </span>
              </div>
              <div class="col-span-3 sm:col-span-2 lg:col-span-2">
                <p class="text-xs sm:text-sm lg:text-sm text-gray-700">{{ formatDate(book.return_date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && !paginatedBooks.length" class="text-center py-6 sm:py-8 lg:py-8 bg-white rounded-xl border shadow-sm">
      <p class="text-sm sm:text-base lg:text-base text-gray-500">No books found matching your filters</p>
    </div>

    <!-- Book Details Modal -->
    <div
      v-if="selectedBook"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 lg:p-4 z-50 transition-opacity duration-300"
      @click="closeBookDetails"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300"
        @click.stop
      >
        <div class="flex items-center justify-between p-4 sm:p-6 lg:p-6 border-b border-gray-200">
          <h2 class="text-lg sm:text-xl lg:text-xl font-semibold text-gray-900">Book Details</h2>
          <button
            @click="closeBookDetails"
            class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X class="w-5 sm:w-6 lg:w-6 h-5 sm:h-6 lg:h-6" />
          </button>
        </div>
        <div class="p-4 sm:p-6 lg:p-6">
          <div class="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-6">
            <div class="flex-shrink-0">
              <img
                :src="selectedBook.book_image"
                :alt="selectedBook.title"
                class="w-28 sm:w-40 lg:w-40 h-40 sm:h-56 lg:h-56 object-cover rounded-lg border shadow-sm mx-auto md:mx-0"
                loading="lazy"
              />
              <div class="mt-3 sm:mt-4 lg:mt-4 text-center md:text-left">
                <span
                  :class="[
                    'inline-flex items-center px-2 sm:px-3 lg:px-3 py-1 rounded-full text-xs sm:text-sm lg:text-sm font-medium',
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
              <h1 class="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-2">{{ selectedBook.title }}</h1>
              <p class="text-sm sm:text-base lg:text-base text-gray-600 mb-3">{{ selectedBook.author }}</p>
              <div class="mb-4">
                <span 
                  :class="[
                    'inline-block px-2 sm:px-3 lg:px-3 py-1 rounded-full text-xs sm:text-sm lg:text-sm font-medium',
                    getCategoryStyle(selectedBook.category)
                  ]"
                >
                  {{ selectedBook.category }}
                </span>
              </div>
              <div class="mb-4 sm:mb-6 lg:mb-6">
                <h3 class="text-sm sm:text-base lg:text-base font-semibold text-gray-900 mb-2">Description</h3>
                <p class="text-xs sm:text-sm lg:text-sm text-gray-700 leading-relaxed">{{ selectedBook.description || 'No description available' }}</p>
              </div>
            </div>
          </div>
          <div class="mt-4 sm:mt-6 lg:mt-6">
            <h3 class="text-sm sm:text-base lg:text-base font-semibold text-gray-900 mb-3 flex items-center">
              <History class="w-4 sm:w-5 lg:w-5 h-4 sm:h-5 lg:h-5 mr-2 text-gray-500" />
              Borrowing History
            </h3>
            <div v-if="selectedBook.borrowHistory.filter(record => record.status === 'returned').length > 0" class="border rounded-lg overflow-x-auto shadow-sm">
              <table class="w-full text-xs sm:text-sm lg:text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600">Borrower</th>
                    <th class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600">Borrowed</th>
                    <th class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600">Returned</th>
                    <th class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600 hidden sm:table-cell">Librarian</th>
                    <th class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(record, index) in selectedBook.borrowHistory.filter(record => record.status === 'returned')"
                    :key="index"
                    class="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-xs sm:text-sm lg:text-sm">{{ record.user.name }}</td>
                    <td class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-xs sm:text-sm lg:text-sm text-gray-600">{{ formatDate(record.borrow_date) }}</td>
                    <td class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-xs sm:text-sm lg:text-sm text-gray-600">{{ formatDate(record.return_date) }}</td>
                    <td class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-xs sm:text-sm lg:text-sm hidden sm:table-cell">{{ record.librarian.name }}</td>
                    <td class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3">
                      <span class="inline-block px-2 sm:px-3 lg:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Returned
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-4 sm:py-6 lg:py-6 bg-gray-50 rounded-lg border">
              <p class="text-xs sm:text-sm lg:text-sm text-gray-500">No returned borrowing history available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { History, X } from 'lucide-vue-next';
import { getBorrows } from '@/services/Api/borrow';
import { getCategories } from '@/services/Api/book';
import { exportTableToPdf } from '@/utils/exportPDFHistory';

const books = ref([]);
const selectedBook = ref(null);
const isLoading = ref(false);
const error = ref(null);
const successMessage = ref(null);
const searchQuery = ref('');
const categoryFilter = ref('');
const userFilter = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

const paginatedBooks = computed(() => {
  if (itemsPerPage.value === 0) return filteredBooks.value;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBooks.value.slice(start, end);
});

// Available categories (derived dynamically from data)
const categories = computed(() => {
  const uniqueCategories = new Set(books.value.map(book => book.category).filter(category => category));
  return [...uniqueCategories].sort();
});

// Available borrowers (derived from data)
const borrowers = computed(() => {
  const uniqueBorrowers = new Set(books.value.map(book => book.borrower).filter(borrower => borrower !== '—'));
  return [...uniqueBorrowers].sort();
});

// Transform API data into book-centric structure
const transformApiData = (apiData) => {
  if (!Array.isArray(apiData)) {
    console.error('Invalid API data: Expected an array, got:', apiData);
    return [];
  }

  const bookMap = new Map();
  apiData.forEach(record => {
    const bookId = record.book?.id || record.id || 'unknown-' + Math.random().toString(36).substr(2, 9);
    const bookData = {
      id: bookId,
      title: record.book?.title || 'Unknown Title',
      author: record.book?.author || 'Unknown Author',
      category: record.book?.category || 'Uncategorized',
      book_image: record.book?.cover_image || 'https://via.placeholder.com/150',
      description: record.book?.description || 'No description available',
      borrower: record.user?.name || '—',
      return_date: record.return_date || null,
      borrowHistory: [],
      isAvailable: true,
    };
    if (!bookMap.has(bookId)) {
      bookMap.set(bookId, bookData);
    }
    bookMap.get(bookId).borrowHistory.push({
      user: { name: record.user?.name || 'Unknown' },
      borrow_date: record.borrow_date || null,
      return_date: record.return_date || null,
      librarian: { name: record.librarian?.name || 'Unknown' },
      status: record.status || 'unknown',
    });
  });

  const booksArray = Array.from(bookMap.values()).map(book => {
    const latestRecord = book.borrowHistory[book.borrowHistory.length - 1];
    book.isAvailable = !latestRecord || latestRecord.status === 'returned';
    book.borrower = latestRecord ? latestRecord.user.name : '—';
    book.return_date = latestRecord ? latestRecord.return_date : null;
    return book;
  });

  console.log('Transformed Books:', booksArray);
  return booksArray;
};

// Fetch borrowing records
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await getBorrows();
    console.log('API Response:', response.data);
    books.value = transformApiData(response.data);
    console.log('Books Loaded:', books.value.length);
    console.log('Filtered Books:', filteredBooks.value.length);
  } catch (err) {
    error.value = 'Failed to load borrowing data. Please check if the server is running.';
    books.value = transformApiData(mockData);
  } finally {
    isLoading.value = false;
  }
});

// Filtered books for search, filters, and only returned
const filteredBooks = computed(() => {
  let filtered = books.value;

  // Only include books with the latest record returned
  filtered = filtered.filter(book => {
    const latestRecord = book.borrowHistory[book.borrowHistory.length - 1];
    return latestRecord && latestRecord.status === 'returned';
  });

  // Apply search query filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(book => book.category === categoryFilter.value);
  }

  // Apply user filter
  if (userFilter.value) {
    filtered = filtered.filter(book => book.borrower === userFilter.value);
  }

  return filtered;
});

// Clear filters
const clearFilters = () => {
  searchQuery.value = '';
  categoryFilter.value = '';
  userFilter.value = '';
  console.log('Filters cleared');
};

// Modal controls
const openBookDetails = (book) => {
  selectedBook.value = book;
  document.body.style.overflow = 'hidden';
};

const closeBookDetails = () => {
  selectedBook.value = null;
  document.body.style.overflow = 'auto';
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const predefinedColors = [
  'bg-yellow-100 text-yellow-800',
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-100 text-gray-800',
];

const categoryColors = {};

// Assign colors to categories
const assignCategoryColors = () => {
  const uniqueCategories = [...new Set(books.value.map(b => b.category).filter(Boolean))];
  uniqueCategories.forEach((cat, index) => {
    categoryColors[cat.toLowerCase()] = predefinedColors[index % predefinedColors.length];
  });
};

// Updated getCategoryStyle
const getCategoryStyle = (category) => {
  if (!category) return 'bg-gray-100 text-gray-800';
  return categoryColors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// After fetching books
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await getBorrows();
    books.value = transformApiData(response.data);
    assignCategoryColors();
  } catch (err) {
    error.value = 'Failed to load borrowing data.';
    books.value = transformApiData(mockData);
    assignCategoryColors();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Ensure table scrolling is smooth */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

/* Adjust modal for very small screens */
@media (max-width: 400px) {
  .text-xs {
    font-size: 0.65rem;
  }
  .text-sm {
    font-size: 0.75rem;
  }
}
</style>