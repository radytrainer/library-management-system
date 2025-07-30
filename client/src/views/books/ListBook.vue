<template>
  <div class="bg-gray-100 sticky top-10 z-10 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 space-y-5">
      <!-- Book Table Section -->
      <BookHeader />

      <BookTable :books="books" :categories="categories" :languages="languages" :openActionMenu="openActionMenu"
        @viewBook="viewBook" @openForm="openForm" @deleteBookById="deleteBookById"
        @toggleActionMenu="toggleActionMenu" />

      <!-- Book Detail Modal -->
      <BookDetail :showDetail="showDetail" :selectedBook="selectedBook" :showFullImage="showFullImage"
        @closeDetail="closeDetail" @openFullImage="openFullImage" @closeFullImage="closeFullImage" />

      <!-- Book Form Modal -->
      <div style="position: absolute; top: 100px; width: 100%; z-index: 1000;">
        <BookForm :showForm="showForm" :form="form" :authors="authors" :categories="categories" :languages="languages"
          :previewImage="previewImage" @closeForm="closeForm" @submitForm="submitForm" @handleFile="handleFile"
          @openAuthorForm="showAuthorForm = true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
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
const authors = ref([])
const categories = ref([])
const languages = ref([])

const showForm = ref(false)
const showDetail = ref(false)
const showFullImage = ref(false)
const openActionMenu = ref(null)

const selectedBook = ref(null)
const form = ref({})
const imageFile = ref(null)
const previewImage = ref(null)

const showAuthorForm = ref(false) // if you have a nested author form popup

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
    authors.value = authorsRes.data
    categories.value = categoriesRes.data
    languages.value = languagesRes.data
  } catch (err) {
    console.error('Failed to fetch data:', err)
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
  selectedBook.value = book
  showDetail.value = true
  openActionMenu.value = null
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

// In ListBook.vue, update the submitForm function
const submitForm = async () => {
  try {
    const formData = new FormData();
    for (const key in form.value) {
      formData.append(key, form.value[key]);
    }

    if (imageFile.value) {
      formData.append('cover_image', imageFile.value);
    }

    let updatedBook;
    if (form.value.id) {
      // UPDATE BOOK
      const res = await updateBook(form.value.id, formData);
      updatedBook = res.data.book;
      console.log('Update response:', updatedBook); // Debug log
      const index = books.value.findIndex(book => book.id === form.value.id);

      if (index !== -1) {
        const newCoverImageUrl = updatedBook.cover_image_url
          ? `${updatedBook.cover_image_url}${updatedBook.cover_image_url.includes('?') ? '&' : '?'}t=${Date.now()}`
          : '/path/to/fallback-image.jpg';
        books.value.splice(index, 1, {
          ...updatedBook,
          cover_image_url: newCoverImageUrl,
          author: updatedBook.author || authors.value.find(a => a.id === form.value.AuthorId) || { name: 'Unknown Author' },
          category: updatedBook.category || categories.value.find(c => c.id === form.value.CategoryId) || { name: 'Unknown Category' },
          language: updatedBook.language || languages.value.find(l => l.id === form.value.language_id) || { name: 'Unknown Language' },
        });
      }

      Swal.fire({
        toast: true,
        position: 'bottom-end',
        text: 'The book has been updated successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      // CREATE BOOK
      const res = await apiCreateBook(formData);
      const newBook = res.data.book;
      console.log('Create response:', newBook); // Debug log

      books.value.unshift({
        ...newBook,
        cover_image_url: newBook.cover_image_url
          ? `${newBook.cover_image_url}${newBook.cover_image_url.includes('?') ? '&' : '?'}t=${Date.now()}`
          : '/path/to/fallback-image.jpg',
        author: newBook.author || authors.value.find(a => a.id === form.value.AuthorId) || { name: 'Unknown Author' },
        category: newBook.category || categories.value.find(c => c.id === form.value.CategoryId) || { name: 'Unknown Category' },
        language: newBook.language || languages.value.find(l => l.id === form.value.language_id) || { name: 'Unknown Language' },
      });

      Swal.fire({
        toast: true,
        position: 'bottom-end',
        text: 'The book has been added successfully.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }

    closeForm();
  } catch (err) {
    console.error('Error submitting form:', err);
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
};

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
      await fetchBooks()
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
      console.error('Error deleting book:', err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete the book.',
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
