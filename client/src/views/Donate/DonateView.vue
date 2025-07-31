<template>
  <div class="max-w-7xl mx-auto space-y-6 p-8">
    <!-- Header -->
    <div class="w-full bg-sky-500 rounded-xl shadow-md p-12 flex flex-col md:flex-row md:justify-between justify-center gap-12 py-5">
      <div class="flex flex-col gap-4 pr-4 md:pr-12">
        <h1 class="text-4xl font-bold text-white mt-8">📚 Welcome and Thank You for Your Kindness</h1>
        <p class="text-sm text-white mt-3">
          We sincerely welcome you to our book donation program. Your generous support helps us grow a meaningful library for the community. Every book you donate is a gift of knowledge, and we truly appreciate your contribution.
        </p>
      </div>
      <div class="flex justify-end items-center p-6">
        <div class="relative w-40 h-40 overflow-hidden rounded-xl shadow-md">
          <img src="https://i.pinimg.com/736x/d1/0e/91/d10e9103d8cb653c62a0d87adaf171cd.jpg" class="w-full h-full object-cover" alt="Book Image" />
        </div>
      </div>
    </div>

    <!-- Search and Donate -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="w-full sm:w-1/2">
        <input v-model="searchTerm" type="text" placeholder="Search by title, ISBN, or owner..." class="w-full border border-gray-400 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
      </div>
      <button @click="openAddDialog" class="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white rounded-md hover:bg-blue-400 text-sm shadow" aria-label="Donate Book">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 4v16m8-8H4" />
        </svg>
        Donate
      </button>
    </div>

    <!-- Book Cards -->
    <div v-if="visibleBooks.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 pb-4">
      <div v-for="book in visibleBooks" :key="book.id" class="bg-white shadow border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer" @click="viewBook(book)">
        <div class="relative">
          <img v-if="book.book_image" :src="book.book_image" alt="Book Cover" class="w-full h-44 object-cover bg-gray-100" />
          <img v-else src="https://i.pinimg.com/736x/d1/0e/91/d10e9103d8cb653c62a0d87adaf171cd.jpg" alt="No Book Cover" class="w-full h-44 object-cover bg-gray-100" />
          <button @click.stop="toggleMenu(book.id)" class="absolute top-2 right-2 text-white hover:bg-black/80 rounded-full p-1 text-lg z-30">⋮</button>
          <div v-if="activeMenuId === book.id" class="absolute top-10 right-2 w-24 bg-white border border-gray-200 rounded-md shadow z-30">
            <button @click="viewBook(book); closeMenu();" class="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100">View</button>
            <button @click="openEditDialog(book); closeMenu();" class="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100">Edit</button>
            <button @click="deleteBook(book.id); closeMenu();" class="block w-full text-left px-3 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
          </div>
        </div>
        <div class="p-4 space-y-2 text-sm">
          <h2 class="font-semibold text-gray-800 truncate">{{ book.title }}</h2>
          <p class="text-xs text-gray-500 truncate">ISBN: {{ book.isbn }}</p>
          <span class="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-medium">Qty: {{ book.quantity }}</span>
          <div class="grid grid-cols-2 gap-1 text-[11px] text-gray-600 pt-1">
            <div><span class="font-medium">Lang:</span> {{ getLanguageName(book.language_id) }}</div>
            <div><span class="font-medium">Cat:</span> {{ getCategoryName(book.category_id) }}</div>
            <div><span class="font-medium">Owner:</span> {{ book.owner }}</div>
            <div><span class="font-medium">ID:</span> {{ book.id }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Show More -->
    <div v-if="canShowMore" class="flex justify-center mt-6">
      <button @click="showMore" class="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition shadow">Show More</button>
    </div>

    <!-- No Results -->
    <div v-else-if="!visibleBooks.length" class="text-center text-gray-500 italic p-6 w-full">No books found.</div>

    <!-- Modal -->
    <div v-if="showAddDialog" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div role="dialog" aria-modal="true" class="bg-white p-5 sm:p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <button class="absolute top-2.5 right-3 text-gray-400 hover:text-gray-800 text-xl" @click="closeDialog" aria-label="Close Modal">×</button>
        <h2 class="text-xl font-bold text-center text-gray-800 mb-5">
          {{ isEditing ? "✏️ Edit Book" : isViewing ? "📖 Book Details" : "📘 Donate a New Book" }}
        </h2>

        <!-- View Mode -->
        <div v-if="isViewing" class="space-y-3 text-sm">
          <div><span class="font-medium text-gray-700">Title:</span> {{ donation.title }}</div>
          <div><span class="font-medium text-gray-700">ISBN:</span> {{ donation.isbn }}</div>
          <div><span class="font-medium text-gray-700">Quantity:</span> {{ donation.quantity }}</div>
          <div><span class="font-medium text-gray-700">Owner:</span> {{ donation.owner }}</div>
          <div><span class="font-medium text-gray-700">Email:</span> {{ donation.email }}</div>
          <div><span class="font-medium text-gray-700">Phone:</span> {{ donation.phone }}</div>
          <div><span class="font-medium text-gray-700">Language:</span> {{ getLanguageName(donation.language_id) }}</div>
          <div><span class="font-medium text-gray-700">Category:</span> {{ getCategoryName(donation.category_id) }}</div>
          <div>
            <span class="font-medium text-gray-700">Cover Image:</span>
            <img :src="donation.book_image || 'https://i.pinimg.com/736x/d1/0e/91/d10e9103d8cb653c62a0d87adaf171cd.jpg'" class="h-28 object-contain rounded border mt-1" />
          </div>
          <div class="flex justify-end pt-2">
            <button @click="closeDialog" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-md font-medium shadow-sm transition">Close</button>
          </div>
        </div>

        <!-- Add/Edit Mode -->
        <form v-else @submit.prevent="submitDonation" class="space-y-3 text-sm">
          <div>
            <label class="block mb-1 text-gray-700">Donor's Full Name</label>
            <input v-model="donation.owner" required class="w-full border px-3 py-1.5 rounded-md" />
          </div>
          <div>
            <label class="block mb-1 text-gray-700">Total Books to Donate</label>
            <input v-model.number="donation.quantity" type="number" min="1" required class="w-full border px-3 py-1.5 rounded-md" />
          </div>
          <div>
            <label class="block mb-1 text-gray-700">Book Category</label>
            <select v-model="donation.category_id" required class="w-full border px-3 py-1.5 rounded-md">
              <option disabled value="">Select</option>
              <option :value="1">Fiction</option>
              <option :value="2">Classic</option>
              <option :value="3">Science</option>
              <option :value="3">Different</option>
            </select>
          </div>
          <div class="flex justify-end pt-2">
            <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md font-medium shadow-sm transition">
              {{ isEditing ? "Update Book" : "Donate" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getDonations, createDonation, updateDonation, deleteDonation } from "@/services/Api/donation";

const searchTerm = ref("");
const visibleCount = ref(8);
const sortBy = ref("");
const showAddDialog = ref(false);
const isEditing = ref(false);
const isViewing = ref(false);
const editingBookId = ref(null);
const activeMenuId = ref(null);

const books = ref([]);
const donation = ref({
  title: "",
  isbn: "",
  quantity: 1,
  owner: "",
  email: "",
  phone: "",
  author: "",
  status: "pending",
  available: 1,
  language_id: "",
  category_id: "",
  user_id: null,
  book_image: "",
});

const fetchDonations = async () => {
  try {
    const response = await getDonations();
    books.value = response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
  }
};

onMounted(fetchDonations);

const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

const closeMenu = () => (activeMenuId.value = null);

const openAddDialog = () => {
  isEditing.value = false;
  isViewing.value = false;
  resetForm();
  showAddDialog.value = true;
};

const openEditDialog = (book) => {
  isEditing.value = true;
  isViewing.value = false;
  editingBookId.value = book.id;
  Object.assign(donation.value, { ...book });
  showAddDialog.value = true;
};

const viewBook = (book) => {
  isEditing.value = false;
  isViewing.value = true;
  Object.assign(donation.value, { ...book });
  showAddDialog.value = true;
  closeMenu();
};

const closeDialog = () => {
  showAddDialog.value = false;
  isViewing.value = false;
  resetForm();
};

const resetForm = () => {
  Object.assign(donation.value, {
    title: "",
    isbn: "",
    quantity: 1,
    owner: "",
    email: "",
    phone: "",
    language_id: "",
    category_id: "",
    book_image: "",
  });
  editingBookId.value = null;
};

const submitDonation = async () => {
  const formData = new FormData();
  for (const key in donation.value) {
    formData.append(key, donation.value[key]);
  }

  try {
    if (isEditing.value) {
      await updateDonation(editingBookId.value, formData);
    } else {
      await createDonation(formData);
      alert("Donation submitted! Librarian has been notified to confirm the donation.");
    }
    await fetchDonations();
    closeDialog();
  } catch (error) {
    console.error("Error submitting donation:", error);
    alert("Something went wrong. Please try again.");
  }
};

const deleteBook = async (id) => {
  if (!confirm("Are you sure you want to delete this donation?")) return;
  try {
    await deleteDonation(id);
    await fetchDonations();
  } catch (error) {
    console.error("Error deleting donation:", error);
  }
};

const filteredBooks = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return books.value.filter(
    (b) =>
      b.title.toLowerCase().includes(term) ||
      b.isbn.toLowerCase().includes(term) ||
      b.owner.toLowerCase().includes(term)
  );
});

const sortedBooks = computed(() => {
  const copy = [...filteredBooks.value];
  if (sortBy.value === "title") return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy.value === "quantity") return copy.sort((a, b) => b.quantity - a.quantity);
  return copy;
});

const visibleBooks = computed(() => sortedBooks.value.slice(0, visibleCount.value));
const canShowMore = computed(() => visibleCount.value < sortedBooks.value.length);
const showMore = () => (visibleCount.value += 8);

const getLanguageName = (id) => ({ 1: "English", 2: "French", 3: "Khmer" }[id] || "Unknown");
const getCategoryName = (id) => ({ 1: "Fiction", 2: "Classic", 3: "Science" }[id] || "Unknown");
</script>

<style>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>