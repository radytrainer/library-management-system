import axios from './axios';

export const getBorrows = () => axios.get('/borrows');

export const getBorrowById = (id) => axios.get(`/borrows/${id}`);

export const createBorrow = (borrowData) => axios.post('/borrows', borrowData);

export const updateBorrow = (id, borrowData) =>
  api.put(`/borrows/${id}`, borrowData);

export const deleteBorrow = (id) => api.delete(`/borrows/${id}`);
