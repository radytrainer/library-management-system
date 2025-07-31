<template>
  <div>
    <BookOverviewStats :totalBooks="totalBooks" :availableBooks="availableBooks" :categories="categories"
      :languages="languages" />

    <div class="px-6 mb-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">Book Collection</h2>
            <p class="text-gray-500 text-sm mt-1">Manage your library books</p>
          </div>

          <AddBookDropdown @openForm="handleAddByForm" @addByImport="handleAddByImport" />
        </div>

        <BookFilters :categories="categories" :languages="languages" v-model:searchQuery="searchQuery"
          v-model:selectedCategory="selectedCategory" v-model:selectedStatus="selectedStatus"
          v-model:selectedLanguage="selectedLanguage" @statusChanged="onStatusChange" />
      </div>
    </div>

    <div class="px-6 pb-10">
      <div class="grid grid-cols-1 gap-4">
        <BookCard v-for="book in filteredBooks" :key="book.id" :book="book"
          :openActionMenu="openActionMenu" @viewBook="$emit('viewBook', $event)" @openForm="$emit('openForm', $event)"
          @deleteBookById="$emit('deleteBookById', $event)" @toggleActionMenu="$emit('toggleActionMenu', $event)" />

      </div>

      <EmptyState v-if="filteredBooks.length === 0" @addBook="handleAddByForm" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BookOverviewStats from './BookCollection/BookOverviewStats.vue'
import AddBookDropdown from './BookCollection/AddBookDropdown.vue'
import BookFilters from './BookCollection/BookFilters.vue'
import BookCard from './BookCollection/BookCard.vue'
import EmptyState from './BookCollection/EmptyState.vue'

const props = defineProps({
  books: { type: Array, default: () => [] },
  openActionMenu: [Number, String, null],
  categories: { type: Array, default: () => [] },
  languages: { type: Array, default: () => [] }
})

const emit = defineEmits(['viewBook', 'openForm', 'deleteBookById', 'toggleActionMenu', 'addByImport'])

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('all')
const selectedLanguage = ref('')
const filterType = ref('all')

const onStatusChange = () => {
  filterType.value = selectedStatus.value
}

const getBookStatus = (quantity) => {
  if (quantity >= 10) return 'available'
  if (quantity > 0 && quantity < 10) return 'limited'
  if (quantity === 0) return 'unavailable'
  return 'unknown'
}

const filteredBooks = computed(() => {
  let filtered = props.books

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(book =>
      (book.title?.toLowerCase().includes(q)) ||
      (book.author?.name?.toLowerCase().includes(q)) ||
      (book.isbn?.toLowerCase().includes(q))
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(book => book.category?.name.toLowerCase() === selectedCategory.value)
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter(book => book.language?.name.toLowerCase() === selectedLanguage.value)
  }

  switch (filterType.value) {
    case 'all': break
    case 'new':
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
      break
    case 'available':
      filtered = filtered.filter(book => getBookStatus(book.quantity) === 'available')
      break
    case 'limited':
      filtered = filtered.filter(book => getBookStatus(book.quantity) === 'limited')
      break
  }

  return filtered
})

const totalBooks = computed(() => props.books.length)
const availableBooks = computed(() => props.books.filter(book => book.quantity >= 10).length)

const handleAddByForm = () => {
  emit('openForm')
}

const handleAddByImport = () => {
  emit('addByImport')
}
</script>