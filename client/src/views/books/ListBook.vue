<template>
  <div class="bg-gray-100 sticky top-10 z-10 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 space-y-5">
      <BookHeader />

      <BookTable :books="books" :categories="categories" :languages="languages" :openActionMenu="openActionMenu"
        @viewBook="viewBook" @openForm="openForm" @deleteBookById="deleteBookById"
        @toggleActionMenu="toggleActionMenu" />

      <BookDetail :showDetail="showDetail" :selectedBook="selectedBook" :showFullImage="showFullImage"
        @closeDetail="closeDetail" @openFullImage="openFullImage" @closeFullImage="closeFullImage"
        @editBook="handleEditBook" />

      <div style="position: absolute; top: 100px; width: 100%; z-index: 1000;">
        <BookForm :showForm="showForm" :form="form" :authors="authors" :categories="categories" :languages="languages"
          :previewImage="previewImage" @closeForm="closeForm" @submitForm="submitForm" @handleFile="handleFile"
          @authorUpdated="handleAuthorUpdate" @categoryUpdated="handleCategoryUpdate" @updateForm="handleFormUpdate" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import Swal from 'sweetalert2'
import BookTable from '@/components/books/BookCollectionComponent.vue'
import BookDetail from '@/components/books/BookDetail.vue'
import BookForm from '@/components/books/BookForm.vue'
import BookHeader from '@/components/books/BookHeader.vue'
import {
  getBooks,
  getCategories,
  getLanguages,
  getAuthors,
  createBook as apiCreateBook,
  updateBook,
  deleteBook,
} from '@/services/Api/book'

// Reactive State
const books = ref([])
const authors = reactive([])
const categories = reactive([])
const languages = reactive([])
const showForm = ref(false)
const showDetail = ref(false)
const showFullImage = ref(false)
const openActionMenu = ref(null)
const selectedBook = ref(null)
const form = ref({})
const imageFile = ref(null)
const previewImage = ref(null)
const updateFromDetail = ref(false)

// Utility to get relational data
const getRelationalData = (book) => ({
  author: authors.find(a => a.id === book.AuthorId) || { name: 'Unknown Author' },
  category: categories.find(c => c.id === book.CategoryId) || { name: 'Unknown Category' },
  language: languages.find(l => l.id === book.language_id) || { name: 'Unknown Language' },
})

// Fetch all data on mount
const fetchBooks = async () => {
  try {
    const [booksRes, authorsRes, categoriesRes, languagesRes] = await Promise.all([
      getBooks(),
      getAuthors(),
      getCategories(),
      getLanguages(),
    ])
    books.value = booksRes.data.books
    authors.splice(0, authors.length, ...authorsRes.data)
    categories.splice(0, categories.length, ...categoriesRes.data)
    languages.splice(0, languages.length, ...languagesRes.data)
    localStorage.setItem('authors', JSON.stringify(authors))
    localStorage.setItem('categories', JSON.stringify(categories))
  } catch (err) {
    console.error('Failed to fetch data:', err)
    const cachedAuthors = localStorage.getItem('authors')
    const cachedCategories = localStorage.getItem('categories')
    if (cachedAuthors) {
      authors.splice(0, authors.length, ...JSON.parse(cachedAuthors))
    }
    if (cachedCategories) {
      categories.splice(0, categories.length, ...JSON.parse(cachedCategories))
    }
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Failed to fetch data',
      text: 'Please try again later.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
  }
}

// Handle author updates from BookForm
const handleAuthorUpdate = (updatedAuthor) => {
  const index = authors.findIndex(a => a.id === updatedAuthor.id)
  if (index !== -1) {
    authors.splice(index, 1, updatedAuthor)
  } else {
    authors.push(updatedAuthor)
  }
  localStorage.setItem('authors', JSON.stringify(authors))
  // Update selectedBook if it references the updated author
  if (selectedBook.value && selectedBook.value.AuthorId === updatedAuthor.id) {
    selectedBook.value = {
      ...selectedBook.value,
      author: updatedAuthor
    }
  }
}

// Handle category updates from BookForm
const handleCategoryUpdate = (updatedCategory) => {
  const index = categories.findIndex(c => c.id === updatedCategory.id)
  if (index !== -1) {
    categories.splice(index, 1, updatedCategory)
  } else {
    categories.push(updatedCategory)
  }
  localStorage.setItem('categories', JSON.stringify(categories))
  // Update selectedBook if it references the updated category
  if (selectedBook.value && selectedBook.value.CategoryId === updatedCategory.id) {
    selectedBook.value = {
      ...selectedBook.value,
      category: updatedCategory
    }
  }
}

onMounted(() => {
  fetchBooks()
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleEsc)
})

// Scroll lock on modal open
watch([showForm, showDetail, showFullImage], ([f, d, img]) => {
  document.body.style.overflow = f || d || img ? 'hidden' : ''
})

// Handle outside click for action menus
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

// Action menu toggle
const toggleActionMenu = (id) => {
  openActionMenu.value = openActionMenu.value === id ? null : id
}

// View book detail
const viewBook = (book) => {
  selectedBook.value = { ...book, ...getRelationalData(book) }
  showDetail.value = true
  openActionMenu.value = null
  updateFromDetail.value = false
}

// Close book detail modal
const closeDetail = () => {
  showDetail.value = false
  selectedBook.value = null
  showFullImage.value = false
}

// Open full image viewer inside detail modal
const openFullImage = () => {
  showFullImage.value = true
}

// Close full image viewer
const closeFullImage = () => {
  showFullImage.value = false
}

// Open form modal for add or edit
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

// Handle edit book from detail view
const handleEditBook = (book) => {
  closeDetail()
  openForm(book)
  updateFromDetail.value = true
}

// Close form modal
const closeForm = () => {
  showForm.value = false
  form.value = {}
  imageFile.value = null
  previewImage.value = null
}

// Handle file input change for cover image
const handleFile = (e) => {
  const file = e.target.files[0]
  imageFile.value = file
  previewImage.value = file ? URL.createObjectURL(file) : null
}

// Submit form (for create or final update)
const submitForm = async () => {
  try {
    // Log FormData for debugging
    const formData = new FormData()
    for (const key in form.value) {
      if (form.value[key] !== null && form.value[key] !== undefined && form.value[key] !== '') {
        formData.append(key, form.value[key])
      }
    }

    if (imageFile.value) {
      formData.append('cover_image', imageFile.value)
    }

    // Debug: Log FormData entries
    console.log('FormData entries:', [...formData.entries()])

    let bookWithRelations
    if (form.value.id) {
      // UPDATE BOOK
      const res = await updateBook(form.value.id, formData)
      const updatedBook = res.data.book
      bookWithRelations = {
        ...updatedBook,
        cover_image_url: updatedBook.cover_image_url
          ? `${updatedBook.cover_image_url}${updatedBook.cover_image_url.includes('?') ? '&' : '?'}t=${Date.now()}`
          : '/path/to/fallback-image.jpg',
        ...getRelationalData(updatedBook),
      }

      const index = books.value.findIndex(book => book.id === form.value.id)
      if (index !== -1) {
        books.value.splice(index, 1, bookWithRelations)
      }

      if (updateFromDetail.value) {
        selectedBook.value = bookWithRelations
        showDetail.value = true
      }

      Swal.fire({
        toast: true,
        position: 'bottom-end',
        text: 'The book has been updated successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      })
    } else {
      // CREATE BOOK
      const res = await apiCreateBook(formData)
      const newBook = res.data.book
      bookWithRelations = {
        ...newBook,
        cover_image_url: newBook.cover_image_url
          ? `${newBook.cover_image_url}${newBook.cover_image_url.includes('?') ? '&' : '?'}t=${Date.now()}`
          : '/path/to/fallback-image.jpg',
        ...getRelationalData(newBook),
      }

      books.value.unshift(bookWithRelations)
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        text: 'The book has been added successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      })
    }

    closeForm()
  } catch (err) {
    console.error('Error submitting form:', err, err.response?.data)
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Failed to save book',
      text: err.response?.data?.message || 'Please check the form and try again.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
  }
}

// Delete book by ID with confirmation
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
  })

  if (result.isConfirmed) {
    try {
      await deleteBook(id)
      books.value = books.value.filter(book => book.id !== id)
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Deleted!',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })
    } catch (err) {
      console.error('Error deleting book:', err, err.response?.data)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to delete the book.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    }
  }
}

// ESC key closes modals
const handleEsc = (e) => {
  if (e.key === 'Escape') {
    if (showForm.value) closeForm()
    if (showFullImage.value) closeFullImage()
    if (showDetail.value) closeDetail()
  }
}
</script>