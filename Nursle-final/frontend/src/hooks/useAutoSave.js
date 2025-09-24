
import { useEffect, useRef } from 'react'

export const useAutoSave = (data, onSave, delay = 2000) => {
  const timeoutRef = useRef(null)
  const previousDataRef = useRef(data)
  
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Check if data has actually changed
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current)
    
    if (hasChanged && Object.keys(data).some(key => data[key])) {
      timeoutRef.current = setTimeout(() => {
        onSave(data)
        previousDataRef.current = data
      }, delay)
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, onSave, delay])
  
  const saveNow = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    onSave(data)
    previousDataRef.current = data
  }
  
  return { saveNow }
}
