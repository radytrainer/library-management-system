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
    <div
      class="mb-4 sm:mb-6 lg:mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-4"
    >
      <div class="relative flex-1">
        <div
          class="absolute inset-y-0 left-0 pl-2 sm:pl-3 lg:pl-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-4 sm:h-5 lg:h-5 w-4 sm:w-5 lg:w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
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
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <select
          v-model="userFilter"
          class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[100px] sm:min-w-[120px]"
        >
          <option value="">All Borrowers</option>
          <option v-for="borrower in borrowers" :key="borrower" :value="borrower">
            {{ borrower }}
          </option>
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

    <!-- Toast Notification for Success/Error -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <div
        v-if="message"
        :class="[
          'fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-xl shadow-2xl border-l-4 p-6',
          messageType === 'success'
            ? 'bg-green-50 border-green-500 text-green-800'
            : 'bg-red-50 border-red-500 text-red-800',
        ]"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <svg
              v-if="messageType === 'success'"
              class="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold">
              {{ messageType === "success" ? "Success" : "Error" }}
            </p>
            <p class="text-sm mt-1">{{ message }}</p>
          </div>
          <button
            @click="clearMessage"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center text-gray-600 py-6 sm:py-8 lg:py-8">
      <div
        class="animate-spin rounded-full h-6 sm:h-8 lg:h-8 w-6 sm:w-8 lg:w-8 border-t-2 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-1 sm:mt-2 lg:mt-2 text-sm sm:text-base lg:text-base">
        Loading books...
      </p>
    </div>

    <!-- Book List -->
    <div
      v-if="!isLoading && paginatedBooks.length"
      class="bg-white rounded-xl border shadow-sm overflow-hidden"
    >
      <div
        class="bg-gray-50 px-3 sm:px-6 lg:px-6 py-3 sm:py-4 lg:py-4 border-b border-gray-200"
      >
        <div
          class="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-4 text-xs sm:text-sm lg:text-sm font-semibold text-gray-700"
        >
          <div class="col-span-2 sm:col-span-1 lg:col-span-1"></div>
          <div class="col-span-4 sm:col-span-3 lg:col-span-3">Book</div>
          <div class="col-span-3 sm:col-span-2 lg:col-span-2 hidden sm:block">
            Borrower
          </div>
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
            index !== paginatedBooks.length - 1 ? 'border-b border-gray-100' : '',
          ]"
          @click="openBookDetails(book)"
        >
          <div class="px-3 sm:px-6 lg:px-6 py-3 sm:py-4 lg:py-4">
            <div class="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-4 items-center">
              <div class="col-span-2 sm:col-span-1 lg:col-span-1">
                <div
                  class="w-10 sm:w-12 lg:w-12 h-14 sm:h-16 lg:h-16 rounded-lg border overflow-hidden shadow-sm"
                >
                  <img
                    :src="book.book_image"
                    :alt="book.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div class="col-span-4 sm:col-span-3 lg:col-span-3">
                <h3
                  class="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm sm:text-base lg:text-base"
                >
                  {{ book.title }}
                </h3>
                <p class="text-xs sm:text-sm lg:text-sm text-gray-600">
                  by {{ book.author }}
                </p>
              </div>
              <div class="col-span-3 sm:col-span-2 lg:col-span-2 hidden sm:block">
                <p class="text-xs sm:text-sm lg:text-sm text-gray-700">
                  {{ book.borrower || "—" }}
                </p>
              </div>
              <div class="col-span-3 sm:col-span-2 lg:col-span-2">
                <span
                  :class="[
                    'inline-block px-2 sm:px-3 lg:px-3 py-1 rounded-full text-xs font-medium',
                    getCategoryStyle(book.category),
                  ]"
                >
                  {{ book.category }}
                </span>
              </div>
              <div class="col-span-3 sm:col-span-2 lg:col-span-2">
                <p class="text-xs sm:text-sm lg:text-sm text-gray-700">
                  {{ formatDate(book.return_date) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading && !paginatedBooks.length"
      class="text-center py-6 sm:py-8 lg:py-8 bg-white rounded-xl border shadow-sm"
    >
      <p class="text-sm sm:text-base lg:text-base text-gray-500">
        No books found matching your filters
      </p>
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
        <div
          class="flex items-center justify-between p-4 sm:p-6 lg:p-6 border-b border-gray-200"
        >
          <h2 class="text-lg sm:text-xl lg:text-xl font-semibold text-gray-900">
            Book Details
          </h2>
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
                    selectedBook.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  <span
                    :class="[
                      'w-2 h-2 rounded-full mr-1.5',
                      selectedBook.isAvailable ? 'bg-green-500' : 'bg-red-500',
                    ]"
                  ></span>
                  {{ selectedBook.isAvailable ? "Available" : "Currently Borrowed" }}
                </span>
              </div>
            </div>
            <div class="flex-1">
              <h1 class="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-2">
                {{ selectedBook.title }}
              </h1>
              <p class="text-sm sm:text-base lg:text-base text-gray-600 mb-3">
                {{ selectedBook.author }}
              </p>
              <div class="mb-4">
                <span
                  :class="[
                    'inline-block px-2 sm:px-3 lg:px-3 py-1 rounded-full text-xs sm:text-sm lg:text-sm font-medium',
                    getCategoryStyle(selectedBook.category),
                  ]"
                >
                  {{ selectedBook.category }}
                </span>
              </div>
              <div class="mb-4 sm:mb-6 lg:mb-6">
                <h3
                  class="text-sm sm:text-base lg:text-base font-semibold text-gray-900 mb-2"
                >
                  Description
                </h3>
                <p class="text-xs sm:text-sm lg:text-sm text-gray-700 leading-relaxed">
                  {{ selectedBook.description || "No description available" }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-4 sm:mt-6 lg:mt-6">
            <div class="flex items-center justify-between mb-3">
              <h3
                class="text-sm sm:text-base lg:text-base font-semibold text-gray-900 flex items-center"
              >
                <History class="w-4 sm:w-5 lg:w-5 h-4 sm:h-5 lg:h-5 mr-2 text-gray-500" />
                Borrowing History
              </h3>
              <button
                v-if="selectedBook.borrowHistory.length > 0"
                @click="showDeleteAllModal = true"
                class="inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-150"
              >
                Delete All History
              </button>
            </div>
            <div
              v-if="
                selectedBook.borrowHistory.filter(
                  (record) => record.status === 'returned'
                ).length > 0
              "
              class="border rounded-lg overflow-x-auto shadow-sm"
            >
              <table class="w-full text-xs sm:text-sm lg:text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600"
                    >
                      Borrower
                    </th>
                    <th
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600"
                    >
                      Borrowed
                    </th>
                    <th
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600"
                    >
                      Returned
                    </th>
                    <th
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600 hidden sm:table-cell"
                    >
                      Librarian
                    </th>
                    <th
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600"
                    >
                      Status
                    </th>
                    <th
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-left text-xs font-semibold text-gray-600"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(record, index) in selectedBook.borrowHistory.filter(
                      (record) => record.status === 'returned'
                    )"
                    :key="index"
                    class="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-xs sm:text-sm lg:text-sm"
                    >
                      {{ record.user.name }}
                    </td>
                    <td
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-xs sm:text-sm lg:text-sm text-gray-600"
                    >
                      {{ formatDate(record.borrow_date) }}
                    </td>
                    <td
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-xs sm:text-sm lg:text-sm text-gray-600"
                    >
                      {{ formatDate(record.return_date) }}
                    </td>
                    <td
                      class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 text-xs sm:text-sm lg:text-sm hidden sm:table-cell"
                    >
                      {{ record.librarian.name }}
                    </td>
                    <td class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3">
                      <span
                        class="inline-block px-2 sm:px-3 lg:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        Returned
                      </span>
                    </td>
                    <td class="px-3 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3">
                      <button
                        @click="openDeleteModal(record, selectedBook.id)"
                        class="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-150"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-else
              class="text-center py-4 sm:py-6 lg:py-6 bg-gray-50 rounded-lg border"
            >
              <p class="text-xs sm:text-sm lg:text-sm text-gray-500">
                No returned borrowing history available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal for Single Record -->
    <ConfirmDeleteModal
      v-if="showDeleteModal"
      @confirm="confirmDeleteRecord"
      @close="closeDeleteModal"
    />

    <!-- Confirm Delete Modal for All Records -->
    <ConfirmDeleteModal
      v-if="showDeleteAllModal"
      :isAllRecords="true"
      @confirm="confirmDeleteAllRecords"
      @close="showDeleteAllModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { History, X } from "lucide-vue-next";
import { getBorrows, deleteBorrow } from "@/services/Api/borrow";
import ConfirmDeleteModal from "./ConfirmDeleteModal.vue";

const books = ref([]);
const selectedBook = ref(null);
const isLoading = ref(false);
const message = ref(null);
const messageType = ref(null);
const searchQuery = ref("");
const categoryFilter = ref("");
const userFilter = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);
const showDeleteModal = ref(false);
const showDeleteAllModal = ref(false);
const pendingDeleteRecord = ref(null);
const pendingDeleteBookId = ref(null);

const paginatedBooks = computed(() => {
  if (itemsPerPage.value === 0) return filteredBooks.value;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBooks.value.slice(start, end);
});

// Available categories (derived dynamically from data)
const categories = computed(() => {
  const uniqueCategories = new Set(
    books.value.map((book) => book.category).filter((category) => category)
  );
  return [...uniqueCategories].sort();
});

// Available borrowers (derived from data)
const borrowers = computed(() => {
  const uniqueBorrowers = new Set(
    books.value.map((book) => book.borrower).filter((borrower) => borrower !== "—")
  );
  return [...uniqueBorrowers].sort();
});

// Transform API data into book-centric structure
const transformApiData = (apiData) => {
  if (!Array.isArray(apiData)) {
    console.error("Invalid API data: Expected an array, got:", apiData);
    return [];
  }

  const bookMap = new Map();
  apiData.forEach((record) => {
    const bookId =
      record.book?.id ||
      record.id ||
      "unknown-" + Math.random().toString(36).substr(2, 9);
    const bookData = {
      id: bookId,
      title: record.book?.title || "Unknown Title",
      author: record.book?.author || "Unknown Author",
      category: record.book?.category || "Uncategorized",
      book_image: record.book?.cover_image || "https://via.placeholder.com/150",
      description: record.book?.description || "No description available",
      borrower: record.user?.name || "—",
      return_date: record.return_date || null,
      borrowHistory: [],
      isAvailable: true,
    };
    if (!bookMap.has(bookId)) {
      bookMap.set(bookId, bookData);
    }
    bookMap.get(bookId).borrowHistory.push({
      id: record.id, // Store record ID for deletion
      user: { name: record.user?.name || "Unknown" },
      borrow_date: record.borrow_date || null,
      return_date: record.return_date || null,
      librarian: { name: record.librarian?.name || "Unknown" },
      status: record.status || "unknown",
    });
  });

  const booksArray = Array.from(bookMap.values()).map((book) => {
    const latestRecord = book.borrowHistory[book.borrowHistory.length - 1];
    book.isAvailable = !latestRecord || latestRecord.status === "returned";
    book.borrower = latestRecord ? latestRecord.user.name : "—";
    book.return_date = latestRecord ? latestRecord.return_date : null;
    return book;
  });

  console.log("Transformed Books:", booksArray);
  return booksArray;
};

// Fetch borrowing records
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await getBorrows();
    console.log("API Response:", response.data);
    books.value = transformApiData(response.data);
    console.log("Books Loaded:", books.value.length);
    console.log("Filtered Books:", filteredBooks.value.length);
  } catch (err) {
    message.value =
      "Failed to load borrowing data. Please check if the server is running.";
    messageType.value = "error";
    books.value = transformApiData(mockData);
  } finally {
    isLoading.value = false;
  }
});

// Filtered books for search, filters, and only returned
const filteredBooks = computed(() => {
  let filtered = books.value;

  // Only include books with the latest record returned
  filtered = filtered.filter((book) => {
    const latestRecord = book.borrowHistory[book.borrowHistory.length - 1];
    return latestRecord && latestRecord.status === "returned";
  });

  // Apply search query filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (categoryFilter.value) {
    filtered = filtered.filter((book) => book.category === categoryFilter.value);
  }

  // Apply user filter
  if (userFilter.value) {
    filtered = filtered.filter((book) => book.borrower === userFilter.value);
  }

  return filtered;
});

// Clear filters
const clearFilters = () => {
  searchQuery.value = "";
  categoryFilter.value = "";
  userFilter.value = "";
  console.log("Filters cleared");
};

// Clear message
const clearMessage = () => {
  message.value = null;
  messageType.value = null;
};

// Modal controls
const openBookDetails = (book) => {
  selectedBook.value = book;
  document.body.style.overflow = "hidden";
};

const closeBookDetails = () => {
  selectedBook.value = null;
  document.body.style.overflow = "auto";
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Open delete confirmation modal for single record
const openDeleteModal = (record, bookId) => {
  pendingDeleteRecord.value = record;
  pendingDeleteBookId.value = bookId;
  showDeleteModal.value = true;
};

// Close delete confirmation modal
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  pendingDeleteRecord.value = null;
  pendingDeleteBookId.value = null;
};

// Confirm delete single borrowing record
const confirmDeleteRecord = async () => {
  try {
    isLoading.value = true;
    message.value = null;
    messageType.value = null;
    await deleteBorrow(pendingDeleteRecord.value.id);
    message.value = "Borrowing record deleted successfully.";
    messageType.value = "success";

    // Update books state by removing the deleted record
    books.value = books.value.map((book) => {
      if (book.id === pendingDeleteBookId.value) {
        book.borrowHistory = book.borrowHistory.filter(
          (r) => r.id !== pendingDeleteRecord.value.id
        );
        const latestRecord = book.borrowHistory[book.borrowHistory.length - 1];
        book.isAvailable = !latestRecord || latestRecord.status === "returned";
        book.borrower = latestRecord ? latestRecord.user.name : "—";
        book.return_date = latestRecord ? latestRecord.return_date : null;
      }
      return book;
    });

    // If the deleted record was the only one, close the modal
    if (selectedBook.value && selectedBook.value.borrowHistory.length === 0) {
      closeBookDetails();
    }
  } catch (err) {
    message.value = "Failed to delete borrowing record. Please try again.";
    messageType.value = "error";
  } finally {
    isLoading.value = false;
    closeDeleteModal();
  }
};

// Confirm delete all borrowing records
const confirmDeleteAllRecords = async () => {
  try {
    isLoading.value = true;
    message.value = null;
    messageType.value = null;

    // Get all record IDs for the selected book
    const recordIds = selectedBook.value.borrowHistory.map((record) => record.id);

    // Delete each record
    await Promise.all(recordIds.map((id) => deleteBorrow(id)));

    message.value = "All borrowing history deleted successfully.";
    messageType.value = "success";

    // Update books state by removing all borrow history for the book
    books.value = books.value.map((book) => {
      if (book.id === selectedBook.value.id) {
        book.borrowHistory = [];
        book.isAvailable = true;
        book.borrower = "—";
        book.return_date = null;
      }
      return book;
    });

    // Close the modal as the borrowing history is now empty
    closeBookDetails();
  } catch (err) {
    message.value = "Failed to delete borrowing history. Please try again.";
    messageType.value = "error";
  } finally {
    isLoading.value = false;
    showDeleteAllModal.value = false;
  }
};

const predefinedColors = [
  "bg-yellow-100 text-yellow-800",
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-green-100 text-green-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-gray-100 text-gray-800",
];

const categoryColors = {};

// Assign colors to categories
const assignCategoryColors = () => {
  const uniqueCategories = [
    ...new Set(books.value.map((b) => b.category).filter(Boolean)),
  ];
  uniqueCategories.forEach((cat, index) => {
    categoryColors[cat.toLowerCase()] = predefinedColors[index % predefinedColors.length];
  });
};

// Updated getCategoryStyle
const getCategoryStyle = (category) => {
  if (!category) return "bg-gray-100 text-gray-800";
  return categoryColors[category.toLowerCase()] || "bg-gray-100 text-gray-800";
};

// After fetching books
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await getBorrows();
    books.value = transformApiData(response.data);
    assignCategoryColors();
  } catch (err) {
    message.value = "Failed to load borrowing data.";
    messageType.value = "error";
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
