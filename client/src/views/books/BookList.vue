<template>
  <div class="bg-gray-100 sticky min-h-screen">
    <Notification :notification="notification" />

    <div class="max-w-7xl mx-auto px-8 sm:px-6 lg:px-1 py-8 space-y-2 flex flex-col gap-4">
      <!-- Header -->
      <div class="bg-gradient-to-b from-[#065084] to-[#3D74B6] rounded-2xl mx-6 overflow-hidden relative shadow-lg">
        <BookManagerHeader />
      </div>

      <!-- Book Overview Stats -->
      <div class="px-6 mt-6 mb-8">
        <BookStatsCards :total-books="totalBooks" :available-books="availableBooks"
          :unavailable-books="unavailableBooks" :categories="categories" />
      </div>

      <!-- Main Content -->
      <div class="px-6 mb-6">
        <Collection :categories="categories" :languages="languages" @add-by-form="handleAddByForm"
          @add-by-import="handleAddByImport" @update:search="searchQuery = $event"
          @update:category="selectedCategory = $event" @update:status="onStatusChange"
          @update:language="selectedLanguage = $event" />
      </div>

      <!-- Book Cards -->
      <div class="px-6 pb-10">
        <div class="grid gap-4">
          <div v-for="book in filteredBooks" :key="book.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer"
            @click="viewBook(book)">
            <div class="p-4">
              <div class="flex items-start gap-8">
                <!-- Book Cover -->
                <div class="flex-shrink-0">
                  <div v-if="book.cover_image_url && imageCache[book.id]" class="w-20 h-28 shadow-md">
                    <img :src="imageCache[book.id]" :alt="book.title" :title="book.title"
                      :key="`${book.id}-${book.cover_image_url}`"
                      class="w-full h-full rounded-lg object-cover transition-transform duration-300 hover:scale-105 image-no-flicker"
                      :class="{ 'opacity-50': loadingImages[book.id] }"
                      @error="handleImageError($event, book.id)" @load="handleImageLoad(book.id)" />
                  </div>
                  <div v-else
                    class="w-20 h-28 rounded-lg shadow-md bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center image-no-flicker">
                    <span class="text-2xl font-bold text-gray-600">
                      {{ book.title ? book.title.charAt(0).toUpperCase() : 'N/A' }}
                    </span>
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
                        {{ book.description && book.description.length > 180 ? book.description.slice(0, 70) + ' ...' :
                          book.description || 'N/A' }}
                      </p>
                    </div>

                    <!-- Action Menu -->
                    <div class="relative ml-2" data-action-menu>
                      <button @click.stop="toggleActionMenu(book.id)"
                        class="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg class="w-6 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                      <Transition name="fade-slide">
                        <div v-if="openActionMenu === book.id"
                          class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                          <div class="py-2">
                            <button @click.stop="openForm(book)"
                              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button @click.stop="confirmDeleteBook(book.id)"
                              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                      <span v-if="book.category?.name"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ book.category.name }}
                      </span>
                      <span v-if="book.language?.name"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-gray-800">
                        {{ book.language.name }}
                      </span>
                    </div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-300"
                      :class="{
                        'bg-green-100 text-green-800': getBookStatus(book.quantity) === 'available',
                        'bg-yellow-100 text-yellow-800': getBookStatus(book.quantity) === 'limited',
                        'bg-red-100 text-red-800': getBookStatus(book.quantity) === 'unavailable'
                      }">
                      <div class="w-1.5 h-1.5 rounded-full mr-1.5 transition-colors duration-300" :class="{
                        'bg-green-400': getBookStatus(book.quantity) === 'available',
                        'bg-yellow-400': getBookStatus(book.quantity) === 'limited',
                        'bg-red-400': getBookStatus(book.quantity) === 'unavailable'
                      }"></div>
                      {{ getBookStatus(book.quantity).charAt(0).toUpperCase() + getBookStatus(book.quantity).slice(1) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredBooks.length === 0" class="text-center py-12">
            <EmptyState title="No Results" message="No books match your criteria" buttonText="Add New Book"
              @add-book="handleAddByForm" />
          </div>
        </div>
      </div>

      <!-- Book Detail Modal -->
      <div v-if="showDetail" class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
        <BookDetail :selected-book="selectedBook" :book-cover="bookCover" :book-title="bookTitle"
          :book-description="bookDescription" :category-name="categoryName" :language-name="languageName"
          :author-name="authorName" :author-biography="authorBiography" :author-nationality="authorNationality"
          :formatted-birth-date="formattedBirthDate" :show-full-image="showFullImage" @edit-book="handleEditBook"
          @close-detail="closeDetail" @open-full-image="openFullImage" @close-full-image="closeFullImage" />
      </div>

      <!-- Book Form -->
      <div style="position: absolute; top: 100px; width: 100%; z-index: 1000;">
        <BookForm :show-form="showForm" :form="form" :authors="authors" :categories="categories" :languages="languages"
          :preview-image="previewImage" @close-form="closeForm" @submit-form="submitForm" @handle-file="handleFile"
          @author-updated="handleAuthorUpdate" @category-updated="handleCategoryUpdate"
          @update-form="handleFormUpdate" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import Swal from 'sweetalert2';
import BookForm from '@/components/books/BookForm.vue';
import BookManagerHeader from '@/components/books/headers/BookManagerHeader.vue';
import BookStatsCards from '@/components/books/stats/BookStatsCards.vue';
import Collection from '@/components/books/MainContent/Collection.vue';
import BookDetail from '@/components/books/BookDetail/collection.vue';
import Notification from '@/components/books/Notification/Notification.vue';
import EmptyState from '@/components/books/EmptyState.vue';
import { getBooks, getCategories, getLanguages, getAuthors, createBook as apiCreateBook, updateBook, deleteBook } from '@/services/Api/book';

// Reactive State
const books = ref([]);
const authors = reactive([]);
const categories = reactive([]);
const languages = reactive([]);
const showForm = ref(false);
const showDetail = ref(false);
const showFullImage = ref(false);
const openActionMenu = ref(null);
const selectedBook = ref(null);
const form = ref({});
const imageFile = ref(null);
const previewImage = ref(null);
const updateFromDetail = ref(false);
const imageCache = ref({});
const loadingImages = ref({}); // Track loading state per book

const notification = ref({
  visible: false,
  message: '',
  type: '',
});

const showDropdown = ref(false);
const showImportModal = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedLanguage = ref('');
const filterType = ref('all');

// Computed Properties
const totalBooks = computed(() => books.value.length);
const availableBooks = computed(() => books.value.filter(book => getBookStatus(book.quantity) === 'available').length);
const unavailableBooks = computed(() => books.value.filter(book => {
  const status = getBookStatus(book.quantity);
  return status === 'limited' || status === 'unavailable';
}).length);

const bookTitle = computed(() => selectedBook.value?.title || 'N/A');
const bookDescription = computed(() => selectedBook.value?.description || 'No description available');
const bookCover = computed(() => imageCache.value[selectedBook.value?.id] || selectedBook.value?.cover_image_url || '/path/to/fallback-image.jpg');
const authorName = computed(() => selectedBook.value?.author?.name || 'N/A');
const authorBiography = computed(() => selectedBook.value?.author?.biography || 'No biography available');
const authorNationality = computed(() => selectedBook.value?.author?.nationality || 'N/A');
const categoryName = computed(() => selectedBook.value?.category?.name || 'N/A');
const languageName = computed(() => selectedBook.value?.language?.name || 'N/A');
const formattedBirthDate = computed(() => selectedBook.value?.author?.birth_date
  ? new Date(selectedBook.value.author.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  : 'N/A'
);

// Filtered Books
const filteredBooks = computed(() => {
  let filtered = books.value;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      book =>
        book.title?.toLowerCase().includes(q) ||
        book.author?.name?.toLowerCase().includes(q) ||
        book.isbn?.toLowerCase().includes(q)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(
      book => book.category?.name.toLowerCase() === selectedCategory.value.toLowerCase()
    );
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter(
      book => book.language?.name.toLowerCase() === selectedLanguage.value.toLowerCase()
    );
  }

  switch (filterType.value) {
    case 'new':
      return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    case 'available':
      return filtered.filter(book => getBookStatus(book.quantity) === 'available');
    case 'limited':
      return filtered.filter(book => getBookStatus(book.quantity) === 'limited');
    case 'unavailable':
      return filtered.filter(book => getBookStatus(book.quantity) === 'unavailable');
    default:
      return filtered;
  }
});

// Utility Functions
const getRelationalData = (book) => ({
  author: authors.find(a => a.id === book.AuthorId) || { name: 'Unknown Author' },
  category: categories.find(c => c.id === book.CategoryId) || { name: 'Unknown Category' },
  language: languages.find(l => l.id === book.language_id) || { name: 'Unknown Language' },
});

const getBookStatus = (quantity) => {
  const qty = Number(quantity);
  if (qty >= 2) return 'available';
  if (qty === 1) return 'limited';
  return 'unavailable';
};

const showNotification = (message, type) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => {
    notification.value.visible = false;
  }, 3000);
};

// Image Preloading
const preloadImage = (url, bookId) => {
  if (!url || imageCache.value[bookId]) return;
  loadingImages.value[bookId] = true;
  const img = new Image();
  img.src = url;
  img.onload = () => {
    imageCache.value[bookId] = url;
    loadingImages.value[bookId] = false;
    console.log(`Image preloaded for book ${bookId}: ${url}`);
  };
  img.onerror = () => {
    imageCache.value[bookId] = '/path/to/fallback-image.jpg';
    loadingImages.value[bookId] = false;
    console.warn(`Failed to preload image for book ${bookId}: ${url}`);
  };
};

// Event Handlers
const handleImageLoad = (bookId) => {
  loadingImages.value[bookId] = false;
  console.log(`Image loaded for book ${bookId}`);
};

const handleImageError = (event, bookId) => {
  console.warn(`Failed to load image for book ${bookId}`);
  event.target.src = '/path/to/fallback-image.jpg';
  imageCache.value[bookId] = '/path/to/fallback-image.jpg';
  loadingImages.value[bookId] = false;
};

const toggleActionMenu = (id) => {
  openActionMenu.value = openActionMenu.value === id ? null : id;
};

const handleActionMenuClickOutside = (event) => {
  const actionMenus = document.querySelectorAll('[data-action-menu]');
  let clickedInside = false;
  actionMenus.forEach(menu => {
    if (menu.contains(event.target)) {
      clickedInside = true;
    }
  });
  if (!clickedInside) {
    openActionMenu.value = null;
  }
};

const handleDropdownClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showDropdown.value = false;
  }
};

const handleAddByForm = () => {
  showDropdown.value = false;
  openForm();
};

const handleAddByImport = () => {
  showDropdown.value = false;
  showImportModal.value = true;
};

const viewBook = (book) => {
  console.log('Viewing book:', book);
  selectedBook.value = { ...book, ...getRelationalData(book) };
  if (book.cover_image_url) {
    preloadImage(book.cover_image_url, book.id);
  } else {
    imageCache.value[book.id] = '/path/to/fallback-image.jpg';
  }
  showDetail.value = true;
  openActionMenu.value = null;
  updateFromDetail.value = false;
};

const closeDetail = () => {
  console.log('Closing detail modal, showDetail:', showDetail.value);
  showDetail.value = false;
  selectedBook.value = null;
  showFullImage.value = false;
};

const openFullImage = () => {
  console.log('Opening full image');
  showFullImage.value = true;
};

const closeFullImage = () => {
  console.log('Closing full image');
  showFullImage.value = false;
};

const handleEditBook = (book) => {
  console.log('Editing book:', book);
  closeDetail();
  openForm(book);
  updateFromDetail.value = true;
};

const openForm = (book = null) => {
  console.log('Opening form with book:', book);
  showForm.value = true;
  previewImage.value = null;
  openActionMenu.value = null;

  if (book) {
    form.value = {
      ...book,
      AuthorId: book.AuthorId,
      CategoryId: book.CategoryId,
      language_id: book.language_id,
    };
    previewImage.value = book.cover_image_url;
  } else {
    form.value = {
      title: '',
      isbn: '',
      quantity: 4,
      cover_image: '',
      donated_by: '',
      public_year: new Date().getFullYear(),
      description: '',
      available: true,
      AuthorId: '',
      CategoryId: '',
      language_id: '',
    };
  }
  imageFile.value = null;
};

const closeForm = () => {
  console.log('Closing form');
  showForm.value = false;
  form.value = {};
  imageFile.value = null;
  previewImage.value = null;
};

const handleFile = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    previewImage.value = URL.createObjectURL(file);
  } else {
    imageFile.value = null;
    previewImage.value = form.value.cover_image_url || null;
  }
};

const handleAuthorUpdate = (updatedAuthor) => {
  const index = authors.findIndex(a => a.id === updatedAuthor.id);
  if (index !== -1) {
    authors.splice(index, 1, updatedAuthor);
  } else {
    authors.push(updatedAuthor);
  }
  localStorage.setItem('authors', JSON.stringify(authors));
  if (selectedBook.value && selectedBook.value.AuthorId === updatedAuthor.id) {
    selectedBook.value = {
      ...selectedBook.value,
      author: updatedAuthor,
    };
  }
};

const handleCategoryUpdate = (updatedCategory) => {
  const index = categories.findIndex(c => c.id === updatedCategory.id);
  if (index !== -1) {
    categories.splice(index, 1, updatedCategory);
  } else {
    categories.push(updatedCategory);
  }
  localStorage.setItem('categories', JSON.stringify(categories));
  if (selectedBook.value && selectedBook.value.CategoryId === updatedCategory.id) {
    selectedBook.value = {
      ...selectedBook.value,
      category: updatedCategory,
    };
  }
};

const handleFormUpdate = (updates) => {
  form.value = { ...form.value, ...updates };
};

const confirmDeleteBook = async (bookId) => {
  console.log('Confirming deletion for book ID:', bookId);
  const result = await Swal.fire({
    title: 'Confirm Deletion',
    text: 'Are you sure you want to delete this book record? This action cannot be undone.',
    icon: 'warning',
    iconColor: '#f87171',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-xl shadow-lg bg-white p-6',
      title: 'text-lg font-semibold text-gray-900',
      htmlContainer: 'text-sm text-gray-600 mt-1 leading-tight',
      confirmButton: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium',
      cancelButton: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium mr-4',
      icon: 'animate-pulse',
      actions: 'mt-3 flex justify-end gap-2',
    },
  });

  if (result.isConfirmed) {
    console.log('Emitting deleteBookById with ID:', bookId);
    deleteBookById(bookId);
  }
};

const deleteBookById = async (id) => {
  try {
    await deleteBook(id);
    books.value = books.value.filter(book => book.id !== id);
    delete imageCache.value[id];
    delete loadingImages.value[id];
    showNotification('Deleted!', 'success');
  } catch (err) {
    console.error('Error deleting book:', err, err.response?.data);
    showNotification(err.response?.data?.message || 'Failed to delete the book.', 'error');
  }
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    for (const key in form.value) {
      if (form.value[key] !== null && form.value[key] !== undefined && form.value[key] !== '') {
        formData.append(key, form.value[key]);
      }
    }

    if (imageFile.value) {
      formData.append('cover_image', imageFile.value);
    } else {
      console.log('No cover image provided; proceeding without image.');
    }

    console.log('FormData entries:', [...formData.entries()]);

    let bookWithRelations;
    if (form.value.id) {
      const res = await updateBook(form.value.id, formData);
      const updatedBook = res.data.book;
      console.log('Update response:', updatedBook);
      bookWithRelations = {
        ...updatedBook,
        cover_image_url: updatedBook.cover_image_url || null,
        ...getRelationalData(updatedBook),
      };

      const index = books.value.findIndex(book => book.id === form.value.id);
      if (index !== -1) {
        books.value[index] = bookWithRelations;
        if (bookWithRelations.cover_image_url) {
          preloadImage(bookWithRelations.cover_image_url, form.value.id);
        } else {
          imageCache.value[form.value.id] = '/path/to/fallback-image.jpg';
        }
      }

      if (updateFromDetail.value) {
        selectedBook.value = bookWithRelations;
        showDetail.value = true;
      }

      showNotification('The book has been updated successfully.', 'success');
    } else {
      const res = await apiCreateBook(formData);
      const newBook = res.data.book;
      console.log('Create response:', newBook);
      bookWithRelations = {
        ...newBook,
        cover_image_url: newBook.cover_image_url || null,
        ...getRelationalData(newBook),
      };

      books.value.unshift(bookWithRelations);
      if (bookWithRelations.cover_image_url) {
        preloadImage(bookWithRelations.cover_image_url, newBook.id);
      } else {
        imageCache.value[newBook.id] = '/path/to/fallback-image.jpg';
      }
      showNotification('The book has been added successfully.', 'success');
    }

    setTimeout(() => {
      closeForm();
    }, 500);
  } catch (err) {
    console.error('Error submitting form:', err, err.response?.data);
    const errorMessage = err.response?.data?.message || 'Failed to save book. Please check the form and try again.';
    showNotification(errorMessage, 'error');
  }
};

const onStatusChange = (status) => {
  filterType.value = status;
};

// Fetch Data
const fetchBooks = async () => {
  try {
    const [booksRes, authorsRes, categoriesRes, languagesRes] = await Promise.all([
      getBooks(),
      getAuthors(),
      getCategories(),
      getLanguages(),
    ]);
    books.value = booksRes.data.books.map(book => {
      if (book.cover_image_url) {
        preloadImage(book.cover_image_url, book.id);
      } else {
        imageCache.value[book.id] = '/path/to/fallback-image.jpg';
      }
      return book;
    });
    authors.splice(0, authors.length, ...authorsRes.data);
    categories.splice(0, categories.length, ...categoriesRes.data);
    languages.splice(0, languages.length, ...languagesRes.data);
    localStorage.setItem('authors', JSON.stringify(authors));
    localStorage.setItem('categories', JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to fetch data:', err);
    const cachedAuthors = localStorage.getItem('authors');
    const cachedCategories = localStorage.getItem('categories');
    if (cachedAuthors) {
      authors.splice(0, authors.length, ...JSON.parse(cachedAuthors));
    }
    if (cachedCategories) {
      categories.splice(0, categories.length, ...JSON.parse(cachedCategories));
    }
    showNotification('Failed to fetch data. Please try again later.', 'error');
  }
};

// ESC Key Handler
const handleEsc = (event) => {
  if (event.key === 'Escape') {
    if (showDetail.value) {
      closeDetail();
    } else if (showForm.value) {
      closeForm();
    }
    openActionMenu.value = null;
    showDropdown.value = false;
    showImportModal.value = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchBooks();
  const clickHandler = (event) => {
    handleActionMenuClickOutside(event);
    handleDropdownClickOutside(event);
  };
  window.addEventListener('click', clickHandler);
  window.addEventListener('keydown', handleEsc);
  console.log('Mounted: ESC key listener added');
});

onBeforeUnmount(() => {
  const clickHandler = (event) => {
    handleActionMenuClickOutside(event);
    handleDropdownClickOutside(event);
  };
  window.removeEventListener('click', clickHandler);
  window.removeEventListener('keydown', handleEsc);
  console.log('Unmounted: ESC key listener removed');
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.image-no-flicker {
  image-rendering: optimizeQuality;
  will-change: transform;
  width: 80px;
  height: 112px; /* Fixed height to match image dimensions */
  background-color: #f0f0f0; /* Placeholder background */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>