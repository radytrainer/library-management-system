import ApiService from '../axios';


export const getAuthors = () => ApiService.get('/authors');

export const getAuthorById = (id) => ApiService.get(`/authors/${id}`);

export const createAuthor = (authorData) => 
  ApiService.post('/authors', authorData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateAuthor = (id, authorData) =>
  ApiService.put(`/authors/${id}`, authorData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteAuthor = (id) => ApiService.delete(`/authors/${id}`);
