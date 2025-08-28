```vue
<template>
  <div class="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <!-- Page Header -->
    <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">Summary What You Read 📖</h1>

    <!-- Form View -->
    <transition name="fade">
      <form v-if="!showSummary" @submit.prevent="handleSubmit" class="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div class="mb-6">
          <label for="studentId" class="block text-lg font-semibold text-gray-800 flex items-center"><i class="fas fa-id-card mr-2 text-amber-500"></i>Student ID</label>
          <input
            v-model="formData.Student_ID"
            id="studentId"
            type="text"
            required
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
            placeholder="Enter Student ID"
          />
        </div>

        <div class="mb-6">
          <label for="studentName" class="block text-lg font-semibold text-gray-800 flex items-center"><i class="fas fa-user mr-2 text-amber-500"></i>Student Name</label>
          <input
            v-model="formData.Student_Name"
            id="studentName"
            type="text"
            required
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
            placeholder="Enter Student Name"
          />
        </div>

        <div class="mb-6">
          <label for="studentClass" class="block text-lg font-semibold text-gray-800 flex items-center"><i class="fas fa-school mr-2 text-amber-500"></i>Class</label>
          <input
            v-model="formData.Student_Class"
            id="studentClass"
            type="text"
            required
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
            placeholder="Enter Class (e.g., A1)"
          />
        </div>

        <div class="mb-6">
          <label for="studentYear" class="block text-lg font-semibold text-gray-800 flex items-center"><i class="fas fa-calendar-alt mr-2 text-amber-500"></i>Year</label>
          <input
            v-model.number="formData.Student_Year"
            id="studentYear"
            type="number"
            required
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
            placeholder="Enter Year (e.g., 2025)"
          />
        </div>

        <div class="mb-6">
          <label for="bookTitle" class="block text-lg font-semibold text-gray-800 flex items-center"><i class="fas fa-book mr-2 text-amber-500"></i>Book Title</label>
          <input
            v-model="formData.Book_Title"
            id="bookTitle"
            type="text"
            required
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
            placeholder="Enter Book Title"
          />
        </div>

        <div class="mb-6">
          <label for="bookLabel" class="block text-lg font-semibold text-gray-800 flex items-center"><i class="fas fa-tag mr-2 text-amber-500"></i>Book Label</label>
          <input
            v-model="formData.Book_Label"
            id="bookLabel"
            type="text"
            required
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
            placeholder="Enter Book Label"
          />
        </div>

        <div class="mb-6">
          <label for="summary" class="block text-lg font-semibold text-gray-800 flex items-center"><i class="fas fa-pencil-alt mr-2 text-amber-500"></i>Summary</label>
          <textarea
            v-model="formData.Summary"
            id="summary"
            required
            class="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
            placeholder="Enter Summary"
            rows="5"
          ></textarea>
        </div>

        <!-- Submit Button and Feedback -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition duration-300 ease-in-out disabled:bg-amber-400 shadow-md"
          >
            <span v-if="isLoading">Submitting...</span>
            <span v-else>Submit</span>
          </button>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="mt-4 text-red-600 text-sm text-center font-medium">{{ error }}</p>
      </form>
    </transition>

    <!-- Summary View -->
    <transition name="fade">
      <div v-if="showSummary" class="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Your Summary</h2>
        <div class="space-y-4">
          <p><strong>Student ID:</strong> {{ lastSummary.Student_ID }}</p>
          <p><strong>Student Name:</strong> {{ lastSummary.Student_Name }}</p>
          <p><strong>Class:</strong> {{ lastSummary.Student_Class }}</p>
          <p><strong>Year:</strong> {{ lastSummary.Student_Year }}</p>
          <p><strong>Book Title:</strong> {{ lastSummary.Book_Title }}</p>
          <p><strong>Book Label:</strong> {{ lastSummary.Book_Label }}</p>
          <p><strong>Summary:</strong> {{ lastSummary.Summary }}</p>
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
```