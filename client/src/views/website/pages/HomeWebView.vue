<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-8">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to Our Online Library!
          </h1>
          <p class="text-gray-600 text-lg leading-relaxed max-w-md">
            Discover a world of knowledge and imagination at your fingertips. Our digital library offers a wide
            selection of books across various categories, available anytime, anywhere. Whether you’re looking to learn,
            explore, or simply enjoy a good story, our collection is here to support your journey. Start reading today
            and be part of a growing community of passionate learners and readers.
          </p>
        </div>

        <!-- Right Slideshow -->
        <div class="relative flex justify-center items-center">
          <div class="relative w-full max-w-[400px] h-[500px] rounded-lg overflow-hidden shadow-xl slideshow-container">
            <!-- Slideshow Images -->
            <div v-for="(cover_image_url, index) in slideshowImages" :key="index"
              class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              :class="{ 'opacity-100': currentImageIndex === index, 'opacity-0': currentImageIndex !== index }">
              <img :src="cover_image_url" :alt="'Slide ' + (index + 1)" class="w-full h-full object-cover" />
              <!-- Caption Overlay -->
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <p class="text-sm font-medium">{{ slideCaptions[index] }}</p>
              </div>
            </div>

            <!-- Navigation Arrows -->
            <button @click="prevSlide"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200"
              aria-label="Previous slide">
              <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button @click="nextSlide"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200"
              aria-label="Next slide">
              <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Newest Books Just Added</h2>
    <p class="text-gray-700 max-w-3xl">
      Check out the newest books just added to our library! From inspiring stories to informative reads, these fresh titles are ready for you to explore today.
    </p>


    </div>

    <!-- Book Cards Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="book-card" v-for="(book, index) in latestTenBooks" :key="book.id || index">
          <img :src="book.cover_image_url || ''" :alt="book.title" class="book-cover" />
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-bio">{{ book.author?.name || 'Unknown Author' }}</p>
        </div>
      </div>
    </div>

    <!-- Add more info for me that relate to library please -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-lg shadow-lg mt-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Online Library?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div class="space-y-4">
          <div
            class="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold">
            📚</div>
          <h3 class="text-xl font-semibold text-gray-800">Massive Collection</h3>
          <p class="text-gray-600 max-w-xs mx-auto">
            Thousands of books in all genres and topics, updated regularly to keep your curiosity alive.
          </p>
        </div>
        <div class="space-y-4">
          <div
            class="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold">
            🌐</div>
          <h3 class="text-xl font-semibold text-gray-800">Access Anywhere</h3>
          <p class="text-gray-600 max-w-xs mx-auto">
            Read on your phone, tablet, or laptop anytime, even offline with our downloadable books.
          </p>
        </div>
        <div class="space-y-4">
          <div
            class="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold">
            💡</div>
          <h3 class="text-xl font-semibold text-gray-800">Learning Support</h3>
          <p class="text-gray-600 max-w-xs mx-auto">
            Curated recommendations, summaries, and community discussions to help you learn faster and deeper.
          </p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getBooks, getCategories, getLanguages, getAuthors } from '@/services/Api/book'
import Swal from 'sweetalert2'

const slideshowImages = ref([])
const slideCaptions = ref([])

const currentImageIndex = ref(0)
let slideshowInterval = null

const books = ref([])
const authors = ref([])
const categories = ref([])
const languages = ref([])

const nextSlide = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % slideshowImages.value.length
}

const prevSlide = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + slideshowImages.value.length) % slideshowImages.value.length
}

const fetchBooks = async () => {
  try {
    const [booksRes, authorsRes, categoriesRes, languagesRes] = await Promise.all([
      getBooks(),
      getAuthors(),
      getCategories(),
      getLanguages(),
    ])

    books.value = booksRes.data.books || []
    authors.value = authorsRes.data || []
    categories.value = categoriesRes.data || []
    languages.value = languagesRes.data || []

    // Cache authors and categories
    localStorage.setItem('authors', JSON.stringify(authors.value))
    localStorage.setItem('categories', JSON.stringify(categories.value))

    // Use ALL books for slideshow
    slideshowImages.value = books.value.map(book => book.cover_image_url || '')
    slideCaptions.value = books.value.map(book => book.title || 'Featured Book')
  } catch (err) {
    console.error('Failed to fetch data:', err)

    // fallback to cached data
    const cachedAuthors = localStorage.getItem('authors')
    const cachedCategories = localStorage.getItem('categories')
    if (cachedAuthors) authors.value = JSON.parse(cachedAuthors)
    if (cachedCategories) categories.value = JSON.parse(cachedCategories)

    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Failed to fetch data',
      text: 'Please try again later.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
  }
}

// Computed: latest 10 books by created date descending
const latestTenBooks = computed(() => {
  // Assuming book has a 'created_at' or 'createdAt' date property (ISO string)
  return books.value
    .slice() // clone
    .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
    .slice(0, 10)
})

onMounted(() => {
  fetchBooks()
  slideshowInterval = setInterval(nextSlide, 3000)
})

onUnmounted(() => {
  if (slideshowInterval) clearInterval(slideshowInterval)
})
</script>

<style scoped>
.book-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 12px;
  transition: transform 0.2s ease;
  text-align: center;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}

.book-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.book-bio {
  font-size: 12px;
  color: #4b5563;
  line-height: 1.4;
}

/* Slideshow Enhancements */
.slideshow-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.slideshow-container img {
  transition: transform 0.5s ease;
}

.slideshow-container:hover img {
  transform: scale(1.05);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .book-card {
    padding: 8px;
  }

  .book-cover {
    height: 120px;
  }

  .book-title {
    font-size: 12px;
  }

  .book-bio {
    font-size: 10px;
  }

  .slideshow-container {
    max-width: 300px;
    height: 400px;
  }
}

@media (max-width: 640px) {
  .slideshow-container {
    max-width: 250px;
    height: 350px;
  }

  .slideshow-container .text-sm {
    font-size: 0.75rem;
  }
}
</style>