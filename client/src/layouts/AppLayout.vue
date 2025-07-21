<template>
  <div class="flex min-h-screen bg-gray-100 text-gray-800">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg hidden md:block">
      <div class="p-6 text-xl font-bold text-blue-600">
        📚 MyLibrary
      </div>
      <nav class="mt-4 space-y-2">
        <RouterLink to="/dashboard" class="block px-6 py-2 rounded hover:bg-blue-100">
          🏠 Dashboard
        </RouterLink>
        <RouterLink to="/books" class="block px-6 py-2 rounded hover:bg-blue-100">
          📖 Books
        </RouterLink>
        <RouterLink to="/members" class="block px-6 py-2 rounded hover:bg-blue-100">
          👥 Members
        </RouterLink>
        <RouterLink to="/borrow" class="block px-6 py-2 rounded hover:bg-blue-100">
          🔄 Borrow
        </RouterLink>
        <RouterLink to="/reports" class="block px-6 py-2 rounded hover:bg-blue-100">
          📊 Reports
        </RouterLink>
        <RouterLink to="/authors" class="block px-6 py-2 rounded hover:bg-blue-100">
          📊 Authors
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Navbar -->
      <header class="bg-white shadow p-4 flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Library Dashboard</h1>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">Hello, Admin</span>
          <button class="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200">
            Logout
          </button>
        </div>
      </header>
      <!-- Page Content -->
      <main class="p-6 overflow-y-auto">
        <!-- <slot /> -->
           <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
</script>
