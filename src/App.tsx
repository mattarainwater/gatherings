import { Routes, Route } from 'react-router-dom'
import { Game } from './components/Game'
import { ArchivePage } from './components/ArchivePage'
import { PuzzleCreator } from './components/PuzzleCreator'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/creator" element={<PuzzleCreator />} />
    </Routes>
  )
}
