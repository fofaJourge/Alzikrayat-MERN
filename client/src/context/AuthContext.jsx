// AuthContext: stores the logged-in user and token in React state (and localStorage)
// so the session survives a page refresh. Components read it through the useAuth() hook.

import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Restore the session from localStorage when the app first loads
  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  )

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch {
      return null
    }
  })

  // POST /api/auth/login, then save the token and the public user profile
  // (the server never sends the password back)
  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    })

    const { token, user } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    setToken(token)
    setUser(user)

    return response.data
  }

  // POST /api/auth/register - the user must log in afterwards
  const register = async (formData) => {
    const response = await api.post('/auth/register', formData)
    return response.data
  }

  // Clear the session from state and localStorage
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook so components can write: const { user, isAuthenticated } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
