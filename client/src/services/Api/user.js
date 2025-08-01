// src/services/Api/user.js
import api from '@/services/axios'

// ✅ Create User (multipart form)
export function createUser(formData) {
  return api.post('user/create', formData);
}

// ✅ Get All Users
export const getAllUsers = () => api.get('user/users')

// ✅ Get Roles
export const getRoles = () => api.get('user/roles')

// ✅ Get User by ID
export const getUserById = (id) => api.get(`/users/${id}`)

// ✅ Update User
export const updateUser = (id, formData) => axios.put(`${API_URL}/users/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// ✅ Delete User
export const deleteUser = (id) => api.delete(`/user/${id}`)

// ✅ Get Profile
export const getProfile = () => api.get('/users/profile')

// ✅ Get User Barcode Image
export const getUserBarcodeImage = (id) => api.get(`/users/${id}/barcode`, {
  responseType: 'blob'
})
