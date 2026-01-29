import React, { useState } from 'react'
import { WordButton } from './WordButton'
import { CardPreview } from './CardPreview'
import { Category, GameState } from '../types'
import { getColorClass } from '../utils/gameUtils'

interface GameBoardProps {
  gameState: GameState
  words: string[]
  onWordClick: (word: string) => void
  onSolve: () => void
  onShuffle: () => void
  onDeselect: () => void
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  words,
  onWordClick,
  onSolve,
  onShuffle,
  onDeselect
}) => {
  const solvedCategories = gameState.categories.filter(cat =>
    gameState.solved.includes(cat.name)
  )

  const [hoveredWord, setHoveredWord] = useState<string | undefined>(undefined)

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:flex-1">
          <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Title and Mistakes */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Connections</h1>
        <div className="text-lg font-semibold text-gray-600">
          Mistakes: {gameState.mistakes}/4
        </div>
        {gameState.message && (
          <div className={`mt-2 text-sm font-semibold ${
            gameState.message.includes('Correct') ? 'text-green-600' : 'text-red-600'
          }`}>
            {gameState.message}
          </div>
        )}
      </div>

      {/* Solved Categories */}
      {solvedCategories.length > 0 && (
        <div className="mb-6 space-y-2">
          {solvedCategories.map(cat => (
            <div
              key={cat.name}
              className={`${getColorClass(cat.color)} text-white p-3 rounded font-semibold text-center`}
            >
              <div className="text-xs opacity-75">{cat.color.toUpperCase()}</div>
              <div>{cat.name}</div>
              <div className="text-xs opacity-75">{cat.words.join(', ')}</div>
            </div>
          ))}
        </div>
      )}

      {/* Words Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {words.map(word => {
          const category = gameState.categories.find(cat =>
            cat.words.map(w => w.toLowerCase()).includes(word.toLowerCase())
          )
          
          const isSelected = gameState.selected.includes(word)
          const isSolved = gameState.solved.includes(category?.name || '')

          return (
            <WordButton
              key={word}
              word={word}
              selected={isSelected}
              solved={isSolved}
              color={isSolved ? getColorClass(category?.color!) : undefined}
              onClick={() => onWordClick(word)}
              onHover={setHoveredWord}
              onLeave={() => setHoveredWord(undefined)}
            />
          )
        })}
      </div>

      {/* Game Over Message */}
      {gameState.gameOver && !gameState.won && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded text-center font-semibold">
          Game Over! You made too many mistakes.
        </div>
      )}

      {gameState.won && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded text-center font-semibold">
          You won! All categories found! 🎉
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onShuffle}
          disabled={gameState.gameOver}
          className="px-4 py-2 bg-gray-400 text-white rounded font-semibold hover:bg-gray-500 disabled:opacity-50"
        >
          Shuffle
        </button>
        <button
          onClick={onDeselect}
          disabled={gameState.selected.length === 0 || gameState.gameOver}
          className="px-4 py-2 bg-gray-400 text-white rounded font-semibold hover:bg-gray-500 disabled:opacity-50"
        >
          Deselect All
        </button>
        <button
          onClick={onSolve}
          disabled={gameState.selected.length !== 4 || gameState.gameOver}
          className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          Submit
        </button>
      </div>
          </div>
        </div>
        <div className="w-full lg:w-80">
          <CardPreview word={hoveredWord} />
        </div>
      </div>
    </div>
  )
}
