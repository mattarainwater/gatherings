import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDarkMode } from '../contexts/DarkModeContext'
import { HowToPlayPopup } from './HowToPlayPopup'
import { TipsPopup } from './TipsPopup'

const API_KEY_STORAGE_KEY = 'magic-connections-api-key'

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const navigate = useNavigate()

  // Get today's date in Central Time
  const getTodayInCentralTime = () => {
    const now = new Date()
    const centralTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }))
    const year = centralTime.getFullYear()
    const month = String(centralTime.getMonth() + 1).padStart(2, '0')
    const day = String(centralTime.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const todayUrl = `/?date=${getTodayInCentralTime()}&t=${Date.now()}`
    navigate(todayUrl, { replace: false })
  }

  useEffect(() => {
    setHasApiKey(Boolean(localStorage.getItem(API_KEY_STORAGE_KEY)))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY)
    setHasApiKey(false)
  }

  return (
    <>
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <a
              href={`/?date=${getTodayInCentralTime()}`}
              onClick={handleLogoClick}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 cursor-pointer"
              aria-label="Gatherings home"
            >
              Gatherings
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
              <button
                onClick={() => setShowMobileMenu((prev) => !prev)}
                className="sm:hidden p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                aria-label="Toggle navigation"
                aria-expanded={showMobileMenu}
              >
                {showMobileMenu ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5h14a1 1 0 100-2H3a1 1 0 100 2zm14 4H3a1 1 0 100 2h14a1 1 0 100-2zm0 6H3a1 1 0 100 2h14a1 1 0 100-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 mt-4">
            <button
              onClick={() => setShowHowToPlay(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
            >
              How to Play
            </button>
            <button
              onClick={() => setShowTips(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
            >
              Hints
            </button>
            <Link
              to="/archive"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
            >
              Archive
            </Link>
            <a
              href="https://ko-fi.com/kofisupporter17038"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
            >
              Buy me a Booster! ☕
            </a>
            {hasApiKey && (
              <button
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
              >
                Logout
              </button>
            )}
          </div>
          {showMobileMenu && (
            <div className="sm:hidden mt-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-3">
              <ul className="flex flex-col gap-2">
                <li>
                  <button
                    onClick={() => {
                      setShowHowToPlay(true)
                      setShowMobileMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-700"
                  >
                    How to Play
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowTips(true)
                      setShowMobileMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-700"
                  >
                    Hints
                  </button>
                </li>
                <li>
                  <Link
                    to="/archive"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full px-3 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-700"
                  >
                    Archive
                  </Link>
                </li>
                <li>
                  <a
                    href="https://ko-fi.com/kofisupporter17038"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-3 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-700"
                  >
                    Buy me a Booster! ☕
                  </a>
                </li>
                {hasApiKey && (
                  <li>
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowMobileMenu(false)
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </header>
      {showHowToPlay && (
        <HowToPlayPopup onClose={() => setShowHowToPlay(false)} />
      )}
      {showTips && (
        <TipsPopup onClose={() => setShowTips(false)} />
      )}
    </>
  )
}
