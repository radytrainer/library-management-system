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
  const response = await api.post('/auth/signin', { email, password });
  console.log('Full API response:', response);
  console.log('API response data:', response.data);

  const user = response.data.user || response.data.data?.user || response.data;
  const token = response.data.accessToken || response.data.token || response.data.data?.accessToken || response.data.data?.token;

  console.log('Extracted user:', user);
  console.log('Extracted token:', token);

  return { user, token };
};



export function createUser(formData) {
  return api.post('/user/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function getAllUsers() {
  return api.get('/user/users');
}

export function getRoles() {
  return api.get('/user/roles');
}

export function getUserById(id) {
  return api.get(`/user/${id}`);
}

export function updateUser(id, formData) {
  return api.put(`/user/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function deleteUser(id) {
  return api.delete(`/user/${id}`);
}

export function getProfile() {
  return api.get('/user/profile/me');
}


export function getUserBarcodeImage(id) {
  return api.get(`/user/${id}/barcode`, {
    responseType: 'blob'
  });
}