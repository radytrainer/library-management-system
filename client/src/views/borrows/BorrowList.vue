<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Borrow Records</h1>
            <p class="text-gray-600">Track, filter, and manage all book borrowing activities</p>
          </div>
          <!-- Filters -->
          <div class="flex flex-wrap gap-4">
            <div class="relative flex-1 max-w-md">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input v-model="search" type="text" placeholder="Search book title or borrower name..."
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Records</p>
              <p class="text-2xl font-bold text-gray-900">{{ borrowData.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Currently Borrowed</p>
              <p class="text-2xl font-bold text-blue-600">{{ borrowedCount }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Returned</p>
              <p class="text-2xl font-bold text-green-600">{{ returnedCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Overdue</p>
              <p class="text-2xl font-bold text-red-600">{{ overdueCount }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <!-- Table Container -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-md">
        <!-- Filters and Actions -->
        <div class="p-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Status Filter -->
              <select v-model="selectedStatus" class="min-w-[120px] sm:min-w-[140px] px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base">
                <option value="">All Status</option>
                <option value="borrowed">Borrowed</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
              <!-- Category Filter -->
              <select v-model="selectedCategory"
                class="min-w-[140px] sm:min-w-[160px] px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
              </select>
              <!-- Items Per Page -->
              <select v-model="limit" class="min-w-[100px] sm:min-w-[120px] px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base">
                <option v-for="n in [10, 20, 50]" :key="n" :value="n">Show {{ n }}</option>
              </select>
            </div>
            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <!-- Export Button (disabled) -->
              <button disabled
                class="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>Export
              </button>
              <!-- Add Borrow Button -->
              <button @click="showModal = true"
                class="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>Add Borrow
              </button>
              <!-- Add Borrow scan -->
              <button @click="showModalScan = true"
                class="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M3 3h3v18H3V3zm5 0h1v18H8V3zm3 0h1v18H11V3zm3 0h1v18H14V3zm3 0h1v18H17V3zm3 0h1v18H20V3z" />
  </svg>Scan Borrow
              </button>
            </div>
          </div>
        </div>
        <!-- Table -->
        <div class="">
          <table class="w-full table-auto">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Book</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Borrower</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Borrow Date</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Return Date</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in filteredBorrowData" :key="item.id" class="hover:bg-gray-50 transition-all">
                <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-900">
                  {{ index + 1 + (currentPage - 1) * limit }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <img :src="item.book.cover_image" alt="cover"
                      class="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-lg shadow-sm border border-gray-200" />
                    <button class="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all text-sm sm:text-base"
                      @click="handleShow(item)" aria-label="View book details">
                      {{ item.book.title }}
                    </button>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                    {{ item.book.category }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base font-medium text-gray-900">
                  {{ item.user.name }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-900">
                  {{ item.borrowed_quantity || 0 }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span v-if="getItemStatus(item) === 'overdue'"
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm sm:text-base font-medium bg-red-100 text-red-800">
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>Overdue
                  </span>
                  <button v-else-if="getItemStatus(item) === 'borrowed'" @click="confirmReturn(item.id)"
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm sm:text-base font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
                    aria-label="Mark as returned">
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                    </svg>Return
                  </button>
                  <span v-else
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm sm:text-base font-medium bg-green-100 text-green-800">
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>Returned
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-900">
                  {{ formatDate(item.borrow_date) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-900">
                  {{ formatDate(item.return_date) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm sm:text-base text-gray-500 relative">
                  <button @click.stop="toggleDropdown(item.id)" class="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    aria-label="Toggle actions menu">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  <!-- Dropdown Menu -->
                  <div v-if="openDropdown === item.id"
                    class="absolute right-4 sm:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div class="py-1">
                      <button @click="handleShow(item)"
                        class="flex items-center gap-3 px-4 py-2 w-full text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>View Details
                      </button>
                      <button @click="openUpdateModal(item)"
                        class="flex items-center gap-3 px-4 py-2 w-full text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>Edit Record
                      </button>
                      <button @click="handleDelete(item.id)" class="flex items-center gap-3 px-4 py-2 w-full text-sm sm:text-base text-red-600 hover:bg-red-50 transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>Delete Record
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="text-sm sm:text-base text-gray-700">Showing
              <span class="font-medium">{{ (currentPage - 1) * limit + 1 }}</span>to
              <span class="font-medium">{{ Math.min(currentPage * limit, totalFilteredItems) }}</span>of
              <span class="font-medium">{{ totalFilteredItems }}</span> results
            </div>
            <div class="flex items-center gap-2">
              <button :disabled="currentPage === 1" @click="currentPage--"
                class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <template v-for="page in Math.min(totalPages, 5)" :key="page">
                <button @click="currentPage = page" :class="['px-3 py-2 border rounded-lg transition-all text-sm sm:text-base',
                  currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-100']">
                  {{ page }}
                </button>
              </template>
              <button :disabled="currentPage === totalPages" @click="currentPage++"
                class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Book Detail Modal -->
    <div v-if="showBookDetail"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showBookDetail = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Book Details</h2>
          <button @click="showBookDetail = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="bg-gray-50 p-8 flex items-center justify-center">
            <img v-if="selectedBook.book?.cover_image" :src="selectedBook.book.cover_image" alt="Book Cover"
              class="w-full max-w-xs h-96 object-cover rounded-xl shadow-lg" />
            <div v-else class="w-full max-w-xs h-96 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 rounded-xl">
              No Cover Image
            </div>
          </div>
          <div class="p-8 space-y-6">
            <div>
              <h3 class="text-3xl font-bold text-blue-700 mb-2">{{ selectedBook.book?.title }}</h3>
              <p class="text-gray-600">Detailed borrowing information</p>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <span class="font-medium text-gray-600">Author:</span>
                <span class="text-gray-900">{{selectedBook.book?.author}}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <span class="font-medium text-gray-600">Category:</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ selectedBook.book?.category }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <span class="font-medium text-gray-600">Borrowed By:</span>
                <span class="text-blue-600 font-semibold">{{selectedBook.user?.name}}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <span class="font-medium text-gray-600">Status:</span>
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getItemStatus(selectedBook) === 'overdue'? 'bg-red-100 text-red-800': getItemStatus(selectedBook) === 'returned'
                      ? 'bg-green-100 text-green-800': 'bg-blue-100 text-blue-800',]"> {{ getItemStatus(selectedBook) }}
                </span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <span class="font-medium text-gray-600">Borrow Date:</span>
                <span class="text-gray-900">{{
                  formatDate(selectedBook.borrow_date)
                }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <span class="font-medium text-gray-600">Return Date:</span>
                <span class="text-gray-900">{{
                  formatDate(selectedBook.return_date)
                }}</span>
              </div>

              <div class="flex justify-between items-center py-3">
                <span class="font-medium text-gray-600">Days Left:</span>
                <span v-if="getItemStatus(selectedBook) === 'returned'" class="text-gray-500">
                  -
                </span>
                <span v-else-if="getDaysLeft(selectedBook) < 0" class="text-red-600 font-semibold">
                  {{ Math.abs(getDaysLeft(selectedBook)) }} days overdue
                </span>
                <span v-else class="text-green-600 font-semibold">
                  {{ getDaysLeft(selectedBook) }} days left
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Add Borrow Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="text-2xl font-bold text-gray-900">Add Borrow Record</h3>
          <button @click="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitAddBorrow" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">User Name</label>
              <input v-model="addForm.user_name" type="text" required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter user name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
              <input v-model="addForm.book_name" type="text" required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter book title" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
              <input v-model="addForm.isbn" type="text" required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter ISBN" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input v-model.number="addForm.quantity" type="number" min="1" required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Librarian</label>
            <input v-model="addForm.librarian_name" type="text" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter librarian name" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Borrow Date</label>
              <input v-model="addForm.date_borrow" type="date" required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
              <input v-model="addForm.date_return" type="date" required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="addForm.status" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button type="button" @click="showModal = false" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
              Cancel
            </button>
            <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
              Add Borrow Record
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Scan Borrow Modal -->
<div v-if="showModalScan" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
  @click.self="showModalScan = false">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
    <div class="flex justify-between items-center p-6 border-b border-gray-200">
      <h3 class="text-2xl font-bold text-gray-900">Scan Borrow Record</h3>
      <button @click="showModalScan = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <form @submit.prevent="submitScanBorrow" class="p-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Scan or Enter ISBN</label>
        <div class="flex items-center gap-4">
          <input v-model="scanForm.isbn" type="text" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Scan or enter ISBN" @input="handleIsbnInput" />
          <button type="button" @click="simulateScan"
            class="px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <p v-if="scanForm.bookTitle" class="mt-2 text-sm text-gray-600">Book: {{ scanForm.bookTitle }}</p>
        <p v-if="scanForm.bookError" class="mt-2 text-sm text-red-600">{{ scanForm.bookError }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">User Name</label>
          <input v-model="scanForm.user_name" type="text" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter user name" />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <input v-model.number="scanForm.quantity" type="number" min="1" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Librarian</label>
          <input v-model="scanForm.librarian_name" type="text" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter librarian name" />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Borrow Date</label>
          <input v-model="scanForm.date_borrow" type="date" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
          <input v-model="scanForm.date_return" type="date" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select v-model="scanForm.status" required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
        </select>
      </div>
      <div v-if="formError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{{ formError }}</div>
      <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button type="button" @click="showModalScan = false"
          class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
          Cancel
        </button>
        <button type="submit"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          :disabled="!scanForm.bookTitle">
          Add Borrow Record
        </button>
      </div>
    </form>
  </div>
</div>
    <!-- Update Borrow Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      @click.self="closeUpdateModal">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="text-2xl font-bold text-gray-900">Update Borrow Record</h3>
          <button @click="closeUpdateModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitUpdate" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
            <input v-model="updateForm.bookTitle" type="text" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter book title" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">User Name</label>
            <input v-model="updateForm.userName" type="text" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter user name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
            <input v-model="updateForm.return_date" type="date" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input v-model.number="updateForm.borrowed_quantity" type="number" min="1" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="updateForm.status" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option v-for="option

 in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
          <div v-if="formError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{{ formError }}
          </div>
          <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button type="button" @click="closeUpdateModal" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
              Cancel
            </button>
            <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
              Update Record
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m0-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-center text-gray-900 mb-2">Confirm Return
        </h2>
        <p class="text-center text-gray-600 mb-8">Are you sure you want to mark this book as
        <span class="font-semibold text-green-600">Returned</span>?
        </p>
        <div class="flex justify-center gap-4">
          <button @click="handleConfirmReturn" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm">
            Yes, Return Book
          </button>
          <button @click="showConfirmModal = false" class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
    <!-- Toast Notification -->
    <transition enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2">
      <div v-if="message" :class="['fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-xl shadow-2xl border-l-4 p-6',
        messageType === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800',]">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <svg v-if="messageType === 'success'" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold">{{ messageType === "success" ? "Success" : "Error" }}</p>
            <p class="text-sm mt-1">{{ message }}</p>
          </div>
          <button @click="message = ''" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getBorrows, createBorrow, updateBorrow, deleteBorrow } from "@/services/Api/borrow";
import { getBooks, updateBook } from "@/services/Api/book";



const router = useRouter();
const borrowData = ref([]);
const booksData = ref([]);
const loading = ref(false);
const error = ref(null);

// Fetch books data on mount
async function fetchBooksData() {
  try {
    const response = await getBooks();
    booksData.value = Array.isArray(response.data.books) ? response.data.books : [];
    console.log("Books fetched from API:", booksData.value);
    if (!booksData.value.length) {
      console.warn("No books found in API response. Check the /api/books endpoint.");
      showToast("No books available in the database.", "error");
    }
  } catch (err) {
    console.error("Failed to load books:", err);
    showToast("Failed to load book data. Please try again.", "error");
  }
}

// Fetch book by ISBN, book ID, or title
async function getBook(identifier, type = "isbn") {
  try {
    if (!identifier) throw new Error(`${type.toUpperCase()} is missing or invalid`);
    console.log(`Searching for book with ${type}:`, identifier, "Available books:", booksData.value);
    let book;
    if (type === "isbn") {
      const normalizedIsbn = identifier.trim();
      book = booksData.value.find((b) => b.isbn === normalizedIsbn);
    } else if (type === "id") {
      book = booksData.value.find((b) => b.id === identifier);
    } else if (type === "title") {
      book = booksData.value.find((b) => b.title.toLowerCase() === identifier.toLowerCase());
    }
    if (!book) {
      console.log(`Book not found for ${type}:`, identifier);
      throw new Error(`Book not found for ${type}: ${identifier}`);
    }
    console.log("Found book:", book);
    return book;
  } catch (error) {
    console.error(`Failed to fetch book by ${type}:`, error);
    return null;
  }
}

// Categories extracted from borrowData
const categories = computed(() => {
  const set = new Set(borrowData.value.map((item) => item.book.category));
  return Array.from(set).map((name, index) => ({ id: index + 1, name }));
});

// Authors extracted from borrowData
const authors = computed(() => {
  const set = new Set(borrowData.value.map((item) => item.book.author));
  return Array.from(set).map((name, index) => ({ id: index + 1, name }));
});

const selectedCategory = ref("");
const selectedStatus = ref("");
const selectedAuthor = ref("");
const search = ref("");
const limit = ref(10);
const currentPage = ref(1);
const showModal = ref(false);
const openDropdown = ref(null);

// Helper functions for status and days calculation
function getItemStatus(item) {
  if (item.status === "returned") return "returned";
  const today = new Date();
  const returnDate = new Date(item.return_date);
  if (today > returnDate) return "overdue";
  return "borrowed";
}

function getDaysLeft(item) {
  if (item.status === "returned") return 0;
  const today = new Date();
  const returnDate = new Date(item.return_date);
  const diffTime = returnDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Stats computed properties
const borrowedCount = computed(() => {
  return borrowData.value.filter((item) => getItemStatus(item) === "borrowed").length;
});
const returnedCount = computed(() => {
  return borrowData.value.filter((item) => getItemStatus(item) === "returned").length;
});
const overdueCount = computed(() => {
  return borrowData.value.filter((item) => getItemStatus(item) === "overdue").length;
});

function toggleDropdown(id) {
  openDropdown.value = openDropdown.value === id ? null : id;
}

function closeDropdown() {
  openDropdown.value = null;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString();
}

function onClickOutside(event) {
  const dropdownMenus = document.querySelectorAll(".dropdown-menu, .material-symbols-outlined");
  let clickedInside = false;
  dropdownMenus.forEach((el) => {
    if (el.contains(event.target)) clickedInside = true;
  });
  if (!clickedInside) closeDropdown();
}

onMounted(() => {
  window.addEventListener("click", onClickOutside);
  fetchBorrowData();
  fetchBooksData();
});

async function fetchBorrowData() {
  loading.value = true;
  error.value = null;
  try {
    const response = await getBorrows();
    borrowData.value = response.data;
    console.log("Borrow records fetched:", borrowData.value);
  } catch (err) {
    error.value = "Failed to load borrow records.";
    console.error(err);
    showToast("Failed to load borrow records.", "error");
  } finally {
    loading.value = false;
  }
}

// Filtering logic
const filteredBorrowData = computed(() => {
  let filtered = borrowData.value;
  if (selectedCategory.value) {
    filtered = filtered.filter((item) => item.book.category === selectedCategory.value);
  }
  if (selectedStatus.value) {
    filtered = filtered.filter((item) => getItemStatus(item) === selectedStatus.value);
  }
  if (selectedAuthor.value) {
    filtered = filtered.filter((item) => item.book.author === selectedAuthor.value);
  }
  if (search.value) {
    filtered = filtered.filter(
      (item) =>
        item.book.title.toLowerCase().includes(search.value.toLowerCase()) ||
        item.user.name.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  const start = (currentPage.value - 1) * limit.value;
  return filtered.slice(start, start + limit.value);
});

const totalFilteredItems = computed(() => {
  let filtered = borrowData.value;
  if (selectedCategory.value) {
    filtered = filtered.filter((item) => item.book.category === selectedCategory.value);
  }
  if (selectedStatus.value) {
    filtered = filtered.filter((item) => getItemStatus(item) === selectedStatus.value);
  }
  if (selectedAuthor.value) {
    filtered = filtered.filter((item) => item.book.author === selectedAuthor.value);
  }
  if (search.value) {
    filtered = filtered.filter(
      (item) =>
        item.book.title.toLowerCase().includes(search.value.toLowerCase()) ||
        item.user.name.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  return filtered.length;
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalFilteredItems.value / limit.value));
});

watch([selectedCategory, selectedStatus, selectedAuthor, search, limit], () => {
  currentPage.value = 1;
});

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) currentPage.value = newTotal;
});

// Modal & selected items
const showBookDetail = ref(false);
const selectedBook = ref({});

function handleShow(item) {
  selectedBook.value = item;
  showBookDetail.value = true;
  closeDropdown();
}

const showUpdateModal = ref(false);
const updateForm = ref({
  id: null,
  bookTitle: "",
  userName: "",
  return_date: "",
  borrowed_quantity: 0,
  status: "borrowed",
});
const formError = ref("");

function openUpdateModal(item) {
  updateForm.value.id = item.id;
  updateForm.value.bookTitle = item.book.title;
  updateForm.value.userName = item.user.name;
  updateForm.value.return_date = item.return_date || "";
  updateForm.value.borrowed_quantity = item.borrowed_quantity || 0;
  updateForm.value.status = item.status || "borrowed";
  showUpdateModal.value = true;
  closeDropdown();
}

const statusOptions = ref([
  { value: "borrowed", label: "Borrowed" },
  { value: "returned", label: "Returned" },
]);

function closeUpdateModal() {
  showUpdateModal.value = false;
  formError.value = "";
}

async function submitUpdate() {
  try {
    const payload = {
      bookTitle: updateForm.value.bookTitle,
      userName: updateForm.value.userName,
      return_date: updateForm.value.return_date,
      borrowed_quantity: updateForm.value.borrowed_quantity,
      status: updateForm.value.status,
    };
    await updateBorrow(updateForm.value.id, payload);
    await fetchBorrowData();
    await fetchBooksData();
    showUpdateModal.value = false;
    showToast("Borrow record updated successfully.", "success");
  } catch (error) {
    console.error("Update failed:", error);
    formError.value = "Failed to update borrow record.";
  }
}

// Add form data and submit handler
const addForm = ref({
  user_name: "",
  email_borrower: "",
  book_name: "",
  isbn: "",
  quantity: 1,
  librarian_name: "",
  date_borrow: "",
  date_return: "",
  status: "borrowed",
});

async function submitAddBorrow() {
  try {
    console.log("Submitting borrow with form data:", addForm.value);
    if (!booksData.value.length) {
      console.warn("No books available in booksData. Cannot process borrow request.");
      showToast("No books available in the database. Please try again later.", "error");
      return;
    }

    // Check stock availability
    const book = await getBook(addForm.value.isbn, "isbn");
    if (!book) {
      showToast("Book not found. Please enter a valid ISBN.", "error");
      return;
    }
    if (book.quantity === 1) {
      showToast("Cannot borrow this book because only 1 copy is in stock.", "error");
      return;
    }
    if (book.quantity < addForm.value.quantity) {
      showToast(`Cannot borrow ${addForm.value.quantity} copies. Only ${book.quantity} available.`, "error");
      return;
    }

    // Proceed with borrowing, include book_id and isbn
    const payload = {
      ...addForm.value,
      book_id: book.id, // Ensure book_id is included
      isbn: book.isbn, // Ensure isbn is included
    };
    console.log("Creating borrow with payload:", payload);
    await createBorrow(payload);
    await fetchBorrowData();
    await fetchBooksData();
    showModal.value = false;
    addForm.value = {
      user_name: "",
      email_borrower: "",
      book_name: "",
      isbn: "",
      quantity: 1,
      librarian_name: "",
      date_borrow: "",
      date_return: "",
      status: "borrowed",
    };
    showToast("Borrow record added successfully.", "success");
  } catch (error) {
    console.error("Failed to add borrow record:", error);
    showToast("Failed to add borrow record: " + error.message, "error");
  }
}

// Delete a borrow record with confirmation
async function handleDelete(id) {
  try {
    await deleteBorrow(id);
    await fetchBorrowData();
    await fetchBooksData();
    closeDropdown();
    showToast("Borrow record deleted successfully.", "success");
  } catch (error) {
    console.error(error);
    showToast("Failed to delete record: " + error.message, "error");
  }
}

const message = ref("");
const messageType = ref("success");

function showToast(msg, type = "success") {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
    messageType.value = "";
  }, 3000);
}

const showConfirmModal = ref(false);
const returnId = ref(null);
const showManualBookSelectModal = ref(false);
const manualBookId = ref(null);

function confirmReturn(id) {
  returnId.value = id;
  showConfirmModal.value = true;
  closeDropdown();
}

async function handleConfirmReturn() {
  try {
    // Validate returnId
    if (!returnId.value) {
      throw new Error("No borrow record ID provided");
    }

    // Find the borrow record
    const borrowRecord = borrowData.value.find((item) => item.id === returnId.value);
    if (!borrowRecord) {
      throw new Error(`Borrow record with ID ${returnId.value} not found`);
    }
    console.log("Borrow record:", JSON.stringify(borrowRecord, null, 2));

    // Update borrow record to mark as returned
    console.log(`Updating borrow record ${returnId.value} to status 'returned'`);
    await updateBorrow(returnId.value, {
      status: "returned",
      date_return: new Date().toISOString().slice(0, 10),
    });

    // Get book identifier (try isbn, book_id, book.id, or title)
    let book;
    let identifierType = "isbn";
    let identifier = borrowRecord.book?.isbn || borrowRecord.isbn || borrowRecord.book_id;
    if (!identifier) {
      console.warn("ISBN or book_id not found in borrow record, trying book.id");
      identifier = borrowRecord.book?.id;
      identifierType = "id";
      if (!identifier) {
        console.warn("No ISBN or book ID found, trying book title");
        identifier = borrowRecord.book?.title;
        identifierType = "title";
        if (!identifier) {
          console.warn("No valid book identifier found, skipping quantity update");
          await fetchBorrowData();
          showToast(
            "Book marked as returned, but quantity not updated due to missing ISBN, book ID, or title. Please update the borrow record with a valid book identifier.",
            "warning"
          );
          return;
        }
      }
    }

    // Validate borrowed quantity
    const borrowedQuantity = borrowRecord.borrowed_quantity || 1;
    if (!Number.isInteger(borrowedQuantity) || borrowedQuantity <= 0) {
      throw new Error(`Invalid borrowed quantity: ${borrowedQuantity}`);
    }

    // Find the book
    book = await getBook(identifier, identifierType);
    if (!book) {
      console.warn(`Book not found for ${identifierType}: ${identifier}, skipping quantity update`);
      await fetchBorrowData();
      showToast(
        `Book marked as returned, but quantity not updated because book with ${identifierType} "${identifier}" was not found. Please update the borrow record with a valid book identifier.`,
        "warning"
      );
      return;
    }

    // Validate book data
    if (!book.id || !Number.isInteger(book.quantity)) {
      throw new Error(`Invalid book data: ID or quantity missing for book ${book.title}`);
    }

    // Check if updateBook function exists
    if (!updateBook || typeof updateBook !== "function") {
      throw new Error("updateBook function is not defined in @/services/Api/book");
    }

    // Update book quantity
    const updatedQuantity = book.quantity + borrowedQuantity;
    console.log(`Updating book ${book.title} (ID: ${book.id}) quantity from ${book.quantity} to ${updatedQuantity}`);
    await updateBook(book.id, { quantity: updatedQuantity });

    // Refresh data
    console.log("Refreshing borrow and book data");
    await fetchBorrowData();
    await fetchBooksData();

    showToast("Book marked as returned and quantity updated successfully.", "success");
  } catch (error) {
    console.error("Return failed:", error.message, error.stack);
    showToast(`Failed to mark as returned or update quantity: ${error.message}`, "error");
  } finally {
    showConfirmModal.value = false;
  }
}
// Scan form data
const showModalScan = ref(false);
const scanForm = ref({
  isbn: "",
  bookTitle: "",
  bookError: "",
  user_name: "",
  email_borrower: "",
  quantity: 1,
  librarian_name: "",
  date_borrow: "",
  date_return: "",
  status: "borrowed",
});

// Handle ISBN input and validate book
async function handleIsbnInput() {
  scanForm.value.bookTitle = "";
  scanForm.value.bookError = "";
  const isbn = scanForm.value.isbn.trim();
  if (!isbn) return;

  try {
    const book = await getBook(isbn, "isbn");
    if (book) {
      scanForm.value.bookTitle = book.title;
      if (book.quantity < scanForm.value.quantity) {
        scanForm.value.bookError = `Only ${book.quantity} copies available.`;
      } else if (book.quantity === 1) {
        scanForm.value.bookError = "Cannot borrow this book because only 1 copy is in stock.";
      }
    } else {
      scanForm.value.bookError = "Book not found. Please enter a valid ISBN.";
    }
  } catch (error) {
    console.error("Error validating ISBN:", error);
    scanForm.value.bookError = "Failed to validate ISBN. Please try again.";
  }
}

// Simulate barcode scan (placeholder for actual scanning logic)
function simulateScan() {
  // Placeholder: In a real app, this would trigger a barcode scanner (e.g., QuaggaJS or device camera)
  // For now, it just logs a message
  console.log("Simulating barcode scan...");
  showToast("Barcode scanning not implemented. Enter ISBN manually.", "error");
  // Example: scanForm.value.isbn = "1234567890123"; // Simulate scanned ISBN
  // handleIsbnInput();
}

// Submit scan borrow form
async function submitScanBorrow() {
  try {
    console.log("Submitting scan borrow with form data:", scanForm.value);
    if (!booksData.value.length) {
      console.warn("No books available in booksData. Cannot process borrow request.");
      showToast("No books available in the database. Please try again later.", "error");
      return;
    }

    // Validate ISBN and book
    const book = await getBook(scanForm.value.isbn, "isbn");
    if (!book) {
      showToast("Book not found. Please enter a valid ISBN.", "error");
      return;
    }
    if (book.quantity === 1) {
      showToast("Cannot borrow this book because only 1 copy is in stock.", "error");
      return;
    }
    if (book.quantity < scanForm.value.quantity) {
      showToast(`Cannot borrow ${scanForm.value.quantity} copies. Only ${book.quantity} available.`, "error");
      return;
    }

    // Prepare payload
    const payload = {
      ...scanForm.value,
      book_id: book.id,
      book_name: book.title,
      isbn: book.isbn,
    };
    console.log("Creating scan borrow with payload:", payload);
    await createBorrow(payload);
    await fetchBorrowData();
    await fetchBooksData();
    showModalScan.value = false;
    scanForm.value = {
      isbn: "",
      bookTitle: "",
      bookError: "",
      user_name: "",
      quantity: 1,
      librarian_name: "",
      date_borrow: "",
      date_return: "",
      status: "borrowed",
    };
    showToast("Borrow record added successfully via scan.", "success");
  } catch (error) {
    console.error("Failed to add scan borrow record:", error);
    showToast("Failed to add borrow record: " + error.message, "error");
  }
}

// Update toast notification to support warning type
watch(messageType, (newType) => {
  if (newType === "warning") {
    // Ensure warning type is styled appropriately
    // Update the toast transition class in the template if needed
  }
});
import Quagga from 'quagga';
function startScanner() {
  Quagga.init({
    inputStream: { name: 'Live', type: 'LiveStream', target: document.querySelector('#scanner-container') },
    decoder: { readers: ['ean_reader'] } // For ISBN-13
  }, (err) => {
    if (!err) {
      Quagga.start();
      Quagga.onDetected((data) => {
        scanForm.value.isbn = data.codeResult.code;
        handleIsbnInput();
        Quagga.stop();
      });
    }
  });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined");
</style>