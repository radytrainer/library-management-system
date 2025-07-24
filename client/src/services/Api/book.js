import axios from '../axios'

export const getBookById = (id) => axios.get(`/book/${id}`)

