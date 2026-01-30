import React, { useState } from 'react'
import { Category } from '../types'
import { puzzleService } from '../services/puzzleService'

const COLORS: Array<'yellow' | 'green' | 'blue' | 'purple'> = ['yellow', 'green', 'blue', 'purple']

export function PuzzleCreator() {
  const [categories, setCategories] = useState<Category[]>(
    COLORS.map((color, index) => ({
      name: '',
      cards: Array(4).fill(null).map(() => ({ name: '', id: '' })),
      color: color,
      difficulty: index + 1,
    }))
  )
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleCategoryNameChange = (categoryIndex: number, name: string) => {
    setCategories((prev) =>
      prev.map((cat, idx) => (idx === categoryIndex ? { ...cat, name } : cat))
    )
  }

  const handleCardChange = (
    categoryIndex: number,
    cardIndex: number,
    field: 'name' | 'id',
    value: string
  ) => {
    setCategories((prev) =>
      prev.map((cat, catIdx) =>
        catIdx === categoryIndex
          ? {
              ...cat,
              cards: cat.cards.map((card, cardIdx) =>
                cardIdx === cardIndex ? { ...card, [field]: value } : card
              ),
            }
          : cat
      )
    )
  }

  const validateForm = (): boolean => {
    for (const category of categories) {
      if (!category.name.trim()) {
        setMessage({ type: 'error', text: 'All categories must have a name' })
        return false
      }
      for (const card of category.cards) {
        if (!card.name.trim()) {
          setMessage({ type: 'error', text: 'All cards must have a name' })
          return false
        }
        if (!card.id.trim()) {
          setMessage({ type: 'error', text: 'All cards must have an ID' })
          return false
        }
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await puzzleService.createPuzzle({
        categories: categories.map((cat) => ({
          ...cat,
          cards: cat.cards.map((card) => ({
            ...card,
            id: card.id || `card-${Math.random()}`,
          })),
        })),
      })

      if (response.success) {
        setMessage({
          type: 'success',
          text: `Puzzle created successfully! ID: ${response.id}`,
        })
        // Reset form
        setCategories(
          COLORS.map((color, index) => ({
            name: '',
            cards: Array(4).fill(null).map(() => ({ name: '', id: '' })),
            color: color,
            difficulty: index + 1,
          }))
        )
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Failed to create puzzle: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-100 border-yellow-300',
    green: 'bg-green-100 border-green-300',
    blue: 'bg-blue-100 border-blue-300',
    purple: 'bg-purple-100 border-purple-300',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Puzzle</h1>
          <p className="text-gray-600 mb-6">
            Create a puzzle by defining 4 categories with 4 cards each
          </p>

          {message && (
            <div
              className={`mb-4 p-4 rounded ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {categories.map((category, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className={`border-2 rounded-lg p-6 ${colorClasses[category.color]}`}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category {categoryIndex + 1} Name
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleCategoryNameChange(categoryIndex, e.target.value)}
                      placeholder={`e.g., Green Creature Cards`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-4">
                    {category.cards.map((card, cardIndex) => (
                      <div key={cardIndex} className="border-t pt-4 first:border-t-0 first:pt-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Card {cardIndex + 1} Name
                            </label>
                            <input
                              type="text"
                              value={card.name}
                              onChange={(e) =>
                                handleCardChange(categoryIndex, cardIndex, 'name', e.target.value)
                              }
                              placeholder="e.g., Lightning Bolt"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              disabled={isLoading}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Card {cardIndex + 1} ID
                            </label>
                            <input
                              type="text"
                              value={card.id}
                              onChange={(e) =>
                                handleCardChange(categoryIndex, cardIndex, 'id', e.target.value)
                              }
                              placeholder="Scryfall ID or UUID"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {isLoading ? 'Creating Puzzle...' : 'Create Puzzle'}
              </button>
              <button
                type="reset"
                disabled={isLoading}
                className="px-6 bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
