<template>
  <div class="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <!-- Page Header -->
    <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">Summary What You Read 📖</h1>

    <!-- Form View -->
    <transition name="fade">
      <form v-if="!showSummary" @submit.prevent="handleSubmit" class="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <!-- Row 1: Student ID and Student Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
          <div>
            <label for="studentId" class="block text-lg font-semibold text-gray-800 flex items-center mb-1">
              <i class="fas fa-id-card mr-2 text-amber-500"></i>Student ID
            </label>
            <input
              v-model="formData.Student_ID"
              id="studentId"
              type="text"
              required
              class="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
              placeholder="Enter Student ID"
            />
          </div>
          <div>
            <label for="studentName" class="block text-lg font-semibold text-gray-800 flex items-center mb-1">
              <i class="fas fa-user mr-2 text-amber-500"></i>Student Name
            </label>
            <input
              v-model="formData.Student_Name"
              id="studentName"
              type="text"
              required
              class="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
              placeholder="Enter Student Name"
            />
          </div>
        </div>

        <!-- Row 2: Class and Year -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
          <div>
            <label for="studentClass" class="block text-lg font-semibold text-gray-800 flex items-center mb-1">
              <i class="fas fa-school mr-2 text-amber-500"></i>Class
            </label>
            <input
              v-model="formData.Student_Class"
              id="studentClass"
              type="text"
              required
              class="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
              placeholder="Enter Class (e.g., A1)"
            />
          </div>
          <div>
            <label for="studentYear" class="block text-lg font-semibold text-gray-800 flex items-center mb-1">
              <i class="fas fa-calendar-alt mr-2 text-amber-500"></i>Year
            </label>
            <input
              v-model.number="formData.Student_Year"
              id="studentYear"
              type="number"
              required
              class="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
              placeholder="Enter Year (e.g., 2025)"
            />
          </div>
        </div>

        <!-- Row 3: Book Title and Book Label -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
          <div>
            <label for="bookTitle" class="block text-lg font-semibold text-gray-800 flex items-center mb-1">
              <i class="fas fa-book mr-2 text-amber-500"></i>Book Title
            </label>
            <input
              v-model="formData.Book_Title"
              id="bookTitle"
              type="text"
              required
              class="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
              placeholder="Enter Book Title"
            />
          </div>
          <div>
            <label for="bookLabel" class="block text-lg font-semibold text-gray-800 flex items-center mb-1">
              <i class="fas fa-tag mr-2 text-amber-500"></i>Book Label
            </label>
            <input
              v-model="formData.Book_Label"
              id="bookLabel"
              type="text"
              required
              class="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
              placeholder="Enter Book Label"
            />
          </div>
        </div>

        <!-- Summary Section - Enhanced -->
        <div class="mb-8">
          <label for="summary" class="block text-lg font-semibold text-gray-800 flex items-center mb-1">
            <i class="fas fa-pencil-alt mr-2 text-amber-500"></i>Summary
          </label>
          <div class="relative">
            <textarea
              v-model="formData.Summary"
              id="summary"
              required
              class="p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out resize-none"
              placeholder="Write your detailed summary here..."
              rows="3"
            ></textarea>
            <!-- Added character counter for summary -->
            <div class="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
              {{ formData.Summary.length }} characters
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            <i class="fas fa-info-circle mr-1"></i>
            Provide a comprehensive summary of what you learned from this book.
          </p>
        </div>

        <!-- Submit Button and Feedback -->
        <div class="flex justify-center">
          <button
            type="submit"
            :disabled="isLoading"
            class="px-8 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition duration-300 ease-in-out disabled:bg-amber-400 shadow-lg transform hover:scale-105"
          >
            <span v-if="isLoading" class="flex items-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>Submitting...
            </span>
            <span v-else class="flex items-center">
              <i class="fas fa-paper-plane mr-2"></i>Submit
            </span>
          </button>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="mt-6 text-red-600 text-center font-medium bg-red-50 p-3 rounded-lg border border-red-200">
          <i class="fas fa-exclamation-triangle mr-2"></i>{{ error }}
        </p>
      </form>
    </transition>

    <!-- Enhanced Summary View -->
    <transition name="fade">
      <div v-if="showSummary" class="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div class="text-center mb-8">
          <i class="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Summary Submitted Successfully!</h2>
          <p class="text-gray-600">Here's what you submitted:</p>
        </div>
        
        <!-- Enhanced summary display with organized layout -->
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <!-- Student Information Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Student ID</p>
              <p class="text-lg font-medium text-gray-900">{{ lastSummary.Student_ID }}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Student Name</p>
              <p class="text-lg font-medium text-gray-900">{{ lastSummary.Student_Name }}</p>
            </div>
          </div>

          <!-- Academic Information Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Class</p>
              <p class="text-lg font-medium text-gray-900">{{ lastSummary.Student_Class }}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Year</p>
              <p class="text-lg font-medium text-gray-900">{{ lastSummary.Student_Year }}</p>
            </div>
          </div>

          <!-- Book Information Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Book Title</p>
              <p class="text-lg font-medium text-gray-900">{{ lastSummary.Book_Title }}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Book Label</p>
              <p class="text-lg font-medium text-gray-900">{{ lastSummary.Book_Label }}</p>
            </div>
          </div>

          <!-- Summary Section -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-3 flex items-center">
              <i class="fas fa-book-open mr-2"></i>Reading Summary
            </p>
            <div class="prose max-w-none">
              <p class="text-gray-800 leading-relaxed text-base">{{ lastSummary.Summary }}</p>
            </div>
            <!-- Added summary statistics -->
            <div class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
              <span>{{ lastSummary.Summary.split(' ').length }} words</span>
              <span>{{ lastSummary.Summary.length }} characters</span>
              <span>~{{ Math.ceil(lastSummary.Summary.split(' ').length / 200) }} min read</span>
            </div>
          </div>
        </div>

        <!-- Added action buttons -->
        <div class="flex justify-center gap-4 mt-8">
          <button
            @click="showSummary = false"
            class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            <i class="fas fa-plus mr-2"></i>Add Another Summary
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createSummary } from '@/services/Api/summary';

const formData = ref({
  Student_ID: '',
  Student_Name: '',
  Student_Class: '',
  Student_Year: '',
  Book_Title: '',
  Book_Label: '',
  Summary: ''
});
const lastSummary = ref(null);
const showSummary = ref(false);
const isLoading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    await createSummary(formData.value);
    lastSummary.value = { ...formData.value };
    formData.value = {
      Student_ID: '',
      Student_Name: '',
      Student_Class: '',
      Student_Year: '',
      Book_Title: '',
      Book_Label: '',
      Summary: ''
    };
    showSummary.value = true;
    setTimeout(() => {
      showSummary.value = false;
    }, 60000); // 1 minute
  } catch (err) {
    error.value = 'Failed to create summary. Please try again.';
    console.error('Error creating summary:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Optional: Any initialization logic if needed
});
</script>

<style scoped>
/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>