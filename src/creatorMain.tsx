import React from 'react'
import { createRoot } from 'react-dom/client'
import { PuzzleCreator } from './components/PuzzleCreator'
import './index.css'
import { DarkModeProvider } from './contexts/DarkModeContext'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <PuzzleCreator />
    </DarkModeProvider>
  </React.StrictMode>
)
