<template>
  <div class=" space-y-6 p-10">
    <!-- Header and Add Button -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-700">Book List</h2>
        <p class="text-sm text-gray-500">
          Browse all books available in the library system. Use the search or filters to find what you need quickly.
        </p>
      </div>
      <button @click="openForm()"
        class="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Book
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- All Books Card -->
      <div @click="viewAllBooks"
        class="cursor-pointer bg-white rounded-xl shadow-md border border-blue-200 p-6 hover:shadow-lg transition duration-300">
        <h2 class="text-lg font-semibold text-blue-700 mb-2">All Books</h2>
        <p class="text-gray-600">View and manage all books in the library.</p>
      </div>

      <!-- New Book Card -->
      <div @click="viewNewBook"
        class="cursor-pointer bg-white rounded-xl shadow-md border border-green-200 p-6 hover:shadow-lg transition duration-300">
        <h2 class="text-lg font-semibold text-green-700 mb-2">New Book</h2>
        <p class="text-gray-600">Add a new book to the library.</p>
      </div>

      <!-- Available Books Card -->
      <div @click="viewAvailableBooks"
        class="cursor-pointer bg-white rounded-xl shadow-md border border-yellow-200 p-6 hover:shadow-lg transition duration-300">
        <h2 class="text-lg font-semibold text-yellow-700 mb-2">Available</h2>
        <p class="text-gray-600">View all available books in the library.</p>
      </div>

      <!-- Limited Books Card -->
      <div @click="viewLimitedBooks"
        class="cursor-pointer bg-white rounded-xl shadow-md border border-red-200 p-6 hover:shadow-lg transition duration-300">
        <h2 class="text-lg font-semibold text-red-700 mb-2">Limited</h2>
        <p class="text-gray-600">View all limited books in the library.</p>
      </div>
    </div>

    <!-- Book Table Section -->
    <div class="bg-white rounded-xl shadow border border-blue-300">
      <table class="min-w-full text-sm text-left">
        <thead class="bg-gray-100 text-gray-600 uppercase">
          <tr>
            <th class="px-6 py-3">Book</th>
            <th class="px-6 py-3">Author</th>
            <th class="px-6 py-3">Category</th>
            <th class="px-6 py-3">Lang</th>
            <th class="px-6 py-3">ISBN</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr v-for="book in filteredBooks" :key="book.id" class="border-t hover:bg-gray-50">
            <td class="px-6 py-3">
              <div class="flex items-center gap-4">
                <img :src="book.cover_image_url" alt="book" class="w-12 h-12 rounded-full object-cover" />
                <span class="font-semibold">{{ book.title }}</span>
              </div>
            </td>
            <td class="px-6 py-3">
              <div class="flex flex-col">
                <span>{{ book.author?.name }}</span>
                <span class="text-xs text-gray-500">{{ book.public_year }}</span>
              </div>
            </td>
            <td class="px-6 py-3">{{ book.category?.name }}</td>
            <td class="px-6 py-3">{{ book.language?.name }}</td>
            <td class="px-6 py-3">{{ book.isbn || 'N/A' }}</td>
            <td class="px-6 py-3">
              <span class="inline-block px-2 py-1 text-xs rounded-full" :class="{
                'bg-green-100 text-green-700': book.quantity >= 5,
                'bg-yellow-100 text-yellow-700': book.quantity > 0 && book.quantity <= 3,
                'bg-red-100 text-red-700': book.quantity === 0
              }">
                {{
                  book.quantity >= 10 ? 'Available' :
                    book.quantity > 0 && book.quantity <= 5 ? 'Limited' : book.quantity === 0 ? 'Unavailable' : 'Unknown' }}
                  </span>
            </td>
            <td class="px-6 py-3 text-right relative">
              <div class="relative inline-block text-left" data-action-menu>
                <button @click.stop="toggleActionMenu(book.id)"
                  class="text-gray-600 hover:text-blue-600 focus:outline-none"
                  style="margin-right: 22px; font-size: 26px;">
                  ⋮
                </button>
                <div v-if="openActionMenu === book.id"
                  class="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
                  <ul class="text-sm text-gray-700">
                    <li>
                      <button @click.stop="viewBook(book)"
                        class="w-full text-left px-4 py-2 hover:bg-gray-100">View</button>
                    </li>
                    <li>
                      <button @click.stop="openForm(book)"
                        class="w-full text-left px-4 py-2 hover:bg-gray-100">Edit</button>
                    </li>
                    <li>
                      <button @click.stop="deleteBookById(book.id)"
                        class="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50">Delete</button>
                    </li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Book Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-5xl shadow-2xl relative max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div
          class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">Book Details</h2>
          <button @click="closeDetail"
            class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-all duration-200"
            aria-label="Close details">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Modal Content -->
        <div class="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div class="p-6">
            <div class="flex flex-col lg:flex-row gap-8">
              <!-- Book Cover -->
              <div class="flex-shrink-0">
                <div class="relative group cursor-pointer" @click="openFullImage(selectedBook)">
                  <img :src="selectedBook.cover_image_url" :alt="selectedBook.title + ' cover'"
                    class="w-80 h-[480px] rounded-xl object-cover shadow-lg border border-gray-200 transition-transform duration-300 group-hover:scale-105" />
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
              <!-- Book Information -->
              <div class="flex-1 space-y-6">
                <!-- Title and Description -->
                <div class="space-y-3">
                  <h3 class="text-3xl font-bold text-gray-900 leading-tight">{{ selectedBook.title }}</h3>
                  <p class="text-gray-600 text-lg leading-relaxed">{{ selectedBook.description }}</p>
                </div>
                <!-- Badges -->
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {{ selectedBook.category?.name }}
                  </span>
                  <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {{ selectedBook.language?.name }}
                  </span>
                  <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {{ selectedBook.public_year }}
                  </span>
                </div>
                <!-- Book Details Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Author</span>
                      <p class="text-gray-900 font-medium text-lg">{{ selectedBook.author?.name }}</p>
                    </div>
                    <div>
                      <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">ISBN</span>
                      <p class="text-gray-900 font-mono">{{ selectedBook.isbn || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quantity
                        Available</span>
                      <p class="text-gray-900 font-medium">
                        <span class="text-2xl font-bold text-green-600">{{ selectedBook.quantity }}</span> copies
                      </p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Publication Year</span>
                      <p class="text-gray-900 font-medium text-lg">{{ selectedBook.public_year }}</p>
                    </div>
                    <div>
                      <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Language</span>
                      <p class="text-gray-900 font-medium text-lg">{{ selectedBook.language?.name }}</p>
                    </div>
                    <div v-if="selectedBook.donated_by">
                      <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Donated By</span>
                      <p class="text-gray-900 font-medium text-lg">{{ selectedBook.donated_by }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Author Details Section -->
            <div class="border-t border-gray-200 mt-8 pt-8">
              <h4 class="text-xl font-bold text-gray-900 mb-4">About the Author</h4>
              <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Biography</span>
                    <p class="text-gray-700 leading-relaxed mt-2">{{ selectedBook.author?.biography }}</p>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Birth Date</span>
                      <p class="text-gray-900 font-medium text-lg">
                        {{ new Date(selectedBook.author?.birth_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long', day: 'numeric'
                        }) }}
                      </p>
                    </div>
                    <div>
                      <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nationality</span>
                      <p class="text-gray-900 font-medium text-lg">{{ selectedBook.author?.nationality }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Image Modal -->
    <div v-if="showFullImage"
      class="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
      <div class="relative max-w-4xl max-h-[90vh]">
        <button @click="showFullImage = false"
          class="absolute -top-12 right-0 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          aria-label="Close full image">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="selectedBook.cover_image_url" :alt="selectedBook.title + ' cover - full size'"
          class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
      </div>
    </div>

    <!-- Book Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <!-- Form Header -->
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ form.id ? 'Edit Book' : 'Add New Book' }}</h2>
                <p class="text-sm text-gray-500">{{ form.id ? 'Update book information' : 'Fill in the details below' }}
                </p>
              </div>
            </div>
            <button @click="closeForm"
              class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center group">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <!-- Form Content -->
        <form @submit.prevent="submitForm" class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Basic Information Section -->
            <div class="lg:col-span-2">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                Basic Information
              </h3>
            </div>
            <!-- Title -->
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Title *
              </label>
              <input v-model="form.title" required type="text" class="form-input" placeholder="Enter book title" />
            </div>
            <!-- ISBN -->
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                ISBN
              </label>
              <input v-model="form.isbn" type="text" class="form-input" placeholder="978-0-123456-78-9" />
            </div>
            <!-- Quantity -->
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Quantity *
              </label>
              <input v-model="form.quantity" required type="number" min="1" class="form-input" placeholder="1" />
            </div>
            <!-- Publication Year -->
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Publication Year
              </label>
              <input v-model="form.public_year" type="number" min="1000" max="2024" class="form-input"
                placeholder="2024" />
            </div>
            <!-- Additional Information Section -->
            <div class="lg:col-span-2 mt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                Additional Information
              </h3>
            </div>
            <!-- Donated By -->
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Donated By
              </label>
              <input v-model="form.donated_by" type="text" class="form-input" placeholder="Donor name" />
            </div>
            <!-- Author ID -->
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Author ID *
              </label>
              <select v-model="form.AuthorId" required class="form-input">
                <option disabled value="">Select Author</option>
                <option v-for="author in authors" :key="author.id" :value="author.id">
                  {{ author.name }}
                </option>
              </select>
            </div>
            <!-- Category ID -->
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Category ID *
              </label>
              <select v-model="form.CategoryId" required class="form-input">
                <option disabled value="">Select Category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <!-- Language ID -->
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Language ID *
              </label>
              <select v-model="form.language_id" required class="form-input">
                <option disabled value="">Select Language</option>
                <option v-for="language in languages" :key="language.id" :value="language.id">
                  {{ language.name }}
                </option>
              </select>
            </div>
            <!-- Description -->
            <div class="lg:col-span-2 form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </label>
              <textarea v-model="form.description" rows="4" class="form-input resize-none"
                placeholder="Enter book description..."></textarea>
            </div>
            <!-- Cover Image -->
            <div class="lg:col-span-2 form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Cover Image
              </label>
              <div class="file-upload-area">
                <input type="file" @change="handleFile" class="file-input" accept="image/*" id="cover-image" />
                <label for="cover-image" class="file-upload-label">
                  <div class="file-upload-content">
                    <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="text-sm font-medium text-gray-700">Click to upload cover image</p>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
              </div>
              <div v-if="previewImage" class="mt-4">
                <img :src="previewImage" alt="Preview" class="w-40 h-56 object-cover rounded-lg border" />
              </div>
            </div>
          </div>
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button type="button" @click="closeForm" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ form.id ? 'Update Book' : 'Create Book' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import {
  getBooks,
  getCategories,
  getLanguages,
  getAuthors,
  createBook as apiCreateBook,
  updateBook,
  deleteBook,
} from '@/services/Api/book'
import Swal from 'sweetalert2'

// --- Reactive State ---

// Book data
const books = ref([])
const authors = ref([])
const categories = ref([])
const languages = ref([])

const filteredBooks = ref([]);
const filterType = ref('all');
const LIMIT_THRESHOLD = 3;

// UI state
const showForm = ref(false)
const showDetail = ref(false)
const showFullImage = ref(false)
const openActionMenu = ref(null)

// Selected and form state
const selectedBook = ref(null)
const form = ref({})
const imageFile = ref(null)
const previewImage = ref(null)

// --- Lifecycle: Fetch on mount ---
onMounted(async () => {
  await fetchBooks()
})

// --- API Calls ---

const fetchBooks = async () => {
  try {
    const [booksRes, authorsRes, categoriesRes, languagesRes] = await Promise.all([
      getBooks(),
      getAuthors(),
      getCategories(),
      getLanguages(),
    ])
    books.value = booksRes.data.books
    authors.value = authorsRes.data
    categories.value = categoriesRes.data
    languages.value = languagesRes.data
    applyFilter();
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
}

// Filter books based on filterType
const applyFilter = () => {
  switch (filterType.value) {
    case 'all':
      filteredBooks.value = books.value;
      break;

    case 'new':
      filteredBooks.value = [...books.value]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      break;

    case 'available':
      filteredBooks.value = books.value.filter(b => b.quantity >= 3);
      break;

    case 'limited':
      filteredBooks.value = books.value.filter(b => b.quantity <= LIMIT_THRESHOLD);
      break;

    default:
      filteredBooks.value = books.value;
  }
};


// Handlers for card clicks
const viewAllBooks = () => {
  filterType.value = 'all';
  applyFilter();
  // show your books list UI or navigate
};

const viewAvailableBooks = () => {
  filterType.value = 'available';
  applyFilter();
};

// --- UI Functions ---

const handleClickOutside = (event) => {
  const actionMenus = document.querySelectorAll('[data-action-menu]')
  let clickedInside = false

  actionMenus.forEach((menu) => {
    if (menu.contains(event.target)) {
      clickedInside = true
    }
  })

  if (!clickedInside) {
    openActionMenu.value = null
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})


const toggleActionMenu = (id) => {
  openActionMenu.value = openActionMenu.value === id ? null : id
}

const viewBook = (book) => {
  selectedBook.value = book
  showDetail.value = true
  openActionMenu.value = null
}

const closeDetail = () => {
  showDetail.value = false
  selectedBook.value = null
}

const openFullImage = (book) => {
  selectedBook.value = book
  showFullImage.value = true
}

// --- Form Functions ---

const openForm = (book = null) => {
  showForm.value = true
  previewImage.value = null
  openActionMenu.value = null

  if (book) {
    form.value = {
      ...book,
      AuthorId: book.AuthorId,
      CategoryId: book.CategoryId,
      language_id: book.language_id,
    }
    previewImage.value = book.cover_image_url
  } else {
    form.value = {
      title: '',
      isbn: '',
      quantity: 1,
      cover_image: '',
      donated_by: '',
      public_year: '',
      description: '',
      available: true,
      AuthorId: '',
      CategoryId: '',
      language_id: '',
    }
  }

  imageFile.value = null
}

const closeForm = () => {
  showForm.value = false
  form.value = {}
  imageFile.value = null
  previewImage.value = null
}

const handleFile = (e) => {
  const file = e.target.files[0]
  imageFile.value = file
  previewImage.value = file ? URL.createObjectURL(file) : null
}

const submitForm = async () => {
  try {
    const formData = new FormData()
    for (const key in form.value) {
      formData.append(key, form.value[key])
    }

    if (imageFile.value) {
      formData.append('cover_image', imageFile.value)
    }

    if (form.value.id) {
      await updateBook(form.value.id, formData)
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        text: 'The book has been updated successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
    } else {
      await apiCreateBook(formData)
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        text: 'The book has been added successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
    }

    await fetchBooks()
    closeForm()
  } catch (err) {
    console.error('Error submitting form:', err)
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  }
}


const deleteBookById = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "Do you really want to delete this book?",
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await deleteBook(id);
      await fetchBooks();
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Deleted!',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error('Error deleting book:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete the book.',
      });
    }
  }
};


const viewNewBook = () => {
  filterType.value = 'new';
  applyFilter();
};

const viewLimitedBooks = () => {
  filterType.value = 'limited';
  applyFilter();
};
</script>

<style scoped>
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1;
}

.form-input {
  @apply w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400;
}

.form-input:focus {
  @apply shadow-lg;
}

.file-upload-area {
  @apply relative;
}

.file-input {
  @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
}

.file-upload-label {
  @apply block w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-blue-50;
}

.file-upload-content {
  @apply flex flex-col items-center justify-center text-center;
}

.btn-primary {
  @apply inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>