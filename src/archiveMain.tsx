import React from 'react'
import { createRoot } from 'react-dom/client'
import { ArchivePage } from './components/ArchivePage'
import { DarkModeProvider } from './contexts/DarkModeContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <ArchivePage />
    </DarkModeProvider>
  </React.StrictMode>
)
