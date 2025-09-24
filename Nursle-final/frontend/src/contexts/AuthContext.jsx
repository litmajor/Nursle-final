import React, { createContext, useContext, useEffect, useState } from 'react'

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
    // Check for existing authentication
    const authStatus = localStorage.getItem('isAuthenticated')
    const user = localStorage.getItem('currentUser')
    
    if (authStatus === 'true' && user) {
      setIsAuthenticated(true)
      setCurrentUser(user)
    }
    
    setLoading(false)
  }, [])

  const login = (username) => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('currentUser', username)
    setIsAuthenticated(true)
    setCurrentUser(username)
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  const register = (name) => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('currentUser', name)
    setIsAuthenticated(true)
    setCurrentUser(name)
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