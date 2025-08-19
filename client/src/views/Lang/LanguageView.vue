<template>
  <div class="min-h-screen bg-white">
    <!-- Error message -->
    <transition name="fade">
      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{{ error }}</p>
      </div>
    </transition>

    <!-- Loading state -->
    <div v-if="loading.books || loading.languages" class="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span class="ml-4 text-gray-600">Loading books and languages...</span>
    </div>

    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="transform hover:scale-[1.01] transition-transform duration-300">
            <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span class="inline-block transition-all duration-500"></span>
              Library Collection
            </h1>
            <p class="text-gray-500 mt-1 text-base">Discover books by language and explore our collection</p>
          </div>
          <button
            @click="openLanguageModal()"
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <span class="inline-block transition-transform duration-200 group-hover:rotate-90">+</span>
            Add Language
          </button>
        </div>
        <div class="mt-6 flex flex-col sm:flex-row gap-4">
          <!-- Search Bar -->
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search books by title or category..."
              class="w-full border border-gray-300 rounded-lg py-2.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 transition-all duration-300"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 6.65a7.5 7.5 0 016.5 6.5z"/>
            </svg>
          </div>

          <!-- Filter Dropdown -->
          <select
            v-model="selectedCategory"
            class="border border-gray-300 rounded-lg py-2.5 px-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 hover:border-gray-400"
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
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedLanguage ? `Books in ${selectedLanguage}` : 'All Books' }}</h2>
            <p v-if="selectedLanguage" class="text-sm text-gray-500 mt-1">
              {{ languages.find(l => l.name === selectedLanguage)?.country || '' }}
            </p>
            <p class="text-gray-500 mt-1 transition-opacity duration-300">{{ filteredBooks.length }} {{ filteredBooks.length === 1 ? 'book' : 'books' }} available</p>
          </div>
          
          <!-- Books Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <template v-if="Array.isArray(filteredBooks) && filteredBooks.length > 0">
              <div 
                v-for="book in filteredBooks" 
                :key="book.id" 
                class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-500 hover:-translate-y-1"
              >
                <div class="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                  <img 
                    :src="book.cover_image || 'https://via.placeholder.com/200x300?text=No+Image'" 
                    :alt="book.title || 'Book cover'" 
                    class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                    @error="handleImageError"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div class="p-5">
                  <h3 class="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {{ book.title || 'Untitled Book' }}
                  </h3>
                  <div class="space-y-1 text-sm text-gray-600 mb-4">
                    <p class="transition-colors duration-300 group-hover:text-gray-800">
                      <span class="font-medium">Language:</span> {{ book.language || 'Unknown' }}
                    </p>
                    <p class="transition-colors duration-300 group-hover:text-gray-800">
                      <span class="font-medium">Category:</span> {{ book.category || 'Uncategorized' }}
                    </p>
                    <p class="transition-colors duration-300 group-hover:text-gray-800">
                      <span class="font-medium">Published:</span> {{ book.public_year || 'Unknown year' }}
                    </p>
                  </div>
                  <button class="w-full bg-gray-900 text-white py-2.5 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-sm transform hover:scale-[1.02] active:scale-95">
                    View Details
                  </button>
                </div>
              </div>
            </template>
          </div>
          
          <!-- Empty state -->
          <transition name="fade" mode="out-in">
            <div 
              v-if="!loading.books && (!Array.isArray(filteredBooks) || filteredBooks.length === 0)" 
              class="text-center py-20"
            >
              <div class="mx-auto w-24 h-24 mb-6 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h3 class="text-xl font-medium text-gray-700 mb-2">No books found</h3>
              <p class="text-gray-500 max-w-md mx-auto">
                {{ loading.books ? 'Loading books...' : 'Try adjusting your search or filters to find what you\'re looking for.' }}
              </p>
            </div>
          </transition>
        </div>

        <!-- Language Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-10 transition-all duration-300 hover:shadow-md">
            <h3 class="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span>🌐</span>
              Browse by Language
            </h3>
            <!-- Total language count -->
            <p class="text-sm text-gray-600 mb-4">
              Total Languages: {{ Array.isArray(languages) ? languages.length : 0 }}
            </p>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <button 
                  @click="selectedLanguage = null" 
                  :class="[ 
                    'w-full text-left p-3 rounded-lg transition-all duration-300 flex justify-between items-center',
                    !selectedLanguage 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold' 
                      : 'hover:bg-gray-50 text-gray-700 hover:border-gray-300 border border-transparent'
                  ]"
                >
                  <span>🌍 All Languages</span>
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full transition-all duration-300">
                    {{ Array.isArray(books) ? books.length : 0 }}
                  </span>
                </button>
                <button 
                  v-if="selectedLanguage"
                  @click="selectedLanguage = null"
                  class="ml-2 text-blue-600 hover:text-blue-800 text-sm transition-colors duration-300 p-1"
                >
                  Clear
                </button>
              </div>

              <template v-if="Array.isArray(displayedLanguages)">
                <div 
                  v-for="language in displayedLanguages" 
                  :key="language.id" 
                  class="transition-all duration-300"
                >
                  <div class="flex justify-between items-center">
                    <button 
                      @click="selectedLanguage = language.name" 
                      :class="[ 
                        'w-full text-left p-3 rounded-lg transition-all duration-300 border flex-grow flex items-center gap-2',
                        selectedLanguage === language.name 
                          ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold' 
                          : 'hover:bg-gray-50 text-gray-700 hover:border-gray-300 border-transparent'
                      ]"
                    >
                      <svg 
                        v-if="selectedLanguage === language.name" 
                        class="h-4 w-4 text-blue-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <div>
                        <div class="transition-colors duration-300">{{ language.name || 'Unknown Language' }}</div>
                        <div v-if="language.country" class="text-xs text-gray-500 transition-colors duration-300">
                          {{ language.country }}
                        </div>
                      </div>
                      <span 
                        :class="[
                          'text-xs px-2 py-1 rounded-full transition-all duration-300',
                          selectedLanguage === language.name 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        ]"
                      >
                        {{ language.count || 0 }}
                      </span>
                    </button>
                    <div class="flex gap-1 ml-2">
                      <button 
                        @click.stop="openLanguageModal(language)" 
                        class="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-300 p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button 
                        @click.stop="removeLanguage(language.id)" 
                        class="text-red-600 hover:text-red-800 text-sm transition-colors duration-300 p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Show books for this language -->
                  <div 
                    v-if="selectedLanguage === language.name && language.books.length > 0"
                    class="ml-4 mt-2 pl-4 border-l-2 border-blue-200 space-y-2"
                  >
                    <div 
                      v-for="book in language.books" 
                      :key="book.id"
                      class="p-2 bg-gray-50 rounded-lg text-sm flex items-center gap-2"
                    >
                      <div class="w-8 h-8 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                        <img 
                          :src="book.cover_image || 'https://via.placeholder.com/50x50?text=No+Image'" 
                          :alt="book.title" 
                          class="w-full h-full object-cover"
                          @error="handleImageError"
                        />
                      </div>
                      <div class="truncate">{{ book.title }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <button 
              v-if="!showAllLanguages && Array.isArray(languages) && languages.length > 5" 
              @click="showAllLanguages = true" 
              class="w-full mt-4 text-gray-600 hover:text-blue-600 text-sm font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-1"
            >
              Show More
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <button 
              v-if="showAllLanguages && Array.isArray(languages) && languages.length > 5" 
              @click="showAllLanguages = false" 
              class="w-full mt-4 text-gray-600 hover:text-blue-600 text-sm font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-1"
            >
              Show Less
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Language Modal -->
    <transition name="modal">
      <div 
        v-if="showLanguageModal" 
        class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 transition-opacity duration-300"
        @click.self="showLanguageModal = false"
      >
        <div 
          class="bg-white rounded-xl p-6 w-96 max-w-[90vw] mx-4 transition-all duration-300"
          :class="showLanguageModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
        >
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <span v-if="editingLanguage">✏️</span>
            <span v-else>➕</span>
            {{ editingLanguage ? 'Edit Language' : 'Add Language' }}
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Language Name *</label>
              <input 
                v-model="languageForm.name" 
                placeholder="e.g. English, French..." 
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                @keyup.enter="saveLanguage"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Country (Optional)</label>
              <input 
                v-model="languageForm.country" 
                placeholder="e.g. United States, France..." 
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                @keyup.enter="saveLanguage"
              />
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button 
              @click="showLanguageModal = false" 
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button 
              @click="saveLanguage" 
              :disabled="!languageForm.name"
              :class="[
                'px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95',
                languageForm.name ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
              ]"
            >
              {{ editingLanguage ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getLanguages, createLanguage, updateLanguage, deleteLanguage } from '@/services/Api/language';
import { getBooks } from '@/services/Api/book';

// ---------- Reactive States ----------
const books = ref([]);
const allLanguages = ref([]);
const loading = ref({ books: false, languages: false });
const error = ref(null);

const selectedLanguage = ref(null);
const showAllLanguages = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');

const showLanguageModal = ref(false);
const editingLanguage = ref(null);
const languageForm = ref({ name: '', country: '' });

// ---------- Helper Constants ----------
const placeholderImage = 'https://via.placeholder.com/200x300?text=No+Image';

// ---------- Lifecycle ----------
let isMounted = true;
onUnmounted(() => { isMounted = false; });

onMounted(() => {
  selectedLanguage.value = null;
  searchQuery.value = '';
  selectedCategory.value = '';
  fetchInitialData();
});

// ---------- Fetch Functions ----------
const fetchInitialData = async (retries = 3) => {
  try {
    loading.value.books = true;
    loading.value.languages = true;

    const [booksRes, languagesRes] = await Promise.all([
      getBooks().catch(() => ({ data: [] })),
      getLanguages().catch(() => ({ data: [] }))
    ]);

    if (!isMounted) return;

    books.value = Array.isArray(booksRes?.data) ? booksRes.data : [];
    allLanguages.value = Array.isArray(languagesRes?.data) ? languagesRes.data : [];

  } catch (err) {
    if (retries > 0) {
      setTimeout(() => fetchInitialData(retries - 1), 1000);
    } else {
      error.value = 'Failed to load data after multiple attempts. Please try again later.';
      books.value = [];
      allLanguages.value = [];
    }
  } finally {
    if (isMounted) {
      loading.value.books = false;
      loading.value.languages = false;
    }
  }
};

// ---------- Computed Properties ----------
const categories = computed(() => {
  if (!Array.isArray(books.value)) return [];
  return [...new Set(books.value.map(b => b?.category).filter(cat => cat))].sort();
});

const languages = computed(() => {
  if (!Array.isArray(allLanguages.value)) return [];
  return allLanguages.value.map(lang => ({
    id: lang?.id,
    name: lang?.name || 'Unknown Language',
    country: lang?.country,
    count: Array.isArray(books.value) ? books.value.filter(b => b?.language === lang?.name).length : 0,
    books: Array.isArray(books.value) ? books.value.filter(b => b?.language === lang?.name) : []
  })).sort((a, b) => b.count - a.count);
});

const displayedLanguages = computed(() => {
  if (!Array.isArray(languages.value)) return [];
  return showAllLanguages.value ? languages.value : languages.value.slice(0, 5);
});

// ---------- Book Filtering ----------
const filterBook = (book) => {
  const bookCategory = book?.category?.toLowerCase() || '';
  const bookTitle = book?.title?.toLowerCase() || '';
  const searchTerm = searchQuery.value.toLowerCase();
  const selectedCat = selectedCategory.value?.toLowerCase();

  const matchesCategory = !selectedCat || bookCategory === selectedCat;
  const matchesSearch = !searchQuery.value || bookTitle.includes(searchTerm) || bookCategory.includes(searchTerm);

  return matchesCategory && matchesSearch;
};

const filteredBooks = computed(() => {
  if (!Array.isArray(books.value)) return [];
  if (selectedLanguage.value) {
    const selectedLang = languages.value.find(l => l.name === selectedLanguage.value);
    return selectedLang ? selectedLang.books.filter(filterBook) : [];
  }
  return books.value.filter(filterBook);
});

// ---------- Language Modal ----------
const openLanguageModal = (lang = null) => {
  editingLanguage.value = lang;
  languageForm.value = lang ? { ...lang } : { name: '', country: '' };
  showLanguageModal.value = true;
};

// ---------- CRUD Operations ----------
const saveLanguage = async () => {
  if (!languageForm.value.name) return;

  try {
    if (editingLanguage.value) {
      const response = await updateLanguage(editingLanguage.value.id, languageForm.value);
      const index = allLanguages.value.findIndex(l => l?.id === editingLanguage.value?.id);
      if (index !== -1) allLanguages.value[index] = response.data;
    } else {
      const response = await createLanguage(languageForm.value);
      allLanguages.value = [response.data, ...allLanguages.value];
    }

    showLanguageModal.value = false;
    showAllLanguages.value = true;
    editingLanguage.value = null;
    languageForm.value = { name: '', country: '' };

  } catch (err) {
    error.value = 'Failed to save language. Please try again.';
    console.error(err);
  }
};

const removeLanguage = async (id) => {
  if (!confirm('Are you sure you want to delete this language?')) return;

  try {
    const deletedLang = allLanguages.value.find(l => l?.id === id)?.name;
    await deleteLanguage(id);
    allLanguages.value = allLanguages.value.filter(l => l?.id !== id);

    if (selectedLanguage.value === deletedLang) selectedLanguage.value = null;

  } catch (err) {
    error.value = 'Failed to delete language. Please try again.';
    console.error(err);
  }
};

// ---------- Image Error Handler ----------
const handleImageError = (e) => {
  e.target.src = placeholderImage;
  if (!e.target.classList.contains('opacity-70')) e.target.classList.add('opacity-70');
};
</script>


<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>