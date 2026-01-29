import React, { useState, useEffect } from 'react'
import { GameBoard } from './GameBoard'
import { GameState, Category } from '../types'
import { SAMPLE_PUZZLE, shuffleArray } from '../utils/gameUtils'

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    categories: SAMPLE_PUZZLE,
    selected: [],
    solved: [],
    mistakes: 0,
    gameOver: false,
    won: false,
    message: ''
  })

  const [words, setWords] = useState<string[]>([])

  // Initialize and shuffle words
  useEffect(() => {
    const allWords = SAMPLE_PUZZLE.flatMap(cat => cat.words)
    setWords(shuffleArray(allWords))
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

  const handleWordClick = (word: string) => {
    if (gameState.gameOver || gameState.solved.some(catName =>
      SAMPLE_PUZZLE.find(cat => cat.name === catName)?.words.includes(word)
    )) {
      return
    }

    setGameState(prev => ({
      ...prev,
      selected: prev.selected.includes(word)
        ? prev.selected.filter(w => w !== word)
        : [...prev.selected, word]
    }))
  }

  const handleShuffle = () => {
    setWords(shuffleArray(words))
  }

  const handleDeselect = () => {
    setGameState(prev => ({ ...prev, selected: [] }))
  }

  const handleSolve = () => {
    if (gameState.selected.length !== 4 || gameState.gameOver) return

    const selectedSet = new Set(gameState.selected.map(w => w.toLowerCase()))
    let foundCategory: Category | null = null

    for (const category of gameState.categories) {
      const categorySet = new Set(category.words.map(w => w.toLowerCase()))
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

        const categorySet = new Set(category.words.map(w => w.toLowerCase()))
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <GameBoard
        gameState={gameState}
        words={words.filter(w => !gameState.solved.some(catName =>
          SAMPLE_PUZZLE.find(cat => cat.name === catName)?.words.includes(w)
        ))}
        onWordClick={handleWordClick}
        onSolve={handleSolve}
        onShuffle={handleShuffle}
        onDeselect={handleDeselect}
      />
    </div>
  )
}
