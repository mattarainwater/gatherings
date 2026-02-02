import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { GameBoard } from './GameBoard'
import { GameState, Category, Card } from '../types'
import { shuffleArray } from '../utils/gameUtils'
import { puzzleService } from '../services/puzzleService'
import { ResultsPopup } from './ResultsPopup'
import { Footer } from './Footer'
import { Header } from './Header'

export const Game: React.FC = () => {
  const location = useLocation()
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
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const params = new URLSearchParams(window.location.search)
    const dateParam = params.get('date')
    if (dateParam) {
      try {
        return parseAPIDate(dateParam)
      } catch {
        return new Date()
      }
    }
    return new Date()
  })
  const [useDefaultPuzzle, setUseDefaultPuzzle] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return !params.get('date')
  })
  const [nextPuzzleDate, setNextPuzzleDate] = useState<string | null>(null)
  const [prevPuzzleDate, setPrevPuzzleDate] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const formatDateForAPI = (date: Date) => {
    const formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    return formattedDate;
  }

  const canNavigatePrevious = prevPuzzleDate !== null
  const canNavigateNext = nextPuzzleDate !== null

  const formatDateForURL = (dateStr: string) => {
    // Convert API date format to YYYY-MM-DD for URL
    const date = parseAPIDate(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const updateDateQueryParam = (dateStr: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('date', formatDateForURL(dateStr))
    window.history.replaceState({}, '', url.toString())
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const dateParam = params.get('date')
    const shouldUseDefault = !dateParam
    
    setUseDefaultPuzzle(shouldUseDefault)

    if (shouldUseDefault) {
      // When navigating to root without date param, force refresh to get current puzzle
      setIsTransitioning(true)
      setSelectedDate(new Date())
      setRefreshKey(prev => prev + 1)
    } else {
      // When there's a date param, parse and set it
      try {
        const targetDate = parseAPIDate(dateParam)
        if (formatDateForAPI(targetDate) !== formatDateForAPI(selectedDate)) {
          setIsTransitioning(true)
          setSelectedDate(targetDate)
          setRefreshKey(prev => prev + 1)
        }
      } catch {
        setIsTransitioning(true)
        setSelectedDate(new Date())
        setRefreshKey(prev => prev + 1)
      }
    }
  }, [location.search])

  function parseAPIDate(dateStr: string): Date {
    // Handle ISO format (YYYY-MM-DD or ISO 8601)
    if (dateStr.includes('-') && (dateStr.includes('T') || dateStr.length === 10)) {
      // Extract YYYY-MM-DD from ISO string
      const datePart = dateStr.split('T')[0]
      const [year, month, day] = datePart.split('-').map(Number)
      // Create date in local timezone, not UTC
      return new Date(year, month - 1, day)
    }
    // Handle MM/DD/YYYY format
    const [month, day, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const handlePreviousDay = () => {
    if (prevPuzzleDate) {
      console.log('prevPuzzleDate:', prevPuzzleDate)
      setIsTransitioning(true)
      setUseDefaultPuzzle(false)
      try {
        const newDate = parseAPIDate(prevPuzzleDate)
        console.log('Created date:', newDate)
        setSelectedDate(newDate)
      } catch (e) {
        console.error('Failed to parse previous date:', e, prevPuzzleDate)
        setIsTransitioning(false)
      }
    }
  }

  const handleNextDay = () => {
    if (nextPuzzleDate) {
      console.log('nextPuzzleDate:', nextPuzzleDate)
      setIsTransitioning(true)
      setUseDefaultPuzzle(false)
      try {
        const newDate = parseAPIDate(nextPuzzleDate)
        console.log('Created date:', newDate)
        setSelectedDate(newDate)
      } catch (e) {
        console.error('Failed to parse next date:', e, nextPuzzleDate)
        setIsTransitioning(false)
      }
    }
  }

  // Fetch puzzle from API and initialize
  useEffect(() => {
    const initializePuzzle = async () => {
      if (!hasInitialized) {
        setLoading(true)
      }
      setError(null)
      try {
        const puzzleResponse = useDefaultPuzzle
          ? await puzzleService.getPuzzle()
          : await puzzleService.getPuzzle(formatDateForAPI(selectedDate))
        const categories = puzzleResponse.categories
        
        // Update the navigation dates from API
        setNextPuzzleDate(puzzleResponse.nextPuzzleDate)
        setPrevPuzzleDate(puzzleResponse.prevPuzzleDate)
        setPuzzleId(puzzleResponse.puzzleDate)
        updateDateQueryParam(puzzleResponse.puzzleDate)
        
        // Try to load saved state from localStorage using date-specific keys
        const savedStateStr = localStorage.getItem(`gameState_${puzzleResponse.puzzleDate}`)
        const savedCardsStr = localStorage.getItem(`shuffledCards_${puzzleResponse.puzzleDate}`)
        
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
        
        // If saved state exists for this date, restore it
        if (savedStateStr && savedCardsStr) {
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
        }
        
        setShowResults(initialGameState.won || initialGameState.gameOver)
        setGameState(initialGameState)
        setCards(initialCards)
        
        if (!hasInitialized) {
          setHasInitialized(true)
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load puzzle')
      } finally {
        setLoading(false)
        setIsTransitioning(false)
      }
    }
    initializePuzzle()
  }, [selectedDate, hasInitialized, useDefaultPuzzle, refreshKey])

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
      localStorage.setItem(`gameState_${puzzleId}`, JSON.stringify(stateToSave))
    }
  }, [gameState.selected, gameState.solved, gameState.mistakes, gameState.gameOver, gameState.won, gameState.guesses, puzzleId])

  // Save shuffled cards to localStorage whenever they change
  useEffect(() => {
    if (puzzleId && cards.length > 0) {
      localStorage.setItem(`shuffledCards_${puzzleId}`, JSON.stringify(cards))
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
      
      if (gameOver) {
        setShowResults(true)
      }

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

  const handleRestart = () => {
    if (puzzleId) {
      // Clear saved state for this puzzle
      localStorage.removeItem(`gameState_${puzzleId}`)
      localStorage.removeItem(`shuffledCards_${puzzleId}`)
      
      // Reset game state
      const initialCards = shuffleArray(gameState.categories.flatMap(cat => cat.cards.map(card => card)))
      setCards(initialCards)
      setGameState({
        categories: gameState.categories,
        selected: [],
        solved: [],
        mistakes: 0,
        gameOver: false,
        won: false,
        message: '',
        guesses: []
      })
      setShowResults(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg text-gray-700 dark:text-gray-300">Loading puzzle...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 sm:bg-gray-100 sm:dark:bg-gray-800 transition-colors">
      <Header />
      <div className="relative w-full sm:w-auto flex-1 mx-auto py-0 sm:py-8">
        <GameBoard
          gameState={gameState}
          cards={cards.filter(card => !gameState.solved.some(catName =>
            gameState.categories.find(cat => cat.name === catName)?.cards.map(c => c.id).includes(card.id)
          ))}
          onWordClick={handleWordClick}
          onSolve={handleSolve}
          onShuffle={handleShuffle}
          onDeselect={handleDeselect}
          selectedDate={selectedDate}
          canNavigatePrevious={canNavigatePrevious}
          canNavigateNext={canNavigateNext}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          isTransitioning={isTransitioning}
          onShowResults={() => setShowResults(true)}
          onRestart={handleRestart}
        />
        {isTransitioning && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Loading puzzle...</span>
            </div>
          </div>
        )}
      </div>
      {(showResults) && (
        <ResultsPopup
          gameState={gameState}
          puzzleDate={puzzleId || ''}
          onClose={() => setShowResults(false)}
        />
      )}
      <Footer />
    </div>
  )
}
