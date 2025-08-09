import api from '@/services/axios'

export const registerUser = async (form) => {
  const formData = new FormData()
  formData.append('username', form.username)
  formData.append('email', form.email)
  formData.append('phone', form.phone)
  formData.append('password', form.password)
  if (form.profile_image) formData.append('profile_image', form.profile_image)

  const response = await api.post('/auth/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data.user
}

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/signin', { email, password })
  return response.data.user
}
export function getProfile() {
  return api.get('/user/profile/me');
}
