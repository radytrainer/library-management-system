import axios from '../axios';

// Fetch all users
export const getAllUsers = () => axios.get('user/users').catch((err) => {
  console.error('getAllUsers error:', {
    status: err.response?.status,
    data: err.response?.data,
    message: err.message,
    config: err.config,
  });
  throw new Error(err.response?.data?.message || 'Failed to fetch users');
});

// Fetch roles
export const getRoles = () => axios.get('user/roles').catch((err) => {
  console.error('getRoles error:', {
    status: err.response?.status,
    data: err.response?.data,
    message: err.message,
  });
  throw new Error(err.response?.data?.message || 'Failed to fetch roles');
});

// Get user by ID
export const getUserById = (id) => axios.get(`/users/${id}`).catch((err) => {
  throw new Error(err.response?.data?.message || `Failed to fetch user with ID ${id}`);
});

// Create user
export const createUser = (data) => axios.post('user/create', data).catch((err) => {
  throw new Error(err.response?.data?.message || 'Failed to create user');
});

// Update user
export const updateUser = (id, data) => axios.put(`/users/${id}`, data).catch((err) => {
  throw new Error(err.response?.data?.message || `Failed to update user with ID ${id}`);
});

// Delete user
export const deleteUser = (id) => axios.delete(`/users/${id}`).catch((err) => {
  throw new Error(err.response?.data?.message || `Failed to delete user with ID ${id}`);
});

// Get profile
export const getProfile = () => axios.get('/profile').catch((err) => {
  throw new Error(err.response?.data?.message || 'Failed to fetch profile');
});

// Delete profile
export const deleteProfile = () => axios.delete('/profile').catch((err) => {
  throw new Error(err.response?.data?.message || 'Failed to delete profile');
});

// Get user barcode image (returns image/png)
export const getUserBarcodeImage = (id) => axios.get(`/users/${id}/barcode`, { responseType: 'blob' }).catch((err) => {
  throw new Error(err.response?.data?.message || `Failed to fetch barcode for user with ID ${id}`);
});