import React from 'react'
import { createRoot } from 'react-dom/client'
import { PuzzleCreator } from './components/PuzzleCreator'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PuzzleCreator />
  </React.StrictMode>
)
