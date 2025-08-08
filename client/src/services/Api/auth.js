// /services/authService.js
import api from '@/services/axios'

export const registerUser = async (form) => {
  const formData = new FormData()
  formData.append('username', form.username)
  formData.append('email', form.email)
  formData.append('phone', form.phone)
  formData.append('password', form.password)

  const response = await api.post('/auth/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return response.data.user
}

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/signin', { email, password })
  return response.data.user
}

export function getUserById(id) {
  return api.get(`/user/${id}`);
}
export function getAllUsers() {
  return api.get('/user/users');
}
export function getProfile() {
  return api.get('/user/profile/me');
}
