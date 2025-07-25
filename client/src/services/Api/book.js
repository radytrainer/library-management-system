import ApiService from '../axios';

export const getBooks = () => ApiService.get('/books');
export const getBookById = (id) => ApiService.get(`/books/${id}`);
export const createBook = (bookData) => ApiService.post('/books', bookData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateBook = (id, bookData) => ApiService.put(`/books/${id}`, bookData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteBook = (id) => ApiService.delete(`/books/${id}`);
export const getAuthors = () => ApiService.get('/authors');
export const getCategories = () => ApiService.get('/categories');
export const getLanguages = () => ApiService.get('/language');
