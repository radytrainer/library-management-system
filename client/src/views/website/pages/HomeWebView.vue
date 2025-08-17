<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-8">
          <div class="inline-block">
            <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-sm font-semibold tracking-wide uppercase">
              Digital Knowledge Hub
            </span>
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight">
            Welcome to Our Online Library!
          </h1>
          <p class="text-gray-600 text-xl leading-relaxed max-w-lg">
            Discover a world of knowledge and imagination at your fingertips. Our digital library offers a wide
            selection of books across various categories, available anytime, anywhere. Whether you're looking to learn,
            explore, or simply enjoy a good story, our collection is here to support your journey. Start reading today
            and be part of a growing community of passionate learners and readers.
          </p>
          <div class="flex gap-4">
            <button class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              Start Reading
            </button>
            <button class="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-300">
              Browse Collection
            </button>
          </div>
        </div>

        <!-- Right Slideshow -->
        <div class="relative flex justify-center items-center">
          <div class="relative w-full max-w-[420px] h-[520px] rounded-3xl overflow-hidden shadow-2xl slideshow-container bg-white/20 backdrop-blur-sm border border-white/30">
            <!-- Slideshow Images -->
            <div v-for="(cover_image_url, index) in slideshowImages" :key="index"
              class="absolute inset-0 transition-all duration-1000 ease-in-out"
              :class="{ 'opacity-100 scale-100': currentImageIndex === index, 'opacity-0 scale-110': currentImageIndex !== index }">
              <img :src="cover_image_url" :alt="'Slide ' + (index + 1)" class="w-full h-full object-cover" />
              <!-- Caption Overlay -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white p-6">
                <p class="text-lg font-semibold">{{ slideCaptions[index] }}</p>
              </div>
            </div>

            <!-- Navigation Arrows -->
            <button @click="prevSlide"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Previous slide">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button @click="nextSlide"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Next slide">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Slide Indicators -->
            <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button v-for="(_, index) in slideshowImages" :key="index" @click="currentImageIndex = index"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="currentImageIndex === index ? 'bg-white w-8' : 'bg-white/50'">
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Newest Books Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Newest Books Just Added
        </h2>
        <p class="text-gray-600 text-lg max-w-3xl mx-auto">
          Check out the newest books just added to our library! From inspiring stories to informative reads, these fresh titles are ready for you to explore today.
        </p>
      </div>

      <!-- Book Cards Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div class="book-card group" v-for="(book, index) in latestTenBooks" :key="book.id || index">
          <div class="book-cover-container">
            <img :src="book.cover_image_url || ''" :alt="book.title" class="book-cover" />
            <div class="book-overlay">
              <button class="read-btn">Read Now</button>
            </div>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author?.name || 'Unknown Author' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
        <h2 class="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Why Choose Our Online Library?
        </h2>
        <p class="text-center text-gray-600 mb-12 text-lg">Experience the future of reading with our innovative platform</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="feature-card group">
            <div class="feature-icon bg-gradient-to-br from-indigo-500 to-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><g fill="none"><path fill="url(#SVGEm3qYdaJ)" d="M5 19h15.281S20 19.5 20 20s.281 1 .281 1H6a1 1 0 0 1-1-1z"/><path fill="url(#SVGSyoMhcka)" d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5z"/><path fill="url(#SVGmCy1DcKB)" d="M7 6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"/><defs><linearGradient id="SVGEm3qYdaJ" x1="12.174" x2="12.174" y1="20.4" y2="18" gradientUnits="userSpaceOnUse"><stop stop-color="#9deaff"/><stop offset=".716" stop-color="#58aafe"/></linearGradient><linearGradient id="SVGSyoMhcka" x1="9.693" x2="12.681" y1="5.742" y2="27.308" gradientUnits="userSpaceOnUse"><stop stop-color="#20ac9d"/><stop offset="1" stop-color="#2052cb"/></linearGradient><linearGradient id="SVGmCy1DcKB" x1="10.449" x2="15.053" y1="4.314" y2="11.478" gradientUnits="userSpaceOnUse"><stop stop-color="#9ff0f9"/><stop offset="1" stop-color="#6ce0ff"/></linearGradient></defs></g></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Massive Collection</h3>
            <p class="text-gray-600 leading-relaxed">
              Thousands of books in all genres and topics, updated regularly to keep your curiosity alive.
            </p>
          </div>
          
          <div class="feature-card group">
            <div class="feature-icon bg-gradient-to-br from-purple-500 to-pink-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 512 512"><mask id="SVGuywqVbel"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#SVGuywqVbel)"><path fill="#0052b4" d="M0 0h512v512H0z"/><path fill="#eee" d="M302.7 233.7a103.1 103.1 0 0 0 0 206a103.1 103.1 0 0 0 0-206m0 20c46 0 83 37 83 83s-37 83-83 83s-83-37-83-83s37-83 83-83"/><path fill="#eee" d="M209.4 72.3a103.1 103.1 0 0 0 0 206a103.1 103.1 0 0 0 0-206m0 20c46 0 83 37 83 83s-37 83-83 83s-83-37-83-83s37-83 83-83"/><path fill="#eee" d="M302.7 72.3a103.1 103.1 0 0 0 0 206a103.1 103.1 0 0 0 0-206m0 20c46 0 83 37 83 83s-37 83-83 83s-83-37-83-83s37-83 83-83"/><path fill="#eee" d="M349.2 153a103.1 103.1 0 0 0 0 206a103.1 103.1 0 0 0 0-206m0 20c46 0 83 37 83 83s-37 83-83 83s-83-37-83-83s37-83 83-83"/><path fill="#eee" d="M209.4 233.7a103.1 103.1 0 0 0 0 206a103.1 103.1 0 0 0 0-206m0 20c46 0 83 37 83 83s-37 83-83 83s-83-37-83-83s37-83 83-83"/><path fill="#eee" d="M162.8 153a103.1 103.1 0 0 0 0 206a103.1 103.1 0 0 0 0-206m0 20c46 0 83 37 83 83s-37 83-83 83s-83-37-83-83s37-83 83-83"/><path fill="#eee" d="M256 153.1a103.1 103.1 0 0 0 0 206a103.1 103.1 0 0 0 0-206m0 20c46 0 83 37 83 83c0 45.9-37 83-83 83s-83-37.1-83-83c0-46 37-83 83-83"/></g></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Access Anywhere</h3>
            <p class="text-gray-600 leading-relaxed">
              Read on your phone, tablet, or laptop anytime, even offline with our downloadable books.
            </p>
          </div>
          
          <div class="feature-card group">
            <div class="feature-icon bg-gradient-to-br from-pink-500 to-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 128 128"><ellipse cx="64" cy="116.87" fill="#424242" rx="12.09" ry="7.13"/><path fill="#ffd600" d="M64 4C42.92 4 25.82 19.67 25.82 38.99c0 5.04 1.52 10.43 3.75 15.18c3.13 6.68 6.54 11.62 7.54 13.44c2.78 5.06 2.38 10.39 3.15 13.73c1.45 6.24 5.79 8.5 23.73 8.5s21.8-2.15 23.41-7.9c1.1-3.91.03-8.18 2.8-13.23c1-1.82 5.07-7.85 8.21-14.54c2.23-4.75 3.75-10.14 3.75-15.18C102.18 19.67 85.08 4 64 4"/><ellipse cx="64" cy="86.13" fill="#b26500" rx="21.94" ry="4.46"/><ellipse cx="64" cy="86.13" fill="#b26500" rx="21.94" ry="4.46"/><ellipse cx="64" cy="86.13" fill="#ffa000" rx="15.99" ry="2.06"/><g fill="none" stroke-miterlimit="10" stroke-width="2"><path stroke="#b26500" d="M53.3 56.77c-.62 1.56-2.23 4.77-1.39 6.21c1.95 3.35 6.6 4.55 6.6 7.63c0 4.7-3.42 19.93-3.42 19.93m18.94-34.33s2.24 4.8 1.29 6.95c-.71 1.6-4.98 4.18-5.53 4.61c-2.55 2 .84 22.78.84 22.78"/><path stroke="#fff" d="M53.3 56.77c3.44-6.8 5.21-22.32.84-21.53c-7.37 1.33 1.71 26.83 6.18 23.9s10.01-23.85 3.21-23.93s.46 26.66 5.08 23.69c3.65-2.35 12.56-23.66 5.24-23.66c-6.23 0 .19 20.97.19 20.97"/></g><path fill="#82aec0" d="M85.89 87.06S80.13 89.84 64 89.84s-21.89-2.78-21.89-2.78s-.36 5.14.83 7.47c1.43 2.8 2.53 3.77 2.53 3.77l.6 2.85l-.24.75c-.31.98-.09 2.06.6 2.83l.52.58l.58 2.74l-.2.55c-.38 1.05-.12 2.22.66 3.02l.38.39l.47 2.24s2.38 5.08 15.16 5.08s15.16-5.08 15.16-5.08l.04-.19l.26-.26c.52-.51.69-1.27.44-1.95l-.15-.39l.62-2.96l1.09-1.15c.54-.57.66-1.41.31-2.11l-.5-.99l.63-2.97l.4-.31c.59-.65.6-1.63.34-2.3c-.2-.53-.04-1.13.37-1.52c.63-.6 1.44-1.51 2.04-2.64c1.23-2.29.84-7.45.84-7.45"/><path fill="#2f7889" d="m45.47 98.3l.54 2.87c5.82-.03 13.59.26 28.5-2.11c2.69-.61 5.92-1.82 2.35-1.32c0-.01-13.69 1.3-31.39.56m2 9.77c6.44-.11 19.6-.75 33.74-3.82l.63-2.97c-14.79 3.36-28.7 3.96-34.95 4.04zm32.84.42c-13.09 2.84-25.34 3.57-31.97 3.73l.43 2.04s.21 6.33 15.16 6.33s15.16-6.33 15.16-6.33s-6.38 1.82-14.23.93a.63.63 0 0 1-.01-1.26c4.69-.62 10.29-1.54 14.84-2.48z"/><path fill="none" stroke="#82aec0" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3.997" d="M42.18 87.06s6.46 2.78 21.76 2.78s21.88-2.78 21.88-2.78"/><path fill="#ffff8d" d="M49.88 10.32c3.91-.96 8-.48 10.8 2.92c.79.96 1.4 2.1 1.54 3.34c.28 2.39-1.2 4.65-2.96 6.31c-5.02 4.74-12.15 7.04-15.39 13.58c-.76 1.53-1.36 3.18-2.52 4.43s-3.09 2.01-4.6 1.21c-.8-.42-1.35-1.21-1.8-2c-2.84-5.06-2.63-11.51-.13-16.75c2.75-5.74 8.78-11.5 15.06-13.04"/><path fill="#ffd600" d="M46.45 91.93c-.88-.4-.53-1.72.43-1.65c3.22.25 8.7.56 15.95.56c7.64 0 14.36-.57 18.28-.99c.97-.1 1.34 1.23.45 1.64c-3.02 1.42-8.55 3.04-18.03 3.04c-9.25 0-14.35-1.37-17.08-2.6"/><path fill="#94d1e0" d="M51.94 102.03c-.67.24-1.36.57-1.7 1.19c-.12.23-.19.49-.14.75c.08.38.43.65.78.82c.7.34 1.49.43 2.26.44c1.59.02 3.17-.28 4.74-.58c.47-.09.95-.18 1.37-.41s.78-.62.85-1.09c.1-.63-.35-1.24-.9-1.54c-1.9-1.05-5.34-.27-7.26.42m1.49 6.59c-.67.24-1.36.57-1.7 1.19c-.12.23-.19.49-.14.75c.08.38.43.65.78.82c.7.34 1.49.43 2.26.44c1.59.02 3.17-.28 4.74-.58c.47-.09.95-.18 1.37-.41s.78-.62.85-1.09c.1-.63-.35-1.24-.9-1.54c-1.9-1.04-5.35-.26-7.26.42"/><path fill="#ffff8d" d="M50.01 84.2c.91.09 1.87.01 2.64-.48s1.26-1.49.95-2.35c-.16-.45-.51-.81-.85-1.15c-.75-.74-1.5-1.48-2.24-2.22c-.83-.83-1.66-1.65-2.56-2.4c-1.39-1.16-3.26-2.25-5.09-1.4c-1.56.72-1.93 2.14-1.24 3.63c1.47 3.13 4.89 6.01 8.39 6.37"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Learning Support</h3>
            <p class="text-gray-600 leading-relaxed">
              Curated recommendations, summaries, and community discussions to help you learn faster and deeper.
            </p>
          </div>
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
  slideshowInterval = setInterval(nextSlide, 4000)
})

onUnmounted(() => {
  if (slideshowInterval) clearInterval(slideshowInterval)
})
</script>

<style scoped>
/* Book Cards */
.book-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.book-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.book-cover-container {
  position: relative;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.book-card:hover .book-cover {
  transform: scale(1.1);
}

.read-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.read-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.book-info {
  padding: 1.25rem;
  text-align: center;
}

.book-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Slideshow Enhancements */
.slideshow-container {
  position: relative;
  overflow: hidden;
}

.slideshow-container img {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Feature Cards */
.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  background: white/40;
  backdrop-filter: blur(10px);
  border: 1px solid white/30;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover {
  transform: translateY(-5px);
  background: white/60;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .book-cover {
    height: 160px;
  }
  
  .slideshow-container {
    max-width: 350px;
    height: 450px;
  }
}

@media (max-width: 640px) {
  .slideshow-container {
    max-width: 300px;
    height: 400px;
  }
  
  .book-cover {
    height: 140px;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
  }
}

/* Focus states for accessibility */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

/* Smooth animations */
* {
  scroll-behavior: smooth;
}
</style>