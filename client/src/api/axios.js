// Shared Axios instance used by every React component.
// baseURL "/api" is forwarded to the Express server by the Vite proxy (see vite.config.js).

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Request interceptor: attach the saved JWT to every request so the
// server knows which user is calling protected endpoints (upload, delete, comment).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Response interceptor: if a saved token is rejected (401, e.g. it expired),
// clear the session so the navbar stops showing "Hi <name>" for a logged-out user.
// Login/register requests are ignored because a 401 there just means wrong credentials.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isAuthRequest = url.startsWith('/auth/')

    if (status === 401 && !isAuthRequest && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
