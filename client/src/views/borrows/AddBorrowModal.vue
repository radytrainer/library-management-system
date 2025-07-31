<template>
  <div
    class="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ease-out"
    v-if="showModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100"
    >
      <div class="p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 tracking-tight">Create Borrow Record</h2>
        <div class="flex items-center mb-8">
          <div class="flex-1">
            <div class="flex justify-between text-sm font-medium text-gray-500">
              <span :class="{ 'text-indigo-600 font-semibold': currentStep === 1 }">1. Borrower Details</span>
              <span :class="{ 'text-indigo-600 font-semibold': currentStep === 2 }">2. Book Details</span>
              <span :class="{ 'text-indigo-600 font-semibold': currentStep === 3 }">3. Confirmation</span>
            </div>
            <div class="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-in-out"
                :style="{ width: currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%' }"
              ></div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Step 1: Borrower Details -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Borrower Type</label>
              <select
                v-model="localForm.borrowerType"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                @change="resetUserFields"
              >
                <option value="new">New User</option>
                <option value="existing">Existing User</option>
              </select>
            </div>

            <div v-if="localForm.borrowerType === 'new'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Borrower Name</label>
                <input
                  v-model="localForm.user_name"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter borrower name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Borrower Email</label>
                <input
                  v-model="localForm.email_borrower"
                  type="email"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter borrower email"
                />
              </div>
            </div>

            <div v-else>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">User ID</label>
              <input
                v-model="localForm.user_id"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                placeholder="Enter user ID"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Librarian Name</label>
              <input
                v-model="localForm.librarian_name"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                placeholder="Enter librarian name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Borrow Date</label>
              <input
                v-model="localForm.date_borrow"
                type="date"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-all duration-200"
              />
            </div>
          </div>

          <!-- Step 2: Book Details -->
          <div v-if="currentStep === 2" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-800 tracking-tight">Book Details</h3>
              <button
                type="button"
                class="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-200"
                @click="addBook"
                :disabled="localForm.books.length >= 3"
                :class="{ 'opacity-50 cursor-not-allowed': localForm.books.length >= 3 }"
              >
                {{ localForm.books.length < 3 ? '+ Add Another Book' : 'Max 3 Books' }}
              </button>
            </div>
            <div v-for="(book, index) in localForm.books" :key="index" class="space-y-4 border-t pt-4 border-gray-200">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">ISBN</label>
                <input
                  v-model="book.isbn"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter ISBN"
                  @input="fetchBookDetails(index)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Book Name</label>
                <input
                  v-model="book.book_name"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="Enter book name"
                  readonly
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Return Date</label>
                <input
                  v-model="book.return_date"
                  type="date"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-all duration-200"
                />
              </div>
              <div v-if="localForm.books.length > 1" class="flex justify-end">
                <button
                  type="button"
                  class="text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200"
                  @click="removeBook(index)"
                >
                  Remove Book
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3: Confirmation -->
          <div v-if="currentStep === 3" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-800 tracking-tight">Confirm Details</h3>
            <div class="bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
              <div>
                <p class="text-sm font-medium text-gray-700">Borrower Type</p>
                <p class="text-gray-900 font-medium">{{ localForm.borrowerType === 'new' ? 'New User' : 'Existing User' }}</p>
              </div>
              <div v-if="localForm.borrowerType === 'new'">
                <p class="text-sm font-medium text-gray-700">Borrower Name</p>
                <p class="text-gray-900">{{ localForm.user_name || 'N/A' }}</p>
                <p class="text-sm font-medium text-gray-700">Borrower Email</p>
                <p class="text-gray-900">{{ localForm.email_borrower || 'N/A' }}</p>
              </div>
              <div v-else>
                <p class="text-sm font-medium text-gray-700">User ID</p>
                <p class="text-gray-900">{{ localForm.user_id || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Librarian Name</p>
                <p class="text-gray-900">{{ localForm.librarian_name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Borrow Date</p>
                <p class="text-gray-900">{{ localForm.date_borrow || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Books</p>
                <ul class="list-disc pl-5 space-y-1">
                  <li v-for="(book, index) in localForm.books" :key="index" class="text-gray-900">
                    {{ book.book_name || 'N/A' }} (ISBN: {{ book.isbn || 'N/A' }}, Return: {{ book.return_date || 'N/A' }})
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-if="formError" class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">{{ formError }}</div>

          <div class="flex justify-between pt-6">
            <button
              v-if="currentStep > 1"
              type="button"
              class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
              @click="currentStep--"
            >
              Back
            </button>
            <div class="flex-1"></div>
            <div class="flex space-x-3">
              <button
                type="button"
                class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
                @click="emit('close')"
              >
                Cancel
              </button>
              <button
                v-if="currentStep < 3"
                type="button"
                class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm"
                @click="nextStep"
                :disabled="!isStepValid"
                :class="{ 'opacity-50 cursor-not-allowed': !isStepValid }"
              >
                Next
              </button>
              <button
                v-if="currentStep === 3"
                type="submit"
                class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm"
                :disabled="loading"
                :class="{ 'opacity-50 cursor-not-allowed': loading }"
              >
                {{ loading ? "Submitting..." : "Submit" }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { inject } from "vue";

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue", "submit", "close"]);

const { getBook, showToast, booksData } = inject("borrowManagement");

const localForm = ref({
  borrowerType: props.modelValue.borrowerType || "new",
  user_name: props.modelValue.borrower_name || "",
  email_borrower: props.modelValue.email_borrower || "",
  user_id: props.modelValue.user_id || "",
  librarian_name: props.modelValue.librarian_name || "",
  date_borrow: props.modelValue.date_borrow || "",
  books: props.modelValue.books || [{ isbn: "", book_name: "", return_date: "" }],
  status: props.modelValue.status || "borrowed",
});

const formError = ref("");
const loading = ref(false);
const showModal = ref(true);
const currentStep = ref(1);

watch(
  () => localForm.value,
  (newForm) => {
    emit("update:modelValue", newForm);
  },
  { deep: true }
);

function resetUserFields() {
  localForm.value.user_name = "";
  localForm.value.email_borrower = "";
  localForm.value.user_id = "";
}

function addBook() {
  if (localForm.value.books.length < 3) {
    localForm.value.books.push({ isbn: "", book_name: "", return_date: "" });
  }
}

function removeBook(index) {
  if (localForm.value.books.length > 1) {
    localForm.value.books.splice(index, 1);
  }
}

async function fetchBookDetails(index) {
  try {
    const isbn = localForm.value.books[index].isbn;
    if (isbn && /^\d{10}$|^\d{13}$/.test(isbn)) {
      const book = await getBook(isbn, "isbn");
      if (book) {
        localForm.value.books[index].book_name = book.title;
      } else {
        localForm.value.books[index].book_name = "";
        showToast(`Book with ISBN ${isbn} not found.`, "error");
      }
    } else {
      localForm.value.books[index].book_name = "";
    }
  } catch (error) {
    console.error("Error fetching book details at", new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }), ":", error);
    showToast(`Failed to fetch book details: ${error.message}`, "error");
  }
}

function isStepValid() {
  if (currentStep.value === 1) {
    return localForm.value.borrowerType === "new"
      ? localForm.value.user_name && localForm.value.email_borrower && localForm.value.librarian_name && localForm.value.date_borrow
      : localForm.value.user_id && localForm.value.librarian_name && localForm.value.date_borrow;
  } else if (currentStep.value === 2) {
    return localForm.value.books.length > 0 && localForm.value.books.every(
      (book) => book.isbn && book.book_name && book.return_date
    );
  }
  return true; // Step 3 (Confirmation) is always valid
}

function nextStep() {
  if (!isStepValid()) {
    formError.value = "Please complete all required fields correctly.";
    showToast("Please complete all required fields.", "error");
    setTimeout(() => (formError.value = ""), 3000);
    return;
  }
  if (currentStep.value < 3) {
    currentStep.value++;
  }
}

async function submitForm() {
  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
  console.log(`Submitting form with data at ${now}:`, JSON.stringify(localForm.value, null, 2));
  if (!isStepValid()) {
    formError.value = "Please complete all required fields correctly.";
    console.error(`Form validation failed at ${now}`);
    showToast("Please complete all required fields.", "error");
    setTimeout(() => (formError.value = ""), 3000);
    return;
  }
  try {
    loading.value = true;
    const submitData = {
      is_new_user: localForm.value.borrowerType === "new",
      borrower_name: localForm.value.user_name,
      email_borrower: localForm.value.email_borrower,
      user_id: localForm.value.user_id,
      librarian_name: localForm.value.librarian_name,
      date_borrow: localForm.value.date_borrow,
      books: localForm.value.books.map((book) => ({
        name: book.book_name,
        isbn: book.isbn,
        date_return: book.return_date,
      })),
      quantity: 1, // Root-level quantity as per test data
      status: localForm.value.status,
    };
    console.log(`Emitting submit event with data at ${now}:`, JSON.stringify(submitData, null, 2));
    const responses = await emit("submit", submitData); // Await responses
    console.log(`Submit event returned responses at ${now}:`, JSON.stringify(responses, null, 2));
    // Check if the parent component has a submit handler
    if (!responses) {
      console.warn(`No responses received at ${now}. Parent component may not handle 'submit' event. Check <BorrowForm @submit="handleBorrowSubmit" /> in parent.`);
    }
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      console.warn(`No valid responses received at ${now}. Checking server connectivity or event handling...`);
      throw new Error("No valid responses received from backend. Please check server connectivity or event handling.");
    }
    const failedResponses = responses.filter(
      (res) => !res || (res.status && res.status >= 400)
    );
    if (failedResponses.length > 0) {
      throw new Error(
        `Failed to create ${failedResponses.length} borrow record(s): ${
          failedResponses[0]?.data?.message || "Unknown backend error"
        }`
      );
    }
    showToast("Borrow record(s) created successfully.", "success");
    showModal.value = false;
    emit("close");
  } catch (error) {
    console.error(`Error during form submission at ${now}:`, error.message, error.stack);
    formError.value = error.message || "Failed to create borrow records.";
    showToast(`Error: ${formError.value}`, "error");
    setTimeout(() => (formError.value = ""), 5000);
  } finally {
    loading.value = false;
  }
}
</script>