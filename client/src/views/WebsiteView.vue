```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Left Navigation Links -->
          <div class="flex space-x-8">
            <a href="#" class="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">HOME</a>
            <a href="#" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">ABOUT</a>
            <a href="#" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">BOOK</a>
            <a href="#" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">DONATE</a>
            <a href="#" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">HISTORY</a>
          </div>

          <!-- Right Buttons -->
          <div class="flex space-x-4 items-center">
            <router-link to="/login" class="text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200">Login</router-link>
            <router-link to="/register" class="text-green-600 hover:text-green-800 border border-green-600 hover:border-green-800 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200">Register</router-link>
            <router-link to="/dashboard" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">Admin Dashboard</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-8">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            📚 Welcome to Our Online Library!
          </h1>
          <p class="text-gray-600 text-lg leading-relaxed max-w-md">
            Discover a world of knowledge and imagination at your fingertips. Our digital library offers a wide selection of books across various categories, available anytime, anywhere. Whether you’re looking to learn, explore, or simply enjoy a good story, our collection is here to support your journey. Start reading today and be part of a growing community of passionate learners and readers.
          </p>
        </div>

        <!-- Right Slideshow -->
        <div class="relative flex justify-center items-center">
          <div class="relative w-full max-w-[400px] h-[500px] rounded-lg overflow-hidden shadow-xl">
            <!-- Slideshow Images -->
            <div
              v-for="(image, index) in slideshowImages"
              :key="index"
              class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              :class="{ 'opacity-100': currentImageIndex === index, 'opacity-0': currentImageIndex !== index }"
            >
              <img
                :src="image"
                :alt="'Slide ' + (index + 1)"
                class="w-full h-full object-cover"
              />
              <!-- Caption Overlay -->
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <p class="text-sm font-medium">{{ slideCaptions[index] }}</p>
              </div>
            </div>
            <!-- Navigation Arrows -->
            <button
              @click="prevSlide"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200"
              aria-label="Previous slide"
            >
              <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              @click="nextSlide"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200"
              aria-label="Next slide"
            >
              <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <!-- Dots Navigation -->
            <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              <button
                v-for="(image, index) in slideshowImages"
                :key="index"
                @click="currentImageIndex = index"
                class="w-3 h-3 rounded-full transition-all duration-200"
                :class="currentImageIndex === index ? 'bg-white scale-125' : 'bg-gray-400 bg-opacity-50'"
                :aria-label="'Go to slide ' + (index + 1)"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book Cards Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="book-card" v-for="(book, index) in books" :key="index">
          <img :src="book.image" :alt="book.title" class="book-cover" />
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-bio">{{ book.bio }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Slideshow images and captions
const slideshowImages = [
  'https://m.media-amazon.com/images/I/81TaxLQto1L._UF1000,1000_QL80_.jpg',
  'https://i.pinimg.com/1200x/23/a3/bf/23a3bf29b87be4ccd52d41b3f9508d01.jpg',
  'https://i.pinimg.com/736x/3d/6e/68/3d6e68aeaada9cc92012b1559b3934a0.jpg',
  'https://i.pinimg.com/1200x/9b/98/82/9b98821112bf6264094356f24d01048a.jpg',
  'https://i.pinimg.com/1200x/d4/a0/c9/d4a0c977658a5bfd83d135407d23b503.jpg',
]

const slideCaptions = [
  'Explore Our Latest Bestseller!',
  'Journey Through Epic Tales',
  'Discover Hidden Gems',
  'Discover Our Featured Book!',
  'Uncover a Timeless Classic',
]

const currentImageIndex = ref(0)
let slideshowInterval = null

const nextSlide = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % slideshowImages.length
}

const prevSlide = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + slideshowImages.length) % slideshowImages.length
}

onMounted(() => {
  slideshowInterval = setInterval(nextSlide, 3000)
})

onUnmounted(() => {
  if (slideshowInterval) clearInterval(slideshowInterval)
})

// Book list
const books = [
  {
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=400&q=80',
    title: 'Adventure Awaits',
    bio: 'A thrilling tale of exploration in uncharted lands.',
  },
  {
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=400&q=80',
    title: 'Mystic Realms',
    bio: 'Dive into a world of magic and mystery.',
  },
  {
    image: 'https://images.unsplash.com/photo-1584473457403-ea0fcaa2f5b4?auto=format&fit=crop&w=400&q=80',
    title: 'Ocean\'s Secrets',
    bio: 'Uncover hidden truths beneath the waves.',
  },
  {
    image: 'https://images.unsplash.com/photo-1611486213043-68c64c0feaea?auto=format&fit=crop&w=400&q=80',
    title: 'Desert Quest',
    bio: 'A journey through sands to find ancient relics.',
  },
  {
    image: 'https://images.unsplash.com/photo-1563201515-8220f5b42a9e?auto=format&fit=crop&w=400&q=80',
    title: 'Starlight Saga',
    bio: 'An epic space odyssey across the galaxy.',
  },
]
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
```