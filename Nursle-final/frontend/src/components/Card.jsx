import React from 'react'

export default function Card({ title, children, className = "", headerActions = null }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          {headerActions}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}