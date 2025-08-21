<template>
  <nav class="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 lg:h-20">
        <!-- Logo/Brand -->
        <div class="flex-shrink-0">
          <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PNC
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex space-x-1 lg:space-x-2">
          <router-link to="/website" class="nav-link font-semibold">
            HOME
          </router-link>
          <router-link to="/about-us" class="nav-link">
            ABOUT
          </router-link>
          <router-link to="/web-book" class="nav-link">
            BOOK
          </router-link>
        </div>
        
        <!-- Desktop Action Buttons -->
        <div class="hidden md:flex space-x-3 items-center">
          <router-link to="/login" class="btn-outline">
            Login
          </router-link>
          <router-link to="/register" class="btn-outline btn-success">
            Register
          </router-link>
          <router-link to="/dashboard" class="btn-primary">
            <span class="hidden lg:inline">Admin Dashboard</span>
            <span class="lg:hidden">Dashboard</span>
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Hamburger icon -->
            <svg
              :class="{ 'hidden': mobileMenuOpen, 'block': !mobileMenuOpen }"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Close icon -->
            <svg
              :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }"
      class="md:hidden border-t border-gray-200 bg-white/98 backdrop-blur-md"
    >
      <div class="px-4 pt-2 pb-3 space-y-1">
        <router-link
          to="/website"
          class="mobile-nav-link font-semibold"
          @click="closeMobileMenu"
        >
          HOME
        </router-link>
        <router-link
          to="/about-us"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          ABOUT
        </router-link>
        <router-link
          to="/web-book"
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          BOOK
        </router-link>
      </div>
      
      <!-- Mobile action buttons -->
      <div class="px-4 pt-4 pb-6 border-t border-gray-100 space-y-3">
        <router-link
          to="/login"
          class="mobile-btn btn-outline w-full text-center"
          @click="closeMobileMenu"
        >
          Login
        </router-link>
        <router-link
          to="/register"
          class="mobile-btn btn-outline btn-success w-full text-center"
          @click="closeMobileMenu"
        >
          Register
        </router-link>
        <router-link
          to="/dashboard"
          class="mobile-btn btn-primary w-full text-center"
          @click="closeMobileMenu"
        >
          Admin Dashboard
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<style scoped>
/* Desktop nav links */
.nav-link {
  @apply relative px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base font-medium 
         text-gray-700 transition-all duration-300 rounded-xl;
}

.nav-link:hover {
  @apply text-gray-900 bg-gray-50/80;
}

.nav-link.router-link-active {
  @apply text-blue-600 bg-blue-50/80;
}

/* Underline effect */
.nav-link::after {
  content: '';
  @apply absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500
         transition-all duration-300 transform -translate-x-1/2 rounded-full;
}

.nav-link.router-link-active::after,
.nav-link:hover::after {
  @apply w-3/4;
}

/* Mobile nav links */
.mobile-nav-link {
  @apply block px-3 py-3 text-base font-medium text-gray-700 transition-all duration-200
         rounded-lg border-l-4 border-transparent;
}

.mobile-nav-link:hover {
  @apply text-gray-900 bg-gray-50 border-blue-500;
}

.mobile-nav-link.router-link-active {
  @apply text-blue-600 bg-blue-50 border-blue-500;
}

/* Outline button */
.btn-outline {
  @apply px-4 py-2 lg:px-6 lg:py-2.5 text-sm lg:text-base font-medium 
         border-2 border-gray-300 text-gray-700 rounded-xl transition-all duration-300;
}

.btn-outline:hover {
  @apply border-gray-400 text-gray-900 bg-gray-50 shadow-md scale-105;
}

.btn-outline:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Success button */
.btn-success {
  @apply border-emerald-400 text-emerald-700;
}

.btn-success:hover {
  @apply border-emerald-500 text-emerald-800 bg-emerald-50 shadow-emerald-200;
}

.btn-success:focus {
  @apply ring-emerald-500;
}

/* Primary button */
.btn-primary {
  @apply px-4 py-2 lg:px-6 lg:py-2.5 text-sm lg:text-base font-medium 
         bg-gradient-to-r from-blue-600 to-purple-600 text-white 
         rounded-xl transition-all duration-300 shadow-lg;
}

.btn-primary:hover {
  @apply from-blue-700 to-purple-700 shadow-xl scale-105;
}

.btn-primary:active {
  @apply from-blue-800 to-purple-800;
}

.btn-primary:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Mobile button */
.mobile-btn {
  @apply block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200;
}

/* Enhanced responsive breakpoints */
@media (max-width: 768px) {
  .nav-link {
    @apply px-3 py-2 text-sm;
  }
}

@media (max-width: 640px) {
  .btn-outline,
  .btn-primary {
    @apply px-3 py-2 text-sm;
  }
}

/* Smooth mobile menu animation */
@media (max-width: 768px) {
  .md\:hidden {
    animation: slideDown 0.3s ease-out;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>