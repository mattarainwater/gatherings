import { useState } from 'react'
import { Game } from './components/Game'
import { PuzzleCreator } from './components/PuzzleCreator'

type Page = 'game' | 'creator'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('game')

  return (
    <div>
      {/* <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex gap-4">
          <button
            onClick={() => setCurrentPage('game')}
            className={`px-4 py-2 rounded ${
              currentPage === 'game' ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            Game
          </button>
          <button
            onClick={() => setCurrentPage('creator')}
            className={`px-4 py-2 rounded ${
              currentPage === 'creator' ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            Create Puzzle
          </button>
        </div>
      </nav> */}

      {currentPage === 'game' && <Game />}
      {currentPage === 'creator' && <PuzzleCreator />}
    </div>
  )
}
