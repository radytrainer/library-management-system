<template>
  <div>
    <BookOverviewStats
      :totalBooks="totalBooks"
      :availableBooks="availableBooks"
      :categories="categories"
      :unavailableBooks="unavailableBooks"
    />

    <div class="px-6 mb-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
        >
          <div>
            <h2 class="text-xl font-semibold text-gray-800">Book Collection</h2>
            <p class="text-gray-500 text-sm mt-1">Manage your library books</p>
          </div>

          <AddBookDropdown
            @openForm="handleAddByForm"
            @addByImport="handleAddByImport"
          />
          <ImportModal
            :visible="showImportModal"
            @close="showImportModal = false"
            @importSuccess="handleImportSuccess"
          />
        </div>

        <BookFilters
          :categories="categories"
          :languages="languages"
          v-model:searchQuery="searchQuery"
          v-model:selectedCategory="selectedCategory"
          v-model:selectedStatus="selectedStatus"
          v-model:selectedLanguage="selectedLanguage"
          @statusChanged="onStatusChange"
        />
      </div>
    </div>

    <div class="px-6 pb-10">
      <div v-if="isLoading" class="text-center py-6">
        <svg class="animate-spin h-8 w-8 text-gray-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500">Loading books...</p>
      </div>

      <div v-else-if="paginatedBooks.length === 0" class="py-6">
        <EmptyState @addBook="handleAddByForm" />
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <BookCard
          v-for="book in paginatedBooks"
          :key="book.id"
          :book="book"
          :openActionMenu="openActionMenu"
          @viewBook="$emit('viewBook', $event)"
          @openForm="$emit('openForm', $event)"
          @deleteBookById="$emit('deleteBookById', $event)"
          @toggleActionMenu="$emit('toggleActionMenu', $event)"
          @bookUpdated="updateBook"
        />
      </div>

      <!-- Pagination Controls -->
      <div v-if="paginatedBooks.length > 0" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing {{ paginationRange.from + 1 }} to {{ Math.min(paginationRange.to, filteredBooks.length) }} of {{ filteredBooks.length }} books
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            Previous
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="setPage(page)"
            :class="[
              'px-3 py-1 rounded-lg',
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            :aria-label="`Page ${page}`"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";

import BookOverviewStats from "./BookCollection/BookOverviewStats.vue";
import AddBookDropdown from "./BookCollection/AddBookDropdown.vue";
import BookFilters from "./BookCollection/BookFilters.vue";
import BookCard from "./BookCollection/BookCard.vue";
import EmptyState from "./BookCollection/EmptyState.vue";
import ImportModal from "./BookCollection/ImportBooksModal.vue";
import { importBooks } from "@/services/Api/book";

const props = defineProps({
  books: { type: Array, default: () => [] },
  openActionMenu: [Number, String, null],
  categories: { type: Array, default: () => [] },
  languages: { type: Array, default: () => [] },
  "fetch-books": { type: Function, default: () => () => {} },
});

const emit = defineEmits([
  "viewBook",
  "openForm",
  "deleteBookById",
  "toggleActionMenu",
]);

const showImportModal = ref(false);
const isLoading = ref(false);
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedStatus = ref("all");
const selectedLanguage = ref("");
const filterType = ref("all");
const currentPage = ref(1);
const itemsPerPage = ref(6);
const siblingCount = ref(2);

const handleAddByForm = () => {
  emit("openForm");
};

const handleAddByImport = () => {
  showImportModal.value = true;
};

const handleImportSuccess = async (formData, callback) => {
  try {
    isLoading.value = true;
    const response = await importBooks(formData);

    if (response.data.success) {
      emit("fetchBooks");
      showImportModal.value = false;
      currentPage.value = 1; // Reset to first page on import

      let successMessage = `Successfully imported ${response.data.importedCount} book(s).`;
      let errorsHtml = "";

      if (response.data.errors?.length) {
        successMessage += `\n\n${response.data.errors.length} error(s) occurred:`;
        errorsHtml = `
          <details class="mt-2">
            <summary class="text-sm text-gray-600 cursor-pointer">Show errors</summary>
            <ul class="text-xs text-red-500 mt-1 space-y-1">
              ${response.data.errors
                .map((err) => {
                  if (typeof err === "object") {
                    return `<li><strong>Row ${err.row}:</strong> ${err.error}</li>`;
                  }
                  return `<li>${err}</li>`;
                })
                .join("")}
            </ul>
          </details>
        `;
      }

      await Swal.fire({
        title: "Import Complete",
        html: `
          <div class="text-left">
            <p>${successMessage}</p>
            ${errorsHtml}
          </div>
        `,
        icon: response.data.importedCount > 1 ? "success" : "warning",
        confirmButtonText: "OK",
        customClass: {
          popup: "!text-left",
          htmlContainer: "!text-left",
        },
      });

      return {
        success: true,
        importedCount: response.data.importedCount,
        errors: response.data.errors || [],
      };
    } else {
      throw new Error(response.data.message || "Import failed without error details");
    }
  } catch (error) {
    console.error("Import error:", error);
    await Swal.fire({
      icon: "error",
      title: "Import Failed", // Fixed: Added colon
      text: error.response?.data?.message || error.message,
      footer: "Please check the Excel file format and try again",
      confirmButtonText: "OK",
    });

    return {
      success: false,
      error: error.response?.data?.message || error.message,
      errors: error.response?.data?.errors || [],
    };
  } finally {
    isLoading.value = false;
    if (typeof callback === "function") {
      callback();
    }
  }
};

const onStatusChange = () => {
  filterType.value = selectedStatus.value;
  currentPage.value = 1;
};

const getBookStatus = (quantity) => {
  const qty = Number(quantity);
  if (qty >= 2) return "available";
  if (qty === 1) return "limited";
  return "unavailable";
};

const filteredBooks = computed(() => {
  let filtered = props.books;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title?.toLowerCase().includes(q) ||
        book.author?.name?.toLowerCase().includes(q) ||
        book.isbn?.toLowerCase().includes(q)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (book) =>
        book.category?.name.toLowerCase() === selectedCategory.value.toLowerCase()
    );
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter(
      (book) =>
        book.language?.name.toLowerCase() === selectedLanguage.value.toLowerCase()
    );
  }

  switch (filterType.value) {
    case "new":
      return [...filtered]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
    case "available":
      return filtered.filter((book) => getBookStatus(book.quantity) === "available");
    case "limited":
      return filtered.filter((book) => getBookStatus(book.quantity) === "limited");
    default:
      return filtered;
  }
});

const totalBooks = computed(() => props.books.length);
const availableBooks = computed(() =>
  props.books.filter((book) => getBookStatus(book.quantity) === "available").length
);
const unavailableBooks = computed(() =>
  props.books.filter((book) => {
    const status = getBookStatus(book.quantity);
    return status === "limited" || status === "unavailable";
  }).length
);

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage.value));

const paginationRange = computed(() => {
  const from = (currentPage.value - 1) * itemsPerPage.value;
  const to = from + itemsPerPage.value;
  return { from, to };
});

const paginatedBooks = computed(() => {
  return filteredBooks.value.slice(paginationRange.value.from, paginationRange.value.to);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - siblingCount.value);
  const end = Math.min(totalPages.value, currentPage.value + siblingCount.value);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

function updateBook(updatedBook) {
  const index = props.books.findIndex((b) => b.id === updatedBook.id);
  if (index !== -1) {
    props.books.splice(index, 1, updatedBook);
  }
}
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>