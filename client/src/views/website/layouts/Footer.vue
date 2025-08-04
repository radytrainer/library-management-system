<template>
  <footer class="bg-white border-t border-gray-200 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

        <!-- Left text -->
        <p class="text-gray-500 text-sm">
          &copy; 2025 Your Library Name. All rights reserved.
        </p>

        <!-- Center links -->
        <div class="flex space-x-6">
          <router-link to="/website" class="footer-link">Home</router-link>
          <router-link to="/about-us" class="footer-link">About</router-link>
          <router-link to="/book" class="footer-link">Book</router-link>
          <router-link to="/donate" class="footer-link">Donate</router-link>
          <router-link to="/history" class="footer-link">History</router-link>
        </div>

        <!-- Right social icons (optional) -->
        <div class="flex space-x-4">
          <a href="#" aria-label="Facebook" class="footer-icon hover:text-blue-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.7 9.9v-7h-2v-3h2v-2c0-2 1-3 3-3h2v3h-2a1 1 0 00-1 1v2h3l-.5 3h-2.5v7A10 10 0 0022 12z"/></svg>
          </a>
          <a href="#" aria-label="Twitter" class="footer-icon hover:text-blue-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
          </a>
          <a href="#" aria-label="Instagram" class="footer-icon hover:text-pink-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2C4 2 2 4 2 7v10c0 3 2 5 5 5h10c3 0 5-2 5-5V7c0-3-2-5-5-5zm10 2a1 1 0 110 2 1 1 0 010-2zm-5 3a5 5 0 110 10 5 5 0 010-10z"/></svg>
          </a>
        </div>

      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  @apply text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200;
}
.footer-icon {
  @apply text-gray-500 transition-colors duration-200;
}
</style>
