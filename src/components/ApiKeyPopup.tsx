import React, { useState } from 'react'

interface ApiKeyPopupProps {
  onSubmit: (apiKey: string) => void
}

const API_KEY_STORAGE_KEY = 'magic-connections-api-key'

export function ApiKeyPopup({ onSubmit }: ApiKeyPopupProps) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedKey = apiKey.trim()
    
    if (!trimmedKey) {
      setError('API key is required')
      return
    }
    
    // Save to local storage
    localStorage.setItem(API_KEY_STORAGE_KEY, trimmedKey)
    onSubmit(trimmedKey)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => {}}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter API Key</h2>
        <p className="text-gray-600 mb-6">
          Please enter your API key to create puzzles.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setError('')
              }}
              placeholder="Enter your API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
