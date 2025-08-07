<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1 cursor-pointer"
    @click="$emit('viewBook', book)"
  >
    <div class="p-4 ">
      <div class="flex items-start gap-8">
        <!-- Book Cover -->
        <div class="flex-shrink-0">
          <div v-if="book.cover_image_url" class="w-20 h-auto shadow-md">
            <img
              :src="book.cover_image_url"
              :alt="book.title"
              :title="book.title"
              class="w-full h-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
              @error="handleImageError"
              @load="handleImageLoad"
            />
          </div>
          <div
            v-else
            class="w-16 h-20 rounded-lg shadow-md bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
          >
            <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
              />
            </svg>
          </div>
        </div>

        <!-- Book Info, Action Menu & Badges -->
        <div class="flex-1 flex flex-col justify-between h-full">
          <!-- Book Title, Author, Description + Action Menu -->
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 text-lg leading-tight mb-1 mt-1 line-clamp-2">
                {{ book.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-2">
                Author: {{ book.author?.name || 'Unknown Author' }}
              </p>
              <p class="text-gray-500 text-sm mb-3 description">
                {{
                  book.description && book.description.length > 180
                    ? book.description.slice(0, 70) + ' ...'
                    : book.description || 'N/A'
                }}
              </p>
            </div>

            <!-- Action Menu -->
            <div class="relative ml-2" data-action-menu>
              <button
                @click.stop="$emit('toggleActionMenu', book.id)"
                class="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="w-6 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  />
                </svg>
              </button>

              <Transition name="fade-slide">
                <div
                  v-if="openActionMenu === book.id"
                  class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  <div class="py-2">
                    <button
                      @click.stop="$emit('openForm', book)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      @click.stop="$emit('deleteBookById', book.id)"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Badges and Availability -->
          <div class="flex items-center justify-between">
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-if="book.category?.name"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ book.category.name }}
              </span>
              <span
                v-if="book.language?.name"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-gray-800"
              >
                {{ book.language.name }}
              </span>
            </div>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-300"
              :class="{
                'bg-green-100 text-green-800': book.quantity >= 2,
                'bg-yellow-100 text-yellow-800': book.quantity === 1,
                'bg-red-100 text-red-800': book.quantity === 0
              }"
            >
              <div
                class="w-1.5 h-1.5 rounded-full mr-1.5 transition-colors duration-300"
                :class="{
                  'bg-green-400': book.quantity >= 2,
                  'bg-yellow-400': book.quantity === 1,
                  'bg-red-400': book.quantity === 0
                }"
              ></div>
              {{
                book.quantity >= 2
                  ? 'Available'
                  : book.quantity === 1
                    ? 'Limited'
                    : 'Unavailable'
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  book: Object,
  openActionMenu: [Number, String, null]
});

const emit = defineEmits(['viewBook', 'openForm', 'deleteBookById', 'toggleActionMenu', 'bookUpdated']);

const imageSrc = computed(() => {
  return props.book.book_image_url || '/path/to/fallback-image.jpg';
});

const handleImageLoad = () => {
  console.log(`Image loaded successfully for book: ${props.book.title}`);
};

const handleImageError = (event) => {
  console.warn(`Failed to load image for book: ${props.book.title}, URL: ${props.book.book_image_url}`);
  event.target.src = '/path/to/fallback-image.jpg';
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description {
  min-width: 300px; /* Adjust based on your layout */
  max-width: 85%;
  word-break: break-word; /* Ensures words break naturally */
  white-space: normal; /* Allows wrapping */
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>