import React, { useState, useEffect } from 'react'
import { GameBoard } from './GameBoard'
import { GameState, Category, Card } from '../types'
import { shuffleArray } from '../utils/gameUtils'
import { puzzleService } from '../services/puzzleService'
import { ResultsPopup } from './ResultsPopup'

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    categories: [],
    selected: [],
    solved: [],
    mistakes: 0,
    gameOver: false,
    won: false,
    message: '',
    guesses: []
  })

  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [puzzleId, setPuzzleId] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Fetch puzzle from API and initialize
  useEffect(() => {
    const initializePuzzle = async () => {
      try {
        const categories = await puzzleService.getPuzzle()
        
        // Generate a unique ID for this puzzle based on category names
        const currentPuzzleId = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        setPuzzleId(currentPuzzleId)
        
        // Try to load saved state from localStorage
        const savedStateStr = localStorage.getItem('gameState')
        const savedCardsStr = localStorage.getItem('shuffledCards')
        const savedPuzzleId = localStorage.getItem('puzzleId')
        
        let initialGameState = {
          categories,
          selected: [],
          solved: [],
          mistakes: 0,
          gameOver: false,
          won: false,
          message: '',
          guesses: []
        }
        
        let initialCards = categories.flatMap(cat => cat.cards.map(card => card))
        
        // If saved state exists and it's for the same puzzle, restore it
        if (savedStateStr && savedCardsStr && savedPuzzleId === currentPuzzleId) {
          try {
            const savedState = JSON.parse(savedStateStr)
            const savedCards = JSON.parse(savedCardsStr)
            
            initialGameState = {
              ...initialGameState,
              selected: savedState.selected || [],
              solved: savedState.solved || [],
              mistakes: savedState.mistakes || 0,
              gameOver: savedState.gameOver || false,
              guesses: savedState.guesses || [],
              won: savedState.won || false,
              message: ''
            }
            
            initialCards = savedCards
          } catch (e) {
            console.error('Failed to parse saved state:', e)
            // If parsing fails, use default initialization
          }
        } else {
          // New puzzle or no saved state, shuffle cards
          initialCards = shuffleArray(initialCards)
          // Clear old saved state
          localStorage.removeItem('gameState')
          localStorage.removeItem('shuffledCards')
          localStorage.setItem('puzzleId', currentPuzzleId)
        }
        
        setShowResults(initialGameState.won)
        setGameState(initialGameState)
        setCards(initialCards)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load puzzle')
      } finally {
        setLoading(false)
      }
    }
    initializePuzzle()
  }, [])

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (puzzleId && gameState.categories.length > 0) {
      const stateToSave = {
        selected: gameState.selected,
        solved: gameState.solved,
        mistakes: gameState.mistakes,
        gameOver: gameState.gameOver,
        guesses: gameState.guesses,
        won: gameState.won,
      }
      localStorage.setItem('gameState', JSON.stringify(stateToSave))
    }
  }, [gameState.selected, gameState.solved, gameState.mistakes, gameState.gameOver, gameState.won, gameState.guesses, puzzleId])

  // Save shuffled cards to localStorage whenever they change
  useEffect(() => {
    if (puzzleId && cards.length > 0) {
      localStorage.setItem('shuffledCards', JSON.stringify(cards))
    }
  }, [cards, puzzleId])

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

    const selectedIds = new Set(gameState.selected.map(card => card.id))
    let foundCategory: Category | null = null

    for (const category of gameState.categories) {
      const categoryIds = new Set(category.cards.map(card => card.id))
      if (
        categoryIds.size === selectedIds.size &&
        [...categoryIds].every(id => selectedIds.has(id))
      ) {
        foundCategory = category
        break
      }
    }

    if (foundCategory) {
      const newSolved = [...gameState.solved, foundCategory.name]
      const isGameWon = newSolved.length === 4
      setShowResults(isGameWon)
      setGameState(prev => ({
        ...prev,
        selected: [],
        solved: newSolved,
        message: 'Correct! 🎉',
        won: isGameWon,
        gameOver: isGameWon,
        guesses: [...prev.guesses, { cards: gameState.selected, correct: true, oneAway: false }]
      }))
    } else {
      // Check for one away
      let oneAway = false
      for (const category of gameState.categories) {
        if (gameState.solved.includes(category.name)) continue

        const categoryIds = new Set(category.cards.map(card => card.id))
        const matchCount = [...selectedIds].filter(id => categoryIds.has(id)).length
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
        won: false,
        guesses: [...prev.guesses, { cards: gameState.selected, correct: false, oneAway }]
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
      {(showResults) && (
        <ResultsPopup
          gameState={gameState}
          puzzleDate={puzzleId || ''}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
