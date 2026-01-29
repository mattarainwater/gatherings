import React, { useState } from 'react'
import { WordButton } from './WordButton'
import { CardPreview } from './CardPreview'
import { Card, Category, GameState } from '../types'
import { getColorClass } from '../utils/gameUtils'

interface GameBoardProps {
  gameState: GameState
  cards: Card[]
  onWordClick: (card: Card) => void
  onSolve: () => void
  onShuffle: () => void
  onDeselect: () => void
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  cards,
  onWordClick,
  onSolve,
  onShuffle,
  onDeselect
}) => {
  // Get solved categories in the order they were solved
  const solvedCategories = gameState.solved
    .map(solvedName => gameState.categories.find(cat => cat.name === solvedName))
    .filter((cat): cat is Category => cat !== undefined)

  const [hoveredCard, setHoveredCard] = useState<Card | undefined>(undefined)

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:flex-1">
          <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Title and Mistakes */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gatherings</h1>
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
      {solvedCategories && solvedCategories.length > 0 && (
        <div className="mb-6 space-y-2">
          {solvedCategories.map(cat => (
            <div
              key={cat.name}
              className={`${getColorClass(cat.color)} text-black p-3 rounded font-bold text-center`}
            >
              <div>{cat.name}</div>
              <div className="text-xs opacity-75">{cat.cards.map(c => c.name).join(' | ')}</div>
            </div>
          ))}
        </div>
      )}

      {/* Words Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map(card => {
          const category = gameState.categories.find(cat =>
            cat.cards.map(c => c.id).includes(card.id)
          )
          
          const isSelected = gameState.selected.map(c => c.id).includes(card.id)
          const isSolved = gameState.solved.includes(category?.name || '')

          return (
            <WordButton
              key={card.id}
              card={card}
              selected={isSelected}
              solved={isSolved}
              color={isSolved ? getColorClass(category?.color!) : undefined}
              onClick={() => onWordClick(card)}
              onHover={setHoveredCard}
              onLeave={() => setHoveredCard(undefined)}
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
          <CardPreview card={hoveredCard} />
        </div>
      </div>
    </div>
  )
}
