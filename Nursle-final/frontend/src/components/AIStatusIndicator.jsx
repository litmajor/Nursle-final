
import React, { useState, useEffect } from 'react'

export default function AIStatusIndicator({ showDetails = false }) {
  const [aiStatus, setAiStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchAIStatus()
    // Set up periodic status checks
    const interval = setInterval(fetchAIStatus, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const fetchAIStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ai/health', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiStatus(data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch AI status:', error)
      setAiStatus({ success: false, status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 dark:text-green-400'
      case 'degraded': return 'text-yellow-600 dark:text-yellow-400'
      case 'error': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'degraded':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        <span className="text-sm">Checking AI status...</span>
      </div>
    )
  }

  const status = aiStatus?.status || 'error'
  const isHealthy = aiStatus?.success && status === 'healthy'

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1 ${getStatusColor(status)}`}>
        {getStatusIcon(status)}
        <span className="text-sm font-medium">
          AI {isHealthy ? 'Online' : status === 'degraded' ? 'Degraded' : 'Offline'}
        </span>
      </div>
      
      {showDetails && aiStatus?.success && (
        <div className="ml-4 text-xs text-gray-500 dark:text-gray-400">
          <div>Diagnostic: {aiStatus.services?.diagnostic ? 'Active' : 'Inactive'}</div>
          <div>Predictive: {aiStatus.services?.predictive ? 'Active' : 'Inactive'}</div>
          {lastUpdated && (
            <div>Updated: {lastUpdated.toLocaleTimeString()}</div>
          )}
        </div>
      )}
    </div>
  )
}
