import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../api/config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication by calling dashboard endpoint
    const checkAuth = async () => {
      try {
        const response = await apiRequest('/api/dashboard')
        setIsAuthenticated(true)
        setCurrentUser(response.first_name)
      } catch (error) {
        setIsAuthenticated(false)
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiRequest('/api/login', {
        method: 'POST',
        body: { email, password }
      })
      setIsAuthenticated(true)
      setCurrentUser(response.first_name)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    // Note: Session will be cleared by server when browser session ends
  }

  const register = async (userData) => {
    try {
      await apiRequest('/api/signup', {
        method: 'POST',
        body: userData
      })
      // After successful registration, automatically log in
      return await login(userData.email, userData.password)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      login,
      logout,
      register,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}