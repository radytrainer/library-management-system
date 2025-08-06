<template>
  <div class="px-6 mt-6 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Books -->
      <div
        class="bg-indigo-50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-indigo-100 shadow-md p-6 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-3xl font-bold text-indigo-700">{{ totalBooks }}</div>
            <div class="text-sm text-indigo-500">Total Books</div>
          </div>
          <div class="text-indigo-400 bg-indigo-100 p-3 rounded-full">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Available Books -->
      <div class="bg-indigo-50 shadow hover:shadow-lg transition-all duration-300 rounded-2xl p-6 text-indigo-800 border border-indigo-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-indigo-700">{{ availableBooks }}</div>
            <div class="text-sm text-indigo-500">Available</div>
          </div>
          <div class="text-indigo-500 bg-indigo-100 p-2 rounded-full">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="bg-indigo-50 shadow hover:shadow-lg transition-all duration-300 rounded-2xl p-6 text-indigo-800 border border-indigo-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-indigo-700">{{ categories.length }}</div>
            <div class="text-sm text-indigo-500">Categories</div>
          </div>
          <div class="text-indigo-500 bg-indigo-100 p-2 rounded-full">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- unavailableBooks-->
      <div class="bg-indigo-50 shadow hover:shadow-lg transition-all duration-300 rounded-2xl p-6 text-indigo-800 border border-indigo-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold">{{ unavailableBooks}}</div>
            <div class="text-sm text-gray-500">Unavailable</div>
          </div>
          <div class="text-indigo-500">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalBooks: Number,
  availableBooks: Number,
  categories: Array,
  unavailableBooks: Number,
})
</script>
