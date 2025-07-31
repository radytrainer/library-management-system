<template>
  <div v-if="showDetail"
    class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
    <div class="relative top-[90px] mx-auto bg-white rounded-xl w-full max-w-full sm:max-w-4xl max-h-[80vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Book Details</h2>
          <button @click="$emit('closeDetail')"
            class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center group"
            aria-label="Close details">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="p-6 overflow-y-auto" style="flex-grow:1;">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Book Cover -->
          <div class="flex-shrink-0">
            <div class="relative group cursor-pointer" @click="$emit('openFullImage')" title="Click to view full image">
              <img :src="selectedBook.cover_image_url" :alt="selectedBook.title + ' cover'"
                class="w-80 h-80 rounded-xl object-cover shadow-lg border border-gray-200 transition-transform duration-300 group-hover:scale-105" />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300 flex items-center justify-center">
                <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Book Information -->
          <div class="flex-1 space-y-6">
            <!-- Title and Description -->
            <div class="space-y-3">
              <h3 class="text-3xl font-bold text-gray-900 leading-tight">{{ selectedBook.title }}</h3>
              <p class="text-gray-600 text-lg leading-relaxed">{{ selectedBook.description }}</p>
            </div>

            <!-- Badges -->
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {{ selectedBook.category?.name || 'N/A' }}
              </span>
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {{ selectedBook.language?.name || 'N/A' }}
              </span>
              <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {{ selectedBook.public_year || 'N/A' }}
              </span>
            </div>

            <!-- Book Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Author</span>
                  <p class="text-gray-900 font-medium text-lg">{{ selectedBook.author?.name || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">ISBN</span>
                  <p class="text-gray-900 font-mono">{{ selectedBook.isbn || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quantity Available</span>
                  <p class="text-gray-900 font-medium">
                    <span class="text-2xl font-bold text-green-600">{{ selectedBook.quantity || 0 }}</span> copies
                  </p>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Publication Year</span>
                  <p class="text-gray-900 font-medium text-lg">{{ selectedBook.public_year || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Language</span>
                  <p class="text-gray-900 font-medium text-lg">{{ selectedBook.language?.name || 'N/A' }}</p>
                </div>
                <div v-if="selectedBook.donated_by">
                  <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Donated By</span>
                  <p class="text-gray-900 font-medium text-lg">{{ selectedBook.donated_by }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Author Details Section -->
        <div class="border-t border-gray-200 mt-8 pt-8">
          <h4 class="text-xl font-bold text-gray-900 mb-4">About the Author</h4>
          <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Biography</span>
                <p class="text-gray-700 leading-relaxed mt-2">{{ selectedBook.author?.biography || 'N/A' }}</p>
              </div>
              <div class="space-y-4">
                <div>
                  <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Birth Date</span>
                  <p class="text-gray-900 font-medium text-lg">
                    {{
                      selectedBook.author?.birth_date
                        ? new Date(selectedBook.author.birth_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                        : 'N/A'
                    }}
                  </p>
                </div>
                <div>
                  <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nationality</span>
                  <p class="text-gray-900 font-medium text-lg">{{ selectedBook.author?.nationality || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full Image Modal - Improved Version -->
      <div v-if="showFullImage"
        class="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        <!-- Close Button (Top Right) -->
        <button @click="$emit('closeFullImage')"
          class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          aria-label="Close full image">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Image Container with Proper Constraints -->
        <div class="relative w-full h-full flex items-center justify-center">
          <img :src="selectedBook.cover_image_url" :alt="selectedBook.title + ' cover - full size'"
            class="w-auto h-[76vh] object-contain rounded-lg shadow-2xl cursor-pointer"
            @click="$emit('closeFullImage')" />
        </div>

        <!-- Optional Caption -->
        <div class="text-white text-center opacity-80">
          <p class="text-sm">{{ selectedBook.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showDetail: Boolean,
  selectedBook: Object,
  showFullImage: Boolean,
})
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth transition for modal appearance */
.fixed {
  transition: opacity 0.2s ease;
}

/* Better touch target for mobile */
@media (max-width: 640px) {
  button {
    width: 12vw;
    height: 12vw;
    min-width: 44px;
    min-height: 44px;
  }
}
</style>