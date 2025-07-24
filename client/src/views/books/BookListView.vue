<template>
  <div class="p-6 space-y-6">
    <!-- Header and Add Button -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-700">Book List</h2>
        <p class="text-sm text-gray-500">
          Browse all books available in the library system. Use the search or filters to find what you need quickly.
        </p>
      </div>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        @click="showAddBookModal = true"
      >
        + Add Book
      </button>
    </div>

    <!-- Filter Tabs - Full Width -->
    <div class="bg-white p-4 rounded-xl shadow-sm">
      <div class="flex gap-4 w-full">
        <div
          v-for="tab in tabs"
          :key="tab.name"
          @click="activeTab = tab.name"
          :class="[
            'flex-1 px-6 py-3 rounded-lg border text-center cursor-pointer transition',
            activeTab === tab.name
              ? 'bg-blue-100 border-blue-400'
              : 'bg-white hover:bg-blue-50 border-blue-300'
          ]"
        >
          <p class="font-medium text-gray-700">{{ tab.label }}</p>
          <span class="text-xs text-blue-600 underline">View</span>
        </div>
      </div>
    </div>

    <!-- Book Table -->
    <div class="overflow-x-auto bg-white rounded-xl shadow border border-blue-300">
      <table class="min-w-full text-sm text-left">
        <thead class="bg-gray-100 text-gray-600 uppercase">
          <tr>
            <th class="px-6 py-3">Image</th>
            <th class="px-6 py-3">Title</th>
            <th class="px-6 py-3">Author</th>
            <th class="px-6 py-3">Category</th>
            <th class="px-6 py-3">Lang</th>
            <th class="px-6 py-3">Qty</th>
            <th class="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr
            v-for="book in books"
            :key="book.id"
            class="border-t hover:bg-gray-50 cursor-pointer"
            @click="viewBookDetail(book)"
          >
            <td class="px-6 py-3">
              <img :src="book.image" alt="book" class="w-10 h-10 rounded-full object-cover" />
            </td>
            <td class="px-6 py-3 font-semibold">{{ book.title }}</td>
            <td class="px-6 py-3">{{ book.author }}</td>
            <td class="px-6 py-3">{{ book.category }}</td>
            <td class="px-6 py-3">{{ book.language }}</td>
            <td class="px-6 py-3">{{ book.quantity }}</td>
            <td class="px-6 py-3 text-right relative" @click.stop>
              <button 
                @click="toggleActionMenu(book.id)"
                class="text-gray-500 hover:text-gray-800 p-1 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v.01M12 12v.01M12 18v.01" />
                </svg>
              </button>
              
              <!-- Action Dropdown Menu -->
              <div 
                v-if="activeActionMenu === book.id"
                class="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
              >
                <button
                  @click="editBook(book)"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  @click="confirmDelete(book)"
                  class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Book Detail Modal -->
    <div
      v-if="showBookDetailModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      @click="closeBookDetailModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div v-if="bookDetailError" class="p-6 text-center">
          <div class="mb-4">
            <svg class="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Book Details</h3>
          <p class="text-gray-600 mb-4">{{ bookDetailError }}</p>
          <button
            @click="closeBookDetailModal"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>

        <div v-else-if="selectedBook" class="book-detail-container">
          <!-- Header -->
          <div class="detail-header">
            <div class="header-content">
              <div class="header-icon">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div>
                <h2 class="detail-title">Book Details</h2>
                <p class="detail-subtitle">Library Management System</p>
              </div>
            </div>
            <button @click="closeBookDetailModal" class="close-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Book Details Content -->
          <div class="detail-content">
            <div class="detail-grid">
              <!-- Book Cover -->
              <div class="book-cover-section">
                <img 
                  :src="selectedBook.image" 
                  :alt="selectedBook.title"
                  class="book-cover-image"
                />
              </div>

              <!-- Book Information -->
              <div class="book-info-section">
                <div class="info-group">
                  <label class="info-label">Title</label>
                  <p class="info-value">{{ selectedBook.title }}</p>
                </div>

                <div class="info-group">
                  <label class="info-label">Author(s)</label>
                  <p class="info-value">{{ selectedBook.author }}</p>
                </div>

                <div class="info-row">
                  <div class="info-group">
                    <label class="info-label">Category</label>
                    <p class="info-value">{{ selectedBook.category }}</p>
                  </div>

                  <div class="info-group">
                    <label class="info-label">Language</label>
                    <p class="info-value">{{ selectedBook.language }}</p>
                  </div>
                </div>

                <div class="info-row">
                  <div class="info-group">
                    <label class="info-label">Quantity Available</label>
                    <p class="info-value">{{ selectedBook.quantity }}</p>
                  </div>

                  <div class="info-group">
                    <label class="info-label">Status</label>
                    <span :class="[
                      'status-badge',
                      selectedBook.status === 'available' ? 'status-available' : 'status-borrowed'
                    ]">
                      {{ selectedBook.status === 'available' ? 'Available' : 'Borrowed' }}
                    </span>
                  </div>
                </div>

                <div class="info-group">
                  <label class="info-label">Description</label>
                  <p class="info-value description">
                    {{ selectedBook.description || 'No description available for this book.' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="detail-actions">
              <button
                @click="editBook(selectedBook)"
                class="btn-edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Book
              </button>
              <button
                @click="closeBookDetailModal"
                class="btn-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Book Modal -->
    <div
      v-if="showAddBookModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
        @click.stop
      >
        <div class="form-container">
          <!-- Professional Header -->
          <div class="form-header">
            <div class="header-content">
              <div class="header-icon">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div>
                <h2 class="form-title">Add New Book</h2>
                <p class="form-subtitle">Library Management System</p>
              </div>
            </div>
            <button @click="showAddBookModal = false" class="close-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
                          
          <form @submit.prevent="submitForm" novalidate class="add-book-form">
            <!-- Title and Author Row -->
            <div class="form-row">
              <div class="form-group">
                <label for="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  v-model="book.title"
                  class="form-input"
                  placeholder="Enter book title"
                />
                <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
              </div>

              <div class="form-group">
                <label for="author">Author Name</label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  v-model="book.author"
                  class="form-input"
                  placeholder="Enter author name"
                />
                <p v-if="errors.author" class="form-error">{{ errors.author }}</p>
              </div>
            </div>

            <!-- Category and Language Row -->
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  v-model="book.category"
                  class="form-input"
                  placeholder="Category"
                />
                <p v-if="errors.category" class="form-error">{{ errors.category }}</p>
              </div>

              <div class="form-group">
                <label for="language">Language</label>
                <input
                  id="language"
                  name="language"
                  type="text"
                  v-model="book.language"
                  class="form-input"
                  placeholder="English, Khmer"
                />
                <p v-if="errors.language" class="form-error">{{ errors.language }}</p>
              </div>
            </div>

            <!-- Quantity and Status Row -->
            <div class="form-row">
              <div class="form-group">
                <label for="quantity">Quantity</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  v-model.number="book.quantity"
                  min="1"
                  class="form-input"
                  placeholder="Quantity"
                />
                <p v-if="errors.quantity" class="form-error">{{ errors.quantity }}</p>
              </div>

              <div class="form-group">
                <label for="status">Availability Status</label>
                <select
                  id="status"
                  name="status"
                  v-model="book.status"
                  class="form-input"
                >
                  <option disabled value="">Select status</option>
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                </select>
                <p v-if="errors.status" class="form-error">{{ errors.status }}</p>
              </div>
            </div>

            <!-- Image File Upload -->
            <div class="form-group">
              <label for="image">Book Cover Image</label>
              <input
                id="image"
                name="image"
                type="file"
                @change="handleFileUpload"
                class="form-input file-input"
                accept="image/*"
              />
              <p class="input-help">Upload a clear image of the book cover (JPG, PNG)</p>
              <p v-if="errors.image" class="form-error">{{ errors.image }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button type="button" @click="showAddBookModal = false" class="btn-cancel">
                Cancel
              </button>
              <button type="submit" class="btn-submit">
                Add to Library
              </button>
            </div>
          </form>

          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="form-success-message">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ successMessage }}
          </div>
          <div v-if="serverError" class="form-error-message">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ serverError }}
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Book Modal -->
    <div
      v-if="showEditBookModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      @click="closeEditModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
        @click.stop
      >
        <div class="form-container">
          <!-- Professional Header -->
          <div class="form-header">
            <div class="header-content">
              <div class="header-icon">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div>
                <h2 class="form-title">Edit Book</h2>
                <p class="form-subtitle">Library Management System</p>
              </div>
            </div>
            <button @click="showEditBookModal = false" class="close-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
                          
          <form @submit.prevent="submitEditForm" novalidate class="add-book-form">
            <!-- Title and Author Row -->
            <div class="form-row">
              <div class="form-group">
                <label for="edit-title">Title</label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  v-model="editingBook.title"
                  class="form-input"
                  placeholder="Enter book title"
                />
                <p v-if="editErrors.title" class="form-error">{{ editErrors.title }}</p>
              </div>

              <div class="form-group">
                <label for="edit-author">Author Name</label>
                <input
                  id="edit-author"
                  name="author"
                  type="text"
                  v-model="editingBook.author"
                  class="form-input"
                  placeholder="Enter author name"
                />
                <p v-if="editErrors.author" class="form-error">{{ editErrors.author }}</p>
              </div>
            </div>

            <!-- Category and Language Row -->
            <div class="form-row">
              <div class="form-group">
                <label for="edit-category">Category</label>
                <input
                  id="edit-category"
                  name="category"
                  type="text"
                  v-model="editingBook.category"
                  class="form-input"
                  placeholder="Category"
                />
                <p v-if="editErrors.category" class="form-error">{{ editErrors.category }}</p>
              </div>

              <div class="form-group">
                <label for="edit-language">Language</label>
                <input
                  id="edit-language"
                  name="language"
                  type="text"
                  v-model="editingBook.language"
                  class="form-input"
                  placeholder="English, Khmer"
                />
                <p v-if="editErrors.language" class="form-error">{{ editErrors.language }}</p>
              </div>
            </div>

            <!-- Quantity and Status Row -->
            <div class="form-row">
              <div class="form-group">
                <label for="edit-quantity">Quantity</label>
                <input
                  id="edit-quantity"
                  name="quantity"
                  type="number"
                  v-model.number="editingBook.quantity"
                  min="1"
                  class="form-input"
                  placeholder="Quantity"
                />
                <p v-if="editErrors.quantity" class="form-error">{{ editErrors.quantity }}</p>
              </div>

              <div class="form-group">
                <label for="edit-status">Availability Status</label>
                <select
                  id="edit-status"
                  name="status"
                  v-model="editingBook.status"
                  class="form-input"
                >
                  <option disabled value="">Select status</option>
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                </select>
                <p v-if="editErrors.status" class="form-error">{{ editErrors.status }}</p>
              </div>
            </div>

            <!-- Image File Upload -->
            <div class="form-group">
              <label for="edit-image">Book Cover Image</label>
              <input
                id="edit-image"
                name="image"
                type="file"
                @change="handleEditFileUpload"
                class="form-input file-input"
                accept="image/*"
              />
              <p class="input-help">Upload a clear image of the book cover (JPG, PNG) - Leave empty to keep current image</p>
              <p v-if="editErrors.image" class="form-error">{{ editErrors.image }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button type="button" @click="showEditBookModal = false" class="btn-cancel">
                Cancel
              </button>
              <button type="submit" class="btn-submit">
                Update Book
              </button>
            </div>
          </form>

          <!-- Success/Error Messages -->
          <div v-if="editSuccessMessage" class="form-success-message">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ editSuccessMessage }}
          </div>
          <div v-if="editServerError" class="form-error-message">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ editServerError }}
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteModal = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6"
        @click.stop
      >
        <div class="text-center">
          <div class="mb-4">
            <svg class="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Do you want to delete this book?</h3>
          <div class="flex gap-3 justify-center mt-6">
            <button
              @click="showDeleteModal = false"
              class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Cancel
            </button>
            <button
              @click="deleteBook"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Success Modal -->
    <div
      v-if="showDeleteSuccessModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteSuccessModal = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6"
        @click.stop
      >
        <div class="text-center">
          <div class="mb-4">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Book deleted successfully</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const activeTab = ref('all')
const showAddBookModal = ref(false)
const showEditBookModal = ref(false)
const showDeleteModal = ref(false)
const showDeleteSuccessModal = ref(false)
const showBookDetailModal = ref(false)
const activeActionMenu = ref(null)
const bookToDelete = ref(null)
const selectedBook = ref(null)
const bookDetailError = ref('')

const tabs = [
  { name: 'all', label: 'All Books' },
  { name: 'new', label: 'New Books' },
  { name: 'last', label: 'Last Book' }
]

const books = ref([
  {
    id: 1,
    title: "Unfinished",
    author: "Priyanka Chopra Jonas",
    category: "Non-fiction",
    language: "English",
    quantity: 100,
    status: "available",
    description: "A memoir by actress and global icon Priyanka Chopra Jonas, sharing her journey from Bollywood to Hollywood and her experiences as a global citizen.",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d0/Unfinished_Priyanka_Chopra_book.jpg",
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    language: "English",
    quantity: 75,
    status: "available",
    description: "A philosophical novel about a young shepherd's journey to find treasure, teaching us about following our dreams and listening to our hearts.",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d0/Unfinished_Priyanka_Chopra_book.jpg",
  },
])

const book = reactive({
  title: '',
  author: '',
  category: '',
  language: '',
  quantity: null,
  status: '',
})

const editingBook = reactive({
  id: null,
  title: '',
  author: '',
  category: '',
  language: '',
  quantity: null,
  status: '',
})

const imageFile = ref(null)
const editImageFile = ref(null)
const errors = reactive({})
const editErrors = reactive({})
const successMessage = ref('')
const serverError = ref('')
const editSuccessMessage = ref('')
const editServerError = ref('')

// Close action menu when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeActionMenu.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleActionMenu = (bookId) => {
  activeActionMenu.value = activeActionMenu.value === bookId ? null : bookId
}

const viewBookDetail = async (bookData) => {
  try {
    bookDetailError.value = ''
    selectedBook.value = null
    showBookDetailModal.value = true
    
    // Simulate API call to fetch book details
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // In a real app, you would fetch from API: const response = await axios.get(`/api/books/${bookData.id}`)
    selectedBook.value = bookData
    
  } catch (error) {
    console.error('Error fetching book details:', error)
    bookDetailError.value = 'Failed to load book details. Please try again.'
  }
}

const closeBookDetailModal = () => {
  showBookDetailModal.value = false
  selectedBook.value = null
  bookDetailError.value = ''
}

const editBook = (bookData) => {
  Object.assign(editingBook, {
    id: bookData.id,
    title: bookData.title,
    author: bookData.author,
    category: bookData.category,
    language: bookData.language,
    quantity: bookData.quantity,
    status: bookData.status,
  })
  showEditBookModal.value = true
  showBookDetailModal.value = false
  activeActionMenu.value = null
}

const confirmDelete = (bookData) => {
  bookToDelete.value = bookData
  showDeleteModal.value = true
  activeActionMenu.value = null
}

const deleteBook = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Remove book from the list
    const index = books.value.findIndex(b => b.id === bookToDelete.value.id)
    if (index > -1) {
      books.value.splice(index, 1)
    }
    
    showDeleteModal.value = false
    showDeleteSuccessModal.value = true
    
    // Auto close success modal after 2 seconds
    setTimeout(() => {
      showDeleteSuccessModal.value = false
    }, 2000)
    
  } catch (error) {
    console.error('Error deleting book:', error)
    showDeleteModal.value = false
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
  }
}

const handleEditFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    editImageFile.value = file
  }
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  successMessage.value = ''
  serverError.value = ''

  let valid = true

  if (!book.title) {
    errors.title = 'Title is required'
    valid = false
  }

  if (!book.author) {
    errors.author = 'Author is required'
    valid = false
  }

  if (!book.category) {
    errors.category = 'Category is required'
    valid = false
  }

  if (!book.language) {
    errors.language = 'Language is required'
    valid = false
  }

  if (!book.quantity || book.quantity < 1 || !Number.isInteger(book.quantity)) {
    errors.quantity = 'Quantity must be a positive integer'
    valid = false
  }

  if (!book.status) {
    errors.status = 'Status is required'
    valid = false
  }

  if (!imageFile.value) {
    errors.image = 'Book image is required'
    valid = false
  }

  return valid
}

const validateEditForm = () => {
  Object.keys(editErrors).forEach(key => delete editErrors[key])
  editSuccessMessage.value = ''
  editServerError.value = ''

  let valid = true

  if (!editingBook.title) {
    editErrors.title = 'Title is required'
    valid = false
  }

  if (!editingBook.author) {
    editErrors.author = 'Author is required'
    valid = false
  }

  if (!editingBook.category) {
    editErrors.category = 'Category is required'
    valid = false
  }

  if (!editingBook.language) {
    editErrors.language = 'Language is required'
    valid = false
  }

  if (!editingBook.quantity || editingBook.quantity < 1 || !Number.isInteger(editingBook.quantity)) {
    editErrors.quantity = 'Quantity must be a positive integer'
    valid = false
  }

  if (!editingBook.status) {
    editErrors.status = 'Status is required'
    valid = false
  }

  return valid
}

const submitForm = async () => {
  if (!validateForm()) return

  const formData = new FormData()
  formData.append('title', book.title)
  formData.append('author', book.author)
  formData.append('category', book.category)
  formData.append('language', book.language)
  formData.append('quantity', book.quantity)
  formData.append('status', book.status)
  formData.append('image', imageFile.value)

  try {
    await axios.post('/api/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    successMessage.value = 'Book added successfully!'

    // Add to local books array (simulate)
    const newBook = {
      id: Date.now(),
      title: book.title,
      author: book.author,
      category: book.category,
      language: book.language,
      quantity: book.quantity,
      status: book.status,
      description: '',
      image: URL.createObjectURL(imageFile.value)
    }
    books.value.push(newBook)

    // Reset form
    Object.assign(book, {
      title: '',
      author: '',
      category: '',
      language: '',
      quantity: null,
      status: '',
    })
    imageFile.value = null

    // Close modal after successful submission
    setTimeout(() => {
      showAddBookModal.value = false
      successMessage.value = ''
    }, 2000)

  } catch (error) {
    if (error.response?.status === 422) {
      const serverErrors = error.response.data.errors
      for (const key in serverErrors) {
        errors[key] = serverErrors[key][0]
      }
    } else {
      serverError.value = 'Failed to add book. Please try again.'
    }
  }
}

const submitEditForm = async () => {
  if (!validateEditForm()) return

  const formData = new FormData()
  formData.append('title', editingBook.title)
  formData.append('author', editingBook.author)
  formData.append('category', editingBook.category)
  formData.append('language', editingBook.language)
  formData.append('quantity', editingBook.quantity)
  formData.append('status', editingBook.status)
  if (editImageFile.value) {
    formData.append('image', editImageFile.value)
  }

  try {
    await axios.put(`/api/books/${editingBook.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    editSuccessMessage.value = 'Book updated successfully!'

    // Update local books array (simulate)
    const index = books.value.findIndex(b => b.id === editingBook.id)
    if (index > -1) {
      books.value[index] = {
        ...books.value[index],
        title: editingBook.title,
        author: editingBook.author,
        category: editingBook.category,
        language: editingBook.language,
        quantity: editingBook.quantity,
        status: editingBook.status,
        image: editImageFile.value ? URL.createObjectURL(editImageFile.value) : books.value[index].image
      }
    }

    // Close modal after successful submission
    setTimeout(() => {
      showEditBookModal.value = false
      editSuccessMessage.value = ''
    }, 2000)

  } catch (error) {
    if (error.response?.status === 422) {
      const serverErrors = error.response.data.errors
      for (const key in serverErrors) {
        editErrors[key] = serverErrors[key][0]
      }
    } else {
      editServerError.value = 'Failed to update book. Please try again.'
    }
  }
}

const closeModal = () => {
  showAddBookModal.value = false
  Object.assign(book, {
    title: '',
    author: '',
    category: '',
    language: '',
    quantity: null,
    status: '',
  })
  imageFile.value = null
  Object.keys(errors).forEach(key => delete errors[key])
  successMessage.value = ''
  serverError.value = ''
}

const closeEditModal = () => {
  showEditBookModal.value = false
  Object.assign(editingBook, {
    id: null,
    title: '',
    author: '',
    category: '',
    language: '',
    quantity: null,
    status: '',
  })
  editImageFile.value = null
  Object.keys(editErrors).forEach(key => delete editErrors[key])
  editSuccessMessage.value = ''
  editServerError.value = ''
}
</script>

<style scoped>
/* Professional Library Form Container */
.form-container {
  background: linear-gradient(135deg, #7fb1e2 0%, #e2e8f0 80%);
  border-radius: 12px;
  padding: 1.25rem;
  position: relative;
  border: 1px solid #cbd5e1;
}

.form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 12px 12px 0 0;
}

/* Professional Header */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  background: #eff6ff;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #dbeafe;
}

.form-title {
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
}

.form-subtitle {
  color: #64748b;
  font-size: 0.75rem;
  margin: 0;
  font-weight: 500;
}

.close-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #374151;
}

/* Professional Form Layout */
.add-book-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  font-size: 0.8rem;
  color: #374151;
  margin-bottom: 0.3rem;
  letter-spacing: 0.025em;
}

.form-input {
  padding: 0.5rem 0.625rem;
  font-size: 0.8rem;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:hover {
  border-color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: #ffffff;
}

.form-input:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

/* File Input Styling */
.file-input {
  padding: 0.4rem;
  cursor: pointer;
  background: #f8fafc;
  border: 1.5px dashed #cbd5e1;
}

.file-input::-webkit-file-upload-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 0.4rem;
  transition: all 0.2s ease;
  font-size: 0.75rem;
}

.file-input::-webkit-file-upload-button:hover {
  background: #2563eb;
}

.input-help {
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 0.2rem;
  font-style: italic;
}

/* Select Dropdown */
select.form-input {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.4rem center;
  background-repeat: no-repeat;
  background-size: 1em 1em;
  padding-right: 1.8rem;
}

/* Error Messages */
.form-error {
  color: #dc2626;
  font-size: 0.7rem;
  font-weight: 500;
  background: #fef2f2;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #dc2626;
  margin-top: 0.3rem;
}

/* Success/Error Messages */
.form-success-message,
.form-error-message {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  margin-top: 0.875rem;
  border: 1px solid;
}

.form-success-message {
  color: #059669;
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.form-error-message {
  color: #dc2626;
  background: #fef2f2;
  border-color: #fecaca;
}

/* Action Buttons */
.form-actions {
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
  margin-top: 1.25rem;
  padding-top: 0.875rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 0.5rem 0.875rem;
  font-weight: 600;
  font-size: 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  letter-spacing: 0.025em;
}

.btn-cancel {
  background: #f8fafc;
  color: #475569;
  border: 1.5px solid #cbd5e1;
}

.btn-cancel:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.btn-submit {
  background: #3b82f6;
  color: white;
  border: 1.5px solid #3b82f6;
}

.btn-submit:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-submit:active {
  background: #1d4ed8;
}

/* Book Detail Modal Styles */
.book-detail-container {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  overflow: hidden;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-bottom: 2px solid #e2e8f0;
}

.detail-title {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.detail-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  font-weight: 500;
}

.detail-content {
  padding: 1.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.book-cover-section {
  display: flex;
  justify-content: center;
}

.book-cover-image {
  width: 180px;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.book-info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-group {
  display: flex;
  flex-direction: column;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .info-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

.info-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.25rem;
  letter-spacing: 0.025em;
}

.info-value {
  color: #1f2937;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.info-value.description {
  color: #4b5563;
  line-height: 1.6;
  font-style: italic;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-available {
  background: #dcfce7;
  color: #166534;
}

.status-borrowed {
  background: #fef3c7;
  color: #92400e;
}

.detail-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-edit,
.btn-close {
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-close {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-close:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .form-container {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit {
    flex: none;
  }

  .detail-actions {
    flex-direction: column;
  }
  
  .btn-edit,
  .btn-close {
    justify-content: center;
  }
}
</style>