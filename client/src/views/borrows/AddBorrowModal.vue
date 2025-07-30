<template>
  <div v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 sm:p-6 transition-opacity duration-300"
    @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl sm:max-w-3xl max-h-[90vh] flex flex-col transform scale-95 animate-in sm:scale-100 transition-transform duration-300">
      <div class="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
        <h3 class="text-2xl font-bold text-gray-900">Add Borrow Record</h3>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-200 rounded-full transition-colors" aria-label="Close modal">
          <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Step Indicator -->
      <div class="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div class="flex items-center gap-4 w-full">
          <div class="flex flex-col items-center">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold', currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600']"
              :aria-current="currentStep === 1 ? 'step' : false"> 1
            </div>
            <span class="text-xs text-gray-500 mt-1">Borrower</span>
          </div>
          <div class="flex-1 h-1 bg-gray-200">
            <div class="h-full bg-blue-600 transition-all duration-300" :style="{ width: currentStep >= 2 ? '100%' : '0%' }"></div>
          </div>
          <div class="flex flex-col items-center">
            <div
              :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold', currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600']"
              :aria-current="currentStep === 2 ? 'step' : false"> 2
            </div>
            <span class="text-xs text-gray-500 mt-1">Details</span>
          </div>
          <div class="flex-1 h-1 bg-gray-200">
            <div class="h-full bg-blue-600 transition-all duration-300" :style="{ width: currentStep >= 3 ? '100%' : '0%' }"></div>
          </div>
          <div class="flex flex-col items-center">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold', currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600']"
              :aria-current="currentStep === 3 ? 'step' : false"> 3
            </div>
            <span class="text-xs text-gray-500 mt-1">Books</span>
          </div>
        </div>
      </div>
      <form class="p-6 space-y-6 flex-1 flex flex-col overflow-hidden" novalidate>
        <!-- Step 1: Borrower Information -->
        <div v-if="currentStep === 1" class="bg-gray-50 rounded-lg p-4 animate-step overflow-y-auto">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg> Borrower Information
          </h4>
          <div class="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <label for="borrower-type" class="block text-sm font-medium text-gray-700 mb-2">Borrower Type</label>
              <select id="borrower-type" v-model="localForm.borrowerType" @change="resetBorrowerFields"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                aria-describedby="borrower-type-help">
                <option value="new">New Borrower</option>
                <option value="registered">Registered Borrower</option>
              </select>
              <p id="borrower-type-help" class="mt-1 text-xs text-gray-500">Select whether the borrower is new or registered.</p>
            </div>
            <div v-if="localForm.borrowerType === 'new'" class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label for="user_name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <div class="relative">
                  <input id="user_name" v-model="localForm.user_name" type="text" required @input="validateName"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                    :class="{ 'border-red-500': localForm.nameError, 'border-green-500': !localForm.nameError && localForm.user_name }"
                    placeholder="Enter borrower name" aria-describedby="name-error" />
                  <svg v-if="!localForm.nameError && localForm.user_name"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p v-if="localForm.nameError" id="name-error" class="mt-2 text-sm text-red-600">{{ localForm.nameError }}</p>
              </div>
              <div>
                <label for="email_borrower" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div class="relative">
                  <input id="email_borrower" v-model="localForm.email_borrower" type="email" required
                    @input="validateEmail"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                    :class="{ 'border-red-500': localForm.emailError, 'border-green-500': !localForm.emailError && localForm.email_borrower }"
                    placeholder="Enter borrower email" aria-describedby="email-error" />
                  <svg v-if="!localForm.emailError && localForm.email_borrower"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p v-if="localForm.emailError" id="email-error" class="mt-2 text-sm text-red-600">{{ localForm.emailError }}</p>
              </div>
            </div>
            <div v-if="localForm.borrowerType === 'registered'">
              <label for="user_id" class="block text-sm font-medium text-gray-700 mb-2">User ID/Barcode</label>
              <div class="relative flex items-center gap-3">
                <input id="user_id" v-model="localForm.user_id" type="text" required @input="validateUserId"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                  :class="{ 'border-red-500': localForm.userIdError, 'border-green-500': !localForm.userIdError && localForm.user_id }"
                  placeholder="Scan or enter user ID" aria-describedby="user-id-error" />
                <svg v-if="!localForm.userIdError && localForm.user_id"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <button type="button" @click="simulateUserScan"
                  class="px-4 py-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  aria-label="Simulate user barcode scan">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h3v18H3V3zm5 0h1v18H8V3zm3 0h1v18H11V3zm3 0h1v18H14V3zm3 0h1v18H17V3zm3 0h1v18H20V3z" />
                  </svg> Scan
                </button>
              </div>
              <p v-if="localForm.userIdError" id="user-id-error" class="mt-2 text-sm text-red-600">{{ localForm.userIdError }}</p>
              <p class="mt-1 text-xs text-gray-500">Scan the borrower's ID or enter it manually.</p>
            </div>
          </div>
        </div>
        <!-- Step 2: Librarian and Borrow Date -->
        <div v-if="currentStep === 2" class="bg-gray-50 rounded-lg p-4 animate-step overflow-y-auto">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg> Additional Details
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label for="librarian_name" class="block text-sm font-medium text-gray-700 mb-2">Librarian</label>
              <div class="relative">
                <input id="librarian_name" v-model="localForm.librarian_name" type="text" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                  :class="{ 'border-green-500': localForm.librarian_name }" placeholder="Enter librarian name" />
                <svg v-if="localForm.librarian_name"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <label for="date_borrow" class="block text-sm font-medium text-gray-700 mb-2">Borrow Date</label>
              <div class="relative">
                <input id="date_borrow" v-model="localForm.date_borrow" type="date" required :max="today"
                  @input="validateBorrowDate"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                  :class="{ 'border-red-500': localForm.dateBorrowError, 'border-green-500': !localForm.dateBorrowError && localForm.date_borrow }"
                  aria-describedby="borrow-date-error" />
                <svg v-if="!localForm.dateBorrowError && localForm.date_borrow"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p v-if="localForm.dateBorrowError" id="borrow-date-error" class="mt-2 text-sm text-red-600">{{ localForm.dateBorrowError }}</p>
            </div>
          </div>
        </div>
        <!-- Step 3: Book Selection -->
        <div v-if="currentStep === 3"
          class="bg-gray-50 rounded-lg p-4 animate-step flex-1 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between mb-4 border-b pt-4 border-t border-gray-100">
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Book Selection <span v-if="localForm.books.length > 0" class="text-sm text-gray-500">({{ localForm.books.length }}/3)</span>
            </h4>
            <div v-if="localForm.books.length < 3">
              <button type="button" @click="addBook"
                class="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm"
                aria-label="Add another book">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>Add Book
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto max-h-[300px] scroll-smooth">
            <div v-for="(book, index) in localForm.books" :key="index" class="mb-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label :for="'isbn-' + index" class="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                  <div class="relative flex items-center gap-3">
                    <input :id="'isbn-' + index" v-model="book.isbn" type="text" required @input="validateBook(index)"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                      :class="{ 'border-red-500': book.bookError, 'border-green-500': !book.bookError && book.isbn }"
                      placeholder="Scan or enter ISBN (10 or 13 digits)" :aria-describedby="'isbn-error-' + index" />
                    <svg v-if="!book.bookError && book.isbn"
                      class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <button type="button" @click="simulateBookScan(index)"
                      class="px-4 py-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-2 shrink-0 relative"
                      :aria-label="'Simulate book barcode scan for book ' + (index + 1)" :disabled="loading || showScanner">
                      <svg v-if="!loading" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 3h3v18H3V3zm5 0h1v18H8V3zm3 0h1v18H11V3zm3 0h1v18H14V3zm3 0h1v18H17V3zm3 0h1v18H20V3z" />
                      </svg>
                      <svg v-if="loading" class="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scan
                    </button>
                  </div>
                  <p v-if="book.book_name" class="mt-2 text-sm text-gray-600">Book: {{ book.book_name }}</p>
                  <p v-if="book.bookError" :id="'isbn-error-' + index" class="mt-2 text-sm text-red-600">{{ book.bookError }}</p>
                  <p class="mt-1 text-xs text-gray-500">Scan the book's barcode or enter a 10 or 13-digit ISBN.</p>
                </div>
                <div>
                  <label :for="'return-date-' + index" class="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                  <div class="relative">
                    <input :id="'return-date-' + index" v-model="book.return_date" type="date" required :min="today"
                      @input="validateBook(index)"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                      :class="{ 'border-red-500': book.dateError, 'border-green-500': !book.dateError && book.return_date }"
                      :aria-describedby="'return-date-error-' + index" />
                    <svg v-if="!book.dateError && book.return_date"
                      class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p v-if="book.dateError" :id="'return-date-error-' + index" class="mt-2 text-sm text-red-600">{{ book.dateError }}</p>
                </div>
              </div>
              <div class="mt-4 flex justify-end">
                <button v-if="index > 0" type="button" @click="removeBook(index)"
                  class="text-red-600 hover:text-red-800 text-sm font-medium hover:underline transition-colors"
                  :aria-label="'Remove book ' + (index + 1)">
                  Remove Book
                </button>
              </div>
            </div>
          </div>
          <!-- Barcode Scanner UI -->
          <div v-if="showScanner" class="fixed inset-0 bg-black flex justify-center items-center z-[1000]">
            <div class="relative w-full max-w-md">
              <canvas id="barcode-scanner" class="w-full h-auto"></canvas>
              <button @click="stopScanner"
                class="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                aria-label="Stop scanner">
                Stop Scanner
              </button>
            </div>
          </div>
        </div>
        <!-- Form Error -->
        <div v-if="formError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg" role="alert">{{ formError }}</div>
        <!-- Form Navigation -->
        <div class="flex justify-between gap-4 pt-6 border-t border-gray-100">
          <button v-if="currentStep > 1" type="button" @click="goToPreviousStep"
            class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            aria-label="Go to previous step">
            Previous
          </button>
          <div class="flex gap-4 ml-auto">
            <button type="button" @click="$emit('close')"
              class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              aria-label="Cancel adding borrow record">
              Cancel
            </button>
            <button v-if="currentStep < 3" type="button" @click="goToNextStep"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-sm"
              :disabled="!isStepValid(currentStep)" aria-label="Go to next step">
              Next
            </button>
            <button v-if="currentStep === 3" type="button" @click="submitForm"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="!isStepValid(3)" aria-label="Submit borrow record">
              Add Borrow Record
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, inject, onUnmounted, nextTick } from "vue";
import Quagga from "quagga";

const props = defineProps({
  form: {
    type: Object,
    default: () => ({
      borrowerType: "new",
      user_name: "",
      email_borrower: "", // Changed from borrower_email to match your previous JSON payloads
      user_id: "",
      books: [{ isbn: "", book_name: "", return_date: "" }],
      librarian_name: "",
      date_borrow: "",
      status: "borrowed",
    }),
  },
});

const emit = defineEmits(["submit", "close", "update:form"]);

// Inject necessary functions and data from useBorrowManagement
const { getBook, showToast, fetchBooksData, booksData } = inject("borrowManagement");

// Reactive local form with validation states
const localForm = reactive({
  ...props.form,
  nameError: "",
  emailError: "",
  userIdError: "",
  dateBorrowError: "",
  books: props.form.books.map((book) => ({ ...book, bookError: "", dateError: "" })),
});

const currentStep = ref(1);
const formError = ref("");
const showModal = ref(true);
const today = new Date().toISOString().split("T")[0];
const loading = ref(false);
const showScanner = ref(false);

// Ensure books data is loaded when the modal is opened
watch(showModal, async (newVal) => {
  if (newVal && (!booksData.value || booksData.value.length === 0)) {
    loading.value = true;
    try {
      await fetchBooksData();
      console.log("Books data loaded:", booksData.value);
    } catch (error) {
      console.error("Failed to fetch books data:", error);
      showToast("Failed to load books data.", "error");
    } finally {
      loading.value = false;
    }
  }
});

// Watch for prop changes to update local form
watch(
  () => props.form,
  (newForm) => {
    Object.assign(localForm, newForm, {
      books: newForm.books.map((book) => ({ ...book, bookError: "", dateError: "" })),
    });
  },
  { deep: true }
);

// Emit updates on localForm changes to sync with parent
watch(
  localForm,
  (newVal) => {
    emit("update:form", { ...newVal });
  },
  { deep: true }
);

// Validation functions
function validateName() {
  localForm.nameError = localForm.user_name.trim() ? "" : "Name is required";
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  localForm.emailError = localForm.email_borrower && emailRegex.test(localForm.email_borrower) ? "" : "Valid email is required";
}

function validateUserId() {
  localForm.userIdError = localForm.user_id.trim() ? "" : "User ID/Barcode is required";
}

function validateBorrowDate() {
  const borrowDate = new Date(localForm.date_borrow);
  localForm.dateBorrowError = localForm.date_borrow && borrowDate <= new Date(today) ? "" : "Borrow date cannot be in the future";
}

async function validateBook(index) {
  const book = localForm.books[index];
  console.log(`Validating book at index ${index}: isbn=${book.isbn}`);
  const isbnRegex = /^(?:\d{10}|\d{13})$/;
  if (!book.isbn || !isbnRegex.test(book.isbn)) {
    book.bookError = "Valid 10 or 13-digit ISBN required";
    book.book_name = "";
    return;
  }
  try {
    const foundBook = await getBook(book.isbn, "isbn");
    if (foundBook) {
      book.book_name = foundBook.title;
      book.bookError = "";
      console.log(`Book found for ISBN ${book.isbn}: ${book.book_name}`);
    } else {
      book.book_name = "";
      book.bookError = `Book not found for ISBN: ${book.isbn}`;
      console.log(`Book not found for ISBN: ${book.isbn}`);
    }
  } catch (error) {
    console.error(`Error validating book ISBN ${book.isbn}:`, error);
    book.bookError = "Error retrieving book details";
    book.book_name = "";
  }
  const returnDate = new Date(book.return_date);
  book.dateError = book.return_date && returnDate >= new Date(today) ? "" : "Return date must be today or later";
}

function isStepValid(step) {
  if (step === 1) {
    if (localForm.borrowerType === "new") {
      return !localForm.nameError && localForm.user_name && !localForm.emailError && localForm.email_borrower;
    } else {
      return !localForm.userIdError && localForm.user_id;
    }
  } else if (step === 2) {
    return !localForm.dateBorrowError && localForm.date_borrow && localForm.librarian_name;
  } else if (step === 3) {
    return localForm.books.every((book) => book.isbn && !book.bookError && !book.dateError && book.return_date);
  }
  return false;
}

function resetBorrowerFields() {
  localForm.user_name = "";
  localForm.email_borrower = "";
  localForm.user_id = "";
  localForm.nameError = "";
  localForm.emailError = "";
  localForm.userIdError = "";
}

function goToNextStep() {
  if (isStepValid(currentStep.value)) {
    currentStep.value++;
    formError.value = "";
  } else {
    formError.value = "Please complete all required fields correctly.";
    setTimeout(() => (formError.value = ""), 3000);
  }
}

function goToPreviousStep() {
  currentStep.value--;
  formError.value = "";
}

function addBook() {
  if (localForm.books.length < 3) {
    localForm.books.push({ isbn: "", book_name: "", return_date: "", bookError: "", dateError: "" });
  } else {
    showToast("Cannot add more than 3 books.", "error");
  }
}

function removeBook(index) {
  localForm.books.splice(index, 1);
}

function simulateUserScan() {
  localForm.user_id = "USER123456";
  validateUserId();
  showToast("User barcode scanned successfully.", "success");
}

async function simulateBookScan(index) {
  if (loading.value || showScanner.value) {
    showToast("Please wait, scanning or loading in progress...", "info");
    return;
  }
  if (!booksData.value || booksData.value.length === 0) {
    loading.value = true;
    try {
      await fetchBooksData();
      console.log("Books data after fetch in simulateBookScan:", booksData.value);
    } catch (error) {
      console.error("Failed to fetch books data:", error);
      showToast("Failed to load books data.", "error");
      loading.value = false;
      return;
    }
    loading.value = false;
  }
  if (!booksData.value || booksData.value.length === 0) {
    showToast("No books available in the database.", "error");
    return;
  }
  showScanner.value = true;
  await nextTick(); // Ensure DOM is updated
  const scannerElement = document.querySelector("#barcode-scanner");
  if (!scannerElement) {
    console.error("Barcode scanner element not found");
    showToast("Failed to initialize barcode scanner.", "error");
    showScanner.value = false;
    return;
  }
  try {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: scannerElement,
        constraints: { facingMode: "environment" },
      },
      decoder: { readers: ["ean_reader", "ean_8_reader", "upc_reader"] },
    }, (err) => {
      if (err) {
        console.error("Quagga init error:", err);
        showToast(`Failed to initialize barcode scanner: ${err.message}`, "error");
        showScanner.value = false;
        return;
      }
      Quagga.start();
    });
    Quagga.onDetected(async (data) => {
      const book = localForm.books[index];
      book.isbn = data.codeResult.code;
      console.log(`Scanned ISBN at index ${index}: ${book.isbn}`);
      await validateBook(index);
      stopScanner();
    });
  } catch (error) {
    console.error("Error initializing Quagga:", error);
    showToast("Error starting barcode scanner.", "error");
    showScanner.value = false;
  }
}

function stopScanner() {
  try {
    Quagga.stop();
  } catch (error) {
    console.error("Error stopping Quagga:", error);
  }
  showScanner.value = false;
}

async function submitForm() {
  console.log("Submitting form with data:", JSON.stringify(localForm, null, 2));
  if (!isStepValid(3)) {
    formError.value = "Please complete all required fields correctly.";
    console.error("Form validation failed for Step 3");
    showToast("Please complete all book details.", "error");
    setTimeout(() => (formError.value = ""), 3000);
    return;
  }
  // Ensure unique book ISBNs
  const isbnSet = new Set(localForm.books.map((book) => book.isbn));
  if (isbnSet.size !== localForm.books.length) {
    formError.value = "Each book must have a unique ISBN.";
    console.error("Duplicate ISBNs detected");
    showToast("Each book must have a unique ISBN.", "error");
    setTimeout(() => (formError.value = ""), 3000);
    return;
  }
  try {
    // Prepare submission data
    const submitData = {
      is_new_user: localForm.borrowerType === "new",
      borrower_name: localForm.user_name,
      email_borrower: localForm.email_borrower,
      user_id: localForm.user_id,
      librarian_name: localForm.librarian_name,
      date_borrow: localForm.date_borrow,
      books: localForm.books.map((book) => ({
        isbn: book.isbn,
        book_name: book.book_name,
        return_date: book.return_date,
      })),
      status: localForm.status,
    };
    console.log("Emitting submit event with data:", JSON.stringify(submitData, null, 2));
    emit("submit", submitData);
    showToast("Borrow record submitted successfully.", "success");
    showModal.value = false;
  } catch (error) {
    console.error("Error during form submission:", error);
    formError.value = "Failed to submit borrow record.";
    showToast("Failed to submit borrow record.", "error");
    setTimeout(() => (formError.value = ""), 3000);
  }
}

onUnmounted(() => {
  if (showScanner.value) stopScanner();
});
</script>
