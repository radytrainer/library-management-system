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




// ✅ Create User (multipart form)
export function createUser(formData) {
  return api.post('/user/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// ✅ Get All Users
export function getAllUsers() {
  return api.get('/user/users');
}

// ✅ Get Roles
export function getRoles() {
  return api.get('/user/roles');
}

// ✅ Get User by ID
export function getUserById(id) {
  return api.get(`/user/${id}`);
}

// ✅ Update User (multipart form)
export function updateUser(id, formData) {
  return api.put(`/user/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// ✅ Delete User
export function deleteUser(id) {
  return api.delete(`/user/${id}`);
}

// ✅ Get Logged-in Profile
export function getProfile() {
  return api.get('/user/profile/me');
}

// ✅ Get User Barcode Image
export function getUserBarcodeImage(id) {
  return api.get(`/user/${id}/barcode`, {
    responseType: 'blob'
  });
}
