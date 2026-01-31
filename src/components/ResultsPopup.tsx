import React, { useState } from 'react'
import { GameState } from '../types'

interface ResultsPopupProps {
  gameState: GameState
  puzzleDate: string
  onClose: () => void
}

export const ResultsPopup: React.FC<ResultsPopupProps> = ({
  gameState,
  puzzleDate,
  onClose
}) => {
  const [copied, setCopied] = useState(false)

  const generateResultsText = () => {
    const status = gameState.won ? '🎉 Won!' : '❌ Lost'

    // Create the unresolved categories display
    const unresolved = gameState.categories
      .filter(cat => !gameState.solved.includes(cat.name))
      .map(cat => {
        const emoji = (() => {
          switch (cat.color) {
            case 'yellow':
              return '🟨'
            case 'green':
              return '🟩'
            case 'blue':
              return '🟦'
            case 'purple':
              return '🟪'
            default:
              return '⬜'
          }
        })()
        return `${emoji} ${cat.name}`
      })
      .join('\n')

    // Build guesses display
    const guessesText = gameState.guesses
      .map((guess) => {
        // Get color emoji for each card based on its category
        const cardEmojis = guess.cards
          .map(card => {
            const category = gameState.categories.find(cat =>
              cat.cards.map(c => c.id).includes(card.id)
            )
            if (!category) return '⬜'
            switch (category.color) {
              case 'yellow':
                return '🟨'
              case 'green':
                return '🟩'
              case 'blue':
                return '🟦'
              case 'purple':
                return '🟪'
              default:
                return '⬜'
            }
          })
          .join('')
      
        
        return `${cardEmojis}`
      })
      .join('\n')

    let text = `Gatherings - ${puzzleDate}
${status}

${guessesText}`

    if (unresolved) {
      text += `\n\nMissed:\n${unresolved}`
    }

    return text
  }

  const resultsText = generateResultsText()

  const handleCopy = () => {
    navigator.clipboard.writeText(resultsText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {gameState.won ? '🎉 You Won!' : '❌ Game Over'}
        </h2>

        <div className="mb-6 p-4 bg-gray-100 rounded text-center font-mono text-sm whitespace-pre-line break-words">
          {resultsText}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 px-4 py-2 rounded font-semibold transition-colors ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy Results'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-400 text-white rounded font-semibold hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
