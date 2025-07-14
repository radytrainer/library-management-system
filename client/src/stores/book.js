import { defineStore } from 'pinia'
import axios from '@/services/api'

export const useBookStore = defineStore('book', {
  state: () => ({
    books: [],
  }),
  actions: {
    async fetchBooks() {
      const res = await axios.get('/books')
      this.books = res.data
    }
  }
})
