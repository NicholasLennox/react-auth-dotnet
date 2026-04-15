import { createContext, useContext, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const register = async (formData) => {
    const data = await authService.register(formData)
    setToken(data.token)
    localStorage.setItem('token', data.token)
  }

  const login = async (formData) => {
    const data = await authService.login(formData)
    setToken(data.token)
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}