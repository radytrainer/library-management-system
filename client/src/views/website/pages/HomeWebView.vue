<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Hero Section with Slideshow -->
    <div class="relative h-screen overflow-hidden">
      <!-- Slideshow Images (Behind everything) -->
      <transition-group
        name="slide-fade"
        tag="div"
        class="absolute inset-0 w-full h-full"
      >
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          v-show="index === currentSlideIndex"
          class="absolute inset-0 w-full h-full"
        >
          <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
          <!-- Dark overlay for better text visibility -->
          <div class="absolute inset-0 bg-black opacity-40"></div>
        </div>
      </transition-group>

      <!-- Text Content (On top of images) -->
      <div
        class="relative z-10 flex items-center justify-center h-full text-center text-white px-4"
      >
        <div class="max-w-3xl mx-auto">
          <transition name="slide-fade" mode="out-in">
            <div :key="currentSlideIndex">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {{ slides[currentSlideIndex].title }}
              </h1>
              <p class="text-xl md:text-2xl mb-8">
                {{ slides[currentSlideIndex].description }}
              </p>
              <button
                class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
              >
                Explore Collection
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        @click="prevSlide"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-3 transition-all duration-200"
        aria-label="Previous slide"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        @click="nextSlide"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-3 transition-all duration-200"
        aria-label="Next slide"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <!-- Slide Indicators -->
      <div class="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-3">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="index === currentSlideIndex ? 'bg-white' : 'bg-white bg-opacity-50'"
          :aria-label="'Go to slide ' + (index + 1)"
        ></button>
      </div>
    </div>

    <!-- Additional content section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
        Why Choose Our Library?
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center p-6 bg-white rounded-lg shadow-md">
          <div class="text-4xl mb-4">📚</div>
          <h3 class="text-xl font-semibold mb-3">Extensive Collection</h3>
          <p class="text-gray-600">
            Thousands of books across all genres, constantly updated with new releases.
          </p>
        </div>
        <div class="text-center p-6 bg-white rounded-lg shadow-md">
          <div class="text-4xl mb-4">🌍</div>
          <h3 class="text-xl font-semibold mb-3">Access Anywhere</h3>
          <p class="text-gray-600">
            Read on any device, online or offline, at your convenience.
          </p>
        </div>
        <div class="text-center p-6 bg-white rounded-lg shadow-md">
          <div class="text-4xl mb-4">⭐</div>
          <h3 class="text-xl font-semibold mb-3">Curated Selection</h3>
          <p class="text-gray-600">
            Hand-picked recommendations from our expert librarians.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  name: "SlideshowHero",
  setup() {
    // Slideshow data
    const slides = ref([
      {
        id: 1,
        image: "https://i.pinimg.com/736x/5d/bd/d3/5dbdd38554063fc478d510d85d9f3114.jpg",
        title: "Classic Literature",
        description:
          "Explore timeless stories that have captivated readers for generations.",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        title: "Modern Bestsellers",
        description: "Discover contemporary works from today's most celebrated authors.",
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        title: "Educational Reads",
        description:
          "Expand your knowledge with our extensive collection of educational materials.",
      },
    ]);

    const currentSlideIndex = ref(0);
    const transitionDirection = ref("next");
    let slideshowInterval = null;

    // Methods
    const nextSlide = () => {
      transitionDirection.value = "next";
      currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length;
    };

    const prevSlide = () => {
      transitionDirection.value = "prev";
      currentSlideIndex.value =
        (currentSlideIndex.value - 1 + slides.value.length) % slides.value.length;
    };

    const goToSlide = (index) => {
      transitionDirection.value = index > currentSlideIndex.value ? "next" : "prev";
      currentSlideIndex.value = index;
    };

    const startSlideshow = () => {
      if (slideshowInterval) clearInterval(slideshowInterval);
      slideshowInterval = setInterval(nextSlide, 5000);
    };

    // Lifecycle hooks
    onMounted(() => {
      startSlideshow();
    });

    onUnmounted(() => {
      if (slideshowInterval) clearInterval(slideshowInterval);
    });

    return {
      slides,
      currentSlideIndex,
      transitionDirection,
      nextSlide,
      prevSlide,
      goToSlide,
      startSlideshow,
    };
  },
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
