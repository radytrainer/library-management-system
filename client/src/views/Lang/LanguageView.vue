<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Top Section: Title + Add Button -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
              📚 Library Collection
            </h1>
            <p class="text-gray-500 mt-1 text-base">
              Discover books by language and explore our collection
            </p>
          </div>

          <button
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
          >
          Add Lang
          </button>
        </div>

        <!-- Bottom Section: Search + Filters -->
        <div class="mt-6 flex flex-col sm:flex-row gap-4">
          <!-- Search Bar -->
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search books by title or category..."
              class="w-full border border-gray-300 rounded-lg py-2.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 6.65a7.5 7.5 0 016.5 6.5z"/>
            </svg>
          </div>

          <!-- Filter Dropdown -->
          <select
            v-model="selectedCategory"
            class="border border-gray-300 rounded-lg py-2.5 px-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        <!-- Books Grid -->
        <div class="lg:col-span-3">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ selectedLanguage ? `Books in ${selectedLanguage}` : 'All Books' }}
            </h2>
            <p class="text-gray-500 mt-1">{{ filteredBooks.length }} books available</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div 
              v-for="book in filteredBooks" 
              :key="book.id"
              class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300"
            >
              <div class="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                <img 
                  :src="book.image" 
                  :alt="book.title"
                  class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  @error="handleImageError($event)"
                />
              </div>
              <div class="p-5">
                <h3 class="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{{ book.title }}</h3>
                <div class="space-y-1 text-sm text-gray-600 mb-4">
                  <p><span class="font-medium">Language:</span> {{ book.language }}</p>
                  <p><span class="font-medium">Category:</span> {{ book.category }}</p>
                  <p><span class="font-medium">Published:</span> {{ book.publicationYear }}</p>
                </div>
                <button class="w-full bg-gray-900 text-white py-2.5 px-4 rounded-xl hover:bg-gray-700 transition-colors duration-300 text-sm font-medium shadow-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Language Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-10">
            <h3 class="text-xl font-bold text-gray-900 mb-5">Browse by Language</h3>
            
            <div class="space-y-2">
              <button
                @click="selectedLanguage = null"
                :class="[ 
                  'w-full text-left p-3 rounded-lg transition-colors duration-200 flex justify-between items-center',
                  !selectedLanguage 
                    ? 'bg-gray-100 text-gray-900 border border-gray-300 font-semibold' 
                    : 'hover:bg-gray-50 text-gray-700'
                ]"
              >
                <span>🌍 All Languages</span>
                <span class="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                  {{ books.length }}
                </span>
              </button>

              <div v-for="language in displayedLanguages" :key="language.name">
                <button
                  @click="selectedLanguage = language.name"
                  :class="[ 
                    'w-full text-left p-3 rounded-lg transition-colors duration-200 flex justify-between items-center',
                    selectedLanguage === language.name 
                      ? 'bg-gray-100 text-gray-900 border border-gray-300 font-semibold' 
                      : 'hover:bg-gray-50 text-gray-700'
                  ]"
                >
                  <div>
                    <div>{{ language.name }}</div>
                    <div v-if="language.country" class="text-xs text-gray-500">{{ language.country }}</div>
                  </div>
                  <span class="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                    {{ language.count }}
                  </span>
                </button>
              </div>
            </div>

            <button
              v-if="!showAllLanguages && languages.length > 5"
              @click="showAllLanguages = true"
              class="w-full mt-4 text-gray-600 hover:text-gray-700 text-sm font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Show More Languages ({{ languages.length - 5 }} more)
            </button>

            <button
              v-if="showAllLanguages && languages.length > 5"
              @click="showAllLanguages = false"
              class="w-full mt-4 text-gray-600 hover:text-gray-700 text-sm font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Show Less
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// same script as your version
const books = ref([
  { id: 1, title: "The Great Gatsby", language: "English", category: "Classic Literature", publicationYear: 1925, image: "https://picsum.photos/200/300?random=1" },
  { id: 2, title: "Le Petit Prince", language: "French", category: "Children's Literature", publicationYear: 1943, image: "https://picsum.photos/200/300?random=2" },
  { id: 3, title: "ព្រះរាជពង្សាវតារខ្មែរ", language: "Khmer", category: "History", publicationYear: 1928, image: "https://picsum.photos/200/300?random=3" },
  { id: 4, title: "Don Quixote", language: "Spanish", category: "Classic Literature", publicationYear: 1605, image: "https://picsum.photos/200/300?random=4" },
  { id: 5, title: "Pride and Prejudice", language: "English", category: "Romance", publicationYear: 1813, image: "https://picsum.photos/200/300?random=5" },
  { id: 6, title: "Les Misérables", language: "French", category: "Historical Fiction", publicationYear: 1862, image: "https://picsum.photos/200/300?random=6" },
  { id: 7, title: "រឿងទេវតាអប្សរា", language: "Khmer", category: "Mythology", publicationYear: 1950, image: "https://picsum.photos/200/300?random=7" },
  { id: 8, title: "Cien Años de Soledad", language: "Spanish", category: "Magical Realism", publicationYear: 1967, image: "https://picsum.photos/200/300?random=8" },
  { id: 9, title: "Der Prozess", language: "German", category: "Philosophical Fiction", publicationYear: 1925, image: "https://picsum.photos/200/300?random=9" }
])

const allLanguages = ref([
  { name: "English", country: "United Kingdom" },
  { name: "French", country: "France" },
  { name: "Khmer", country: "Cambodia" },
  { name: "Spanish", country: "Spain" },
  { name: "German", country: "Germany" },
  { name: "Japanese", country: "Japan" },
  { name: "Chinese", country: "China" },
  { name: "Arabic", country: "Saudi Arabia" },
])

const selectedLanguage = ref(null)
const showAllLanguages = ref(false)
const searchQuery = ref("")
const selectedCategory = ref("")

const categories = computed(() => [...new Set(books.value.map(book => book.category))])

const languages = computed(() => {
  return allLanguages.value.map(lang => ({
    ...lang,
    count: books.value.filter(book => book.language === lang.name).length
  })).filter(lang => lang.count > 0)
})

const displayedLanguages = computed(() => showAllLanguages.value ? languages.value : languages.value.slice(0, 5))

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    const matchesLanguage = !selectedLanguage.value || book.language === selectedLanguage.value
    const matchesCategory = !selectedCategory.value || book.category === selectedCategory.value
    const matchesSearch = !searchQuery.value || 
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesLanguage && matchesCategory && matchesSearch
  })
})

const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/200x300?text=No+Image"
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
