import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (Array.isArray(error.response?.data?.message)
        ? error.response.data.message[0]
        : null) ||
      error.message ||
      'Erro desconhecido'
    return Promise.reject(new Error(Array.isArray(message) ? message[0] : message))
  },
)
