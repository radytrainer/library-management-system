<!-- src/components/Navbar.vue -->
<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex space-x-8">
          <router-link to="/website" class="nav-link font-medium">HOME</router-link>
          <router-link to="/about-us" class="nav-link">ABOUT</router-link>
          <router-link to="/web-book" class="nav-link">BOOK</router-link>
          <router-link to="/donate" class="nav-link">DONATE</router-link>
        </div>
        <div class="flex space-x-4 items-center">
          <router-link to="/login" class="btn border-blue-600 text-blue-600 hover:text-blue-800 hover:border-blue-800">Login</router-link>
          <router-link to="/register" class="btn border-green-600 text-green-600 hover:text-green-800 hover:border-green-800">Register</router-link>
          <router-link to="/dashboard" class="btn bg-blue-600 text-white hover:bg-blue-700">Admin Dashboard</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  @apply text-gray-500 hover:text-gray-700 px-3 py-2 text-sm;
}
.btn {
  @apply px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 border;
}
</style>
