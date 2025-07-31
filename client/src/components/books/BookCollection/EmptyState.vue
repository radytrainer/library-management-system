<!-- EmptyState.vue -->
<template>
  <div class="text-center py-12">
    <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">No books found</h3>
    <p class="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
    <button @click="$emit('addBook')" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
      Add Your First Book
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['addBook'])
</script>
