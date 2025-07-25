import axios from '../axios'

export const getUserById = (id) => axios.get(`/user/${id}`)
