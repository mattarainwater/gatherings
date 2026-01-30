import React, { useState, useEffect } from 'react'
import { GameBoard } from './GameBoard'
import { GameState, Category, Card } from '../types'
import { shuffleArray } from '../utils/gameUtils'
import { puzzleService } from '../services/puzzleService'

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    categories: [],
    selected: [],
    solved: [],
    mistakes: 0,
    gameOver: false,
    won: false,
    message: ''
  })

  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch puzzle from API and initialize
  useEffect(() => {
    const initializePuzzle = async () => {
      try {
        const categories = await puzzleService.getPuzzle()
        setGameState(prev => ({
          ...prev,
          categories
        }))
        const allWords = categories.flatMap(cat => cat.cards.map(card => card))
        setCards(shuffleArray(allWords))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load puzzle')
      } finally {
        setLoading(false)
      }
    }
    initializePuzzle()
  }, [])

  // Clear message after delay
  useEffect(() => {
    if (gameState.message) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, message: '' }))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [gameState.message])

  const handleWordClick = (card: Card) => {
    if (gameState.gameOver || gameState.solved.some(catName =>
      gameState.categories.find(cat => cat.name === catName)?.cards.map(card => card.id).includes(card.id)
    )) {
      return
    }

    setGameState(prev => ({
      ...prev,
      selected: prev.selected.includes(card)
        ? prev.selected.filter(w => w.id !== card.id)
        : [...prev.selected, card]
    }))
  }

  const handleShuffle = () => {
    setCards(shuffleArray(cards))
  }

  const handleDeselect = () => {
    setGameState(prev => ({ ...prev, selected: [] }))
  }

  const handleSolve = () => {
    if (gameState.selected.length !== 4 || gameState.gameOver) return

    const selectedSet = new Set(gameState.selected)
    let foundCategory: Category | null = null

    for (const category of gameState.categories) {
      const categorySet = new Set(category.cards)
      if (
        categorySet.size === selectedSet.size &&
        [...categorySet].every(w => selectedSet.has(w))
      ) {
        foundCategory = category
        break
      }
    }

    if (foundCategory) {
      const newSolved = [...gameState.solved, foundCategory.name]
      const isGameWon = newSolved.length === 4

      setGameState(prev => ({
        ...prev,
        selected: [],
        solved: newSolved,
        message: 'Correct! 🎉',
        won: isGameWon,
        gameOver: isGameWon
      }))
    } else {
      // Check for one away
      let oneAway = false
      for (const category of gameState.categories) {
        if (gameState.solved.includes(category.name)) continue

        const categorySet = new Set(category.cards)
        const matchCount = [...selectedSet].filter(w => categorySet.has(w)).length
        if (matchCount === 3) {
          oneAway = true
          break
        }
      }

      const newMistakes = gameState.mistakes + 1
      const gameOver = newMistakes >= 4

      setGameState(prev => ({
        ...prev,
        selected: [],
        mistakes: newMistakes,
        message: oneAway ? 'One away...' : 'Not quite',
        gameOver,
        won: false
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-700">Loading puzzle...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <GameBoard
        gameState={gameState}
        cards={cards.filter(card => !gameState.solved.some(catName =>
          gameState.categories.find(cat => cat.name === catName)?.cards.map(c => c.id).includes(card.id)
        ))}
        onWordClick={handleWordClick}
        onSolve={handleSolve}
        onShuffle={handleShuffle}
        onDeselect={handleDeselect}
      />
    </div>
  )
}
