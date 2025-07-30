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
            <router-link
              to="/login"
              class="text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="text-green-600 hover:text-green-800 border border-green-600 hover:border-green-800 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Register
            </router-link>
            <router-link
              to="/dashboard"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Admin Dashboard
            </router-link>
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
            Online library
          </h1>
          <p class="text-gray-600 text-lg leading-relaxed max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
          </p>
          <div class="flex items-center space-x-4">
            <button class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200">
              Learn more
            </button>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Right Illustration -->
        <div class="relative">
          <div class="bookshelf-container">
            <!-- Shelves -->
            <div class="shelf shelf-1">
              <div class="shelf-wood"></div>
              <div class="books-row">
                <div class="book book-red"></div>
                <div class="book book-green"></div>
                <div class="book book-blue"></div>
                <div class="book book-orange"></div>
                <div class="book book-purple"></div>
                <div class="book book-yellow"></div>
                <div class="book book-teal"></div>
                <div class="book book-pink"></div>
                <div class="book book-indigo"></div>
                <div class="book book-red"></div>
                <div class="book book-green"></div>
                <div class="book book-orange"></div>
              </div>
            </div>

            <div class="shelf shelf-2">
              <div class="shelf-wood"></div>
              <div class="books-row">
                <div class="book book-blue"></div>
                <div class="book book-yellow"></div>
                <div class="book book-purple"></div>
                <div class="book book-green"></div>
                <div class="book book-red"></div>
                <div class="book book-teal"></div>
                <div class="book book-orange"></div>
                <div class="book book-pink"></div>
                <div class="book book-indigo"></div>
                <div class="book book-blue"></div>
                <div class="book book-green"></div>
              </div>
            </div>

            <div class="shelf shelf-3">
              <div class="shelf-wood"></div>
              <div class="books-row">
                <div class="book book-green"></div>
                <div class="book book-orange"></div>
                <div class="book book-purple"></div>
                <div class="book book-red"></div>
                <div class="book book-blue"></div>
                <div class="book book-yellow"></div>
                <div class="book book-teal"></div>
                <div class="book book-pink"></div>
                <div class="book book-indigo"></div>
                <div class="book book-orange"></div>
                <div class="book book-green"></div>
                <div class="book book-red"></div>
              </div>
            </div>

            <div class="shelf shelf-4">
              <div class="shelf-wood"></div>
              <div class="books-row">
                <div class="book book-purple"></div>
                <div class="book book-blue"></div>
                <div class="book book-orange"></div>
                <div class="book book-green"></div>
                <div class="book book-red"></div>
                <div class="book book-yellow"></div>
                <div class="book book-teal"></div>
                <div class="book book-pink"></div>
                <div class="book book-indigo"></div>
                <div class="book book-blue"></div>
                <div class="book book-orange"></div>
              </div>
            </div>

            <!-- Decorative circles -->
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic yet
</script>

<style scoped>
.bookshelf-container {
  position: relative;
  height: 500px;
  width: 100%;
}

.shelf {
  position: absolute;
  width: 100%;
  height: 80px;
  transform-origin: left center;
}

.shelf-1 { top: 50px; transform: rotate(-5deg); }
.shelf-2 { top: 150px; transform: rotate(2deg); }
.shelf-3 { top: 250px; transform: rotate(-3deg); }
.shelf-4 { top: 350px; transform: rotate(1deg); }

.shelf-wood {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 12px;
  background: linear-gradient(to bottom, #8B4513, #654321);
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.books-row {
  display: flex;
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  height: 68px;
  gap: 1px;
}

.book {
  flex: 1;
  height: 100%;
  border-radius: 2px 2px 0 0;
  box-shadow: inset 2px 0 4px rgba(0,0,0,0.1), inset -2px 0 4px rgba(0,0,0,0.1);
  position: relative;
}

.book::before {
  content: '';
  position: absolute;
  top: 0;
  left: 2px;
  right: 2px;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px 2px 0 0;
}

.book-red    { background: linear-gradient(to right, #DC2626, #B91C1C); }
.book-green  { background: linear-gradient(to right, #16A34A, #15803D); }
.book-blue   { background: linear-gradient(to right, #2563EB, #1D4ED8); }
.book-orange { background: linear-gradient(to right, #EA580C, #C2410C); }
.book-purple { background: linear-gradient(to right, #9333EA, #7C3AED); }
.book-yellow { background: linear-gradient(to right, #EAB308, #CA8A04); }
.book-teal   { background: linear-gradient(to right, #0D9488, #0F766E); }
.book-pink   { background: linear-gradient(to right, #EC4899, #DB2777); }
.book-indigo { background: linear-gradient(to right, #6366F1, #4F46E5); }

.circle {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}
.circle-1 { width: 80px; height: 80px; top: 120px; right: 100px; }
.circle-2 { width: 60px; height: 60px; top: 280px; right: 50px; }
.circle-3 { width: 40px; height: 40px; top: 200px; right: 200px; }

@media (max-width: 1024px) {
  .bookshelf-container { height: 400px; }
  .shelf { height: 60px; }
  .books-row { height: 48px; }
}
</style>
