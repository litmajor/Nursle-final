
import React from 'react'

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props 
}) {
  const baseClasses = "font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  
  const variants = {
    primary: "bg-slate-700 hover:bg-slate-800 text-white focus:ring-slate-500 dark:bg-slate-600 dark:hover:bg-slate-700 disabled:hover:bg-slate-700 dark:disabled:hover:bg-slate-600",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white disabled:hover:bg-gray-200 dark:disabled:hover:bg-gray-700",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:hover:bg-green-600",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:hover:bg-red-600",
    outline: "border-2 border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white focus:ring-slate-500 dark:border-slate-400 dark:text-slate-400 dark:hover:bg-slate-400 dark:hover:text-gray-900"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }
  
  const isDisabled = disabled || loading
  
  return (
    <button 
      type={type}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  )
}
