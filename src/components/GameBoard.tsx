import React, { useState } from 'react'
import { WordButton } from './WordButton'
import { CardPreview } from './CardPreview'
import { ResultsPopup } from './ResultsPopup'
import { Card, Category, GameState } from '../types'
import { getColorClass } from '../utils/gameUtils'

interface GameBoardProps {
  gameState: GameState
  cards: Card[]
  onWordClick: (card: Card) => void
  onSolve: () => void
  onShuffle: () => void
  onDeselect: () => void
  selectedDate: Date
  canNavigatePrevious: boolean
  canNavigateNext: boolean
  onPreviousDay: () => void
  onNextDay: () => void
  isTransitioning: boolean
  onShowResults: () => void
  onRestart: () => void
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  cards,
  onWordClick,
  onSolve,
  onShuffle,
  onDeselect,
  selectedDate,
  canNavigatePrevious,
  canNavigateNext,
  onPreviousDay,
  onNextDay,
  isTransitioning,
  onShowResults,
  onRestart
}) => {
  // Get solved categories in the order they were solved
  const solvedCategories = gameState.solved
    .map(solvedName => gameState.categories.find(cat => cat.name === solvedName))
    .filter((cat): cat is Category => cat !== undefined)

  const [hoveredCard, setHoveredCard] = useState<Card | undefined>(undefined)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4" onMouseMove={handleMouseMove}>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:flex-1 min-w-[800px]">
          <div className="p-4 bg-white rounded-lg shadow-lg min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Title and Mistakes */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={onPreviousDay}
            disabled={!canNavigatePrevious || isTransitioning}
            className={`p-1 ${
              canNavigatePrevious && !isTransitioning
                ? 'text-blue-500 hover:text-blue-600 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Previous Day"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-800">Gatherings</h1>
            <span className="text-sm text-gray-500">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <button
            onClick={onNextDay}
            disabled={!canNavigateNext || isTransitioning}
            className={`p-1 ${
              canNavigateNext && !isTransitioning
                ? 'text-blue-500 hover:text-blue-600 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Next Day"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="text-base font-semibold text-gray-600 text-center">
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
        <div className="mb-3 space-y-1">
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
      {!gameState.gameOver || gameState.won ? (
        <div className="grid grid-cols-4 gap-y-0 gap-x-0 mb-3 w-max mx-auto">
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
      ) : null}

      {/* Game Over Message */}
      {gameState.gameOver && !gameState.won && (
        <div className="mb-6">
          <div className="p-4 bg-red-100 text-red-800 rounded text-center font-semibold mb-4">
            Game Over! You made too many mistakes.
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">Solution:</h2>
            {gameState.categories
              .filter(cat => !gameState.solved.includes(cat.name))
              .map(cat => (
                <div
                  key={cat.name}
                  className={`${getColorClass(cat.color)} text-black p-3 rounded font-bold text-center`}
                >
                  <div>{cat.name}</div>
                  <div className="text-xs opacity-75">{cat.cards.map(c => c.name).join(' | ')}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {gameState.won && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded text-center font-semibold">
          You won! All categories found! 🎉
        </div>
      )}

      {/* Controls */}
      <div className="mt-auto pt-4 flex gap-3 justify-center sticky bottom-0 bg-white pb-2">
        {gameState.gameOver ? (
          <>
            <button
              onClick={onShowResults}
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
            >
              View Results
            </button>
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
            >
              Restart Puzzle
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
          </div>
        </div>
        <CardPreview card={hoveredCard} mouseX={mousePos.x} mouseY={mousePos.y} />
      </div>
    </div>
  )
}
