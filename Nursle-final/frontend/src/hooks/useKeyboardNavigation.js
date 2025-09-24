
import { useEffect } from 'react'

export const useKeyboardNavigation = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return
    
    const handleKeyDown = (event) => {
      // Escape key to close modals/dropdowns
      if (event.key === 'Escape') {
        const activeElement = document.activeElement
        if (activeElement && activeElement.blur) {
          activeElement.blur()
        }
      }
      
      // Tab navigation enhancement
      if (event.key === 'Tab') {
        // Add visual indicator for keyboard navigation
        document.body.classList.add('keyboard-navigation')
      }
      
      // Enter key to submit forms
      if (event.key === 'Enter' && event.ctrlKey) {
        const form = event.target.closest('form')
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]')
          if (submitButton && !submitButton.disabled) {
            submitButton.click()
          }
        }
      }
    }
    
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation')
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [enabled])
}

// Add CSS for keyboard navigation
export const keyboardNavigationStyles = `
  .keyboard-navigation *:focus {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 2px !important;
  }
`
