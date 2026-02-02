import React, { useEffect, useState } from 'react'
import { puzzleService } from '../services/puzzleService'
import { Footer } from './Footer'
import { Header } from './Header'

export const ArchivePage: React.FC = () => {
  const [dates, setDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await puzzleService.getAllPuzzleDates()
        setDates(response.dates)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load archive')
      } finally {
        setLoading(false)
      }
    }

    fetchDates()
  }, [])

  const parseAPIDate = (dateStr: string): Date => {
    if (dateStr.includes('-') && (dateStr.includes('T') || dateStr.length === 10)) {
      const datePart = dateStr.split('T')[0]
      const [year, month, day] = datePart.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    const [month, day, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const formatDate = (dateStr: string) => {
    try {
      return parseAPIDate(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const formatMonth = (dateStr: string) => {
    try {
      return parseAPIDate(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const sortedDates = [...dates].sort(
    (a, b) => parseAPIDate(b).getTime() - parseAPIDate(a).getTime()
  )

  const groupedDates = sortedDates.reduce<Record<string, string[]>>((acc, date) => {
    const monthKey = formatMonth(date)
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(date)
    return acc
  }, {})

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Gatherings Archive</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Browse past puzzles and jump directly to a specific date.
        </p>

        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-300">Loading archive...</div>
        )}

        {error && (
          <div className="text-center text-red-600 dark:text-red-400">Error: {error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {Object.entries(groupedDates).map(([month, monthDates]) => (
              <section key={month} className="space-y-3">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {month}
                </h2>
                <div className="space-y-2">
                  {monthDates.map((date) => (
                    <a
                      key={date}
                      href={`/?date=${encodeURIComponent(date)}`}
                      className="block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-semibold">{formatDate(date)}</div>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
