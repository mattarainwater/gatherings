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
    <div className="sm:max-w-6xl sm:mx-auto mx-0 px-0 sm:px-4" onMouseMove={handleMouseMove}>
      <div className="flex flex-col lg:flex-row gap-6 items-start h-full w-full">
        <div className="w-full lg:flex-1">
          <div className="px-0 sm:px-4 py-3 sm:py-4 bg-white dark:bg-gray-900 sm:rounded-lg sm:shadow-lg h-full flex flex-col transition-colors">
      {/* Title and Mistakes */}
      <div className="mb-3 w-full md:w-[33vw] mx-auto">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={onPreviousDay}
            disabled={!canNavigatePrevious || isTransitioning}
            className={`p-1 ${
              canNavigatePrevious && !isTransitioning
                ? 'text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer'
                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
            }`}
            aria-label="Previous Day"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h1>
          </div>
          <button
            onClick={onNextDay}
            disabled={!canNavigateNext || isTransitioning}
            className={`p-1 ${
              canNavigateNext && !isTransitioning
                ? 'text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer'
                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
            }`}
            aria-label="Next Day"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="text-base font-semibold text-gray-600 dark:text-gray-300 text-center">
          Mistakes: {gameState.mistakes}/4
        </div>
      </div>

      {/* Board Content Container */}
      <div className="relative flex-1">
        {/* Solved Categories */}
      {solvedCategories && solvedCategories.length > 0 && (
        <div className="mb-3 space-y-1 w-full md:w-[33vw] mx-auto">
          {solvedCategories.map(cat => (
            <div
              key={cat.name}
              className={`${getColorClass(cat.color)} text-black p-3 rounded font-bold text-center uppercase text-lg w-full`}
            >
              <div className="break-words">{cat.name}</div>
              <div className="text-sm opacity-75 break-words">{cat.cards.map(c => c.name).join(' | ')}</div>
            </div>
          ))}
        </div>
      )}

      {/* Words Grid */}
      {!gameState.gameOver || gameState.won ? (
        <div className="grid grid-cols-4 gap-2 mb-3 w-full md:w-[33vw] mx-auto">
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
          <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded text-center font-semibold mb-4">
            Game Over! You made too many mistakes.
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 text-center">Solution:</h2>
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
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded text-center font-semibold">
          You won! All categories found! 🎉
        </div>
      )}

      {/* Controls */}
      <div className="mt-auto pt-4 flex gap-3 justify-center sticky bottom-0 bg-white dark:bg-gray-900 pb-2">
        {gameState.message ? (
          <div className={`px-4 py-2 text-lg font-bold ${
            gameState.message.includes('Correct') ? 'text-green-600' : 'text-red-600'
          }`}>
            {gameState.message}
          </div>
        ) : gameState.gameOver ? (
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
      {/* Loading Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Loading puzzle...</span>
          </div>
        </div>
      )}
      </div>
          </div>
        </div>
        <CardPreview card={hoveredCard} mouseX={mousePos.x} mouseY={mousePos.y} />
      </div>
    </div>
  )
}
