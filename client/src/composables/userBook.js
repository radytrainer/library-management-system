import { ref, onMounted } from 'vue'
import api from '@/services/api'

export function useBook() {
  const books = ref([])

  const loadBooks = async () => {
    const res = await api.get('/books')
    books.value = res.data
  }

  onMounted(loadBooks)

  return { books, loadBooks }
}
