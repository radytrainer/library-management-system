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
      <div class="grid grid-cols-2 gap-4">
        <BookCard
          v-for="book in filteredBooks"
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
      <EmptyState v-if="filteredBooks.length === 0" @addBook="handleAddByForm" />
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
      title: "Import Failed",
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
};

const getBookStatus = (quantity) => {
  const qty = Number(quantity);
  if (qty >= 2) return "available";
  if (qty === 1) return "limited";
  return "unavailable"; // fixed from 'available' to 'unavailable'
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
    const status = getBookStatus(book.quantity)
    return status === 'limited' || status === 'Unavailable'
  }).length
);


// **New: Update book in props.books reactively**
function updateBook(updatedBook) {
  // Find index in the books array
  const index = props.books.findIndex((b) => b.id === updatedBook.id);
  if (index !== -1) {
    // This updates the reactive array so UI updates automatically
    props.books.splice(index, 1, updatedBook);
  }
}
</script>
