import axios from '../axios'

// Fetch all users
export const getAllUsers = () => axios.get('/users/users')

// Fetch roles
export const getRoles = () => axios.get('/users/roles')

// Get user by ID
export const getUserById = (id) => axios.get(`/users/${id}`)

// Create user
export const createUser = (data) => axios.post('/users', data)

// Update user
export const updateUser = (id, data) => axios.put(`/users/users/${id}`, data)

// Delete user
export const deleteUser = (id) => axios.delete(`/users/${id}`)

// Get profile
export const getProfile = () => axios.get('/users/profile')

// Delete profile
export const deleteProfile = () => axios.delete('/users/profile')

// Get user barcode image (returns image/png)
export const getUserBarcodeImage = (id) => axios.get(`/users/${id}/barcode`, { responseType: 'blob' })
