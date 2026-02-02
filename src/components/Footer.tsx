import React, { useState } from 'react'
import { HowToPlayPopup } from './HowToPlayPopup'
import { useDarkMode } from '../contexts/DarkModeContext'

export const Footer: React.FC = () => {
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <>
      <footer className="w-full bg-white dark:bg-gray-800 sm:bg-gray-100 sm:dark:bg-gray-900 py-4 px-4 mt-auto transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="text-center sm:text-left">
            Gatherings is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. 
            <br />
            Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setShowHowToPlay(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline cursor-pointer"
            >
              How to Play
            </button>
            <a 
              href="https://ko-fi.com/kofisupporter17038"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
            >
              Buy me a Booster! ☕
            </a>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </footer>

      {showHowToPlay && (
        <HowToPlayPopup onClose={() => setShowHowToPlay(false)} />
      )}
    </>
  )
}
