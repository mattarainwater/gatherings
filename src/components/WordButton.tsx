import React, { useState, useEffect } from 'react'
import { Card } from '../types'

interface WordButtonProps {
  card: Card
  selected: boolean
  solved: boolean
  color?: string
  onClick: () => void
  onHover?: (card: Card) => void
  onLeave?: () => void
}

export const WordButton: React.FC<WordButtonProps> = ({
  card,
  selected,
  solved,
  color,
  onClick,
  onHover,
  onLeave
}) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCardImage = async () => {
      try {
        const response = await fetch(
          `https://api.scryfall.com/cards/${card.scryfall_id}`
        )
        if (response.ok) {
          const data = await response.json()
          const url =
            data.image_uris?.normal ||
            data.card_faces?.[0]?.image_uris?.normal ||
            ''
          setImageUrl(url)
        }
      } catch (error) {
        console.error('Failed to fetch card:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCardImage()
  }, [card.id])

  const baseClass = 'rounded transition-all cursor-pointer overflow-hidden'

  if (solved) {
    return (
      <button
        disabled
        className={`${baseClass} ${color || 'bg-gray-600'} opacity-100 ring-4 ring-offset-2`}
      >
        {loading ? (
          <div className="w-full h-32 bg-gray-300 animate-pulse" />
        ) : imageUrl ? (
          <img src={imageUrl} alt={card.name} className="w-full h-auto" />
        ) : (
          <div className="w-full h-32 bg-gray-500 flex items-center justify-center text-white text-sm">
            {card.name}
          </div>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover?.(card)}
      onMouseLeave={() => onLeave?.()}
      className={`${baseClass} ${
        selected
          ? 'ring-4 ring-yellow-400 ring-offset-2 scale-95'
          : 'ring-2 ring-gray-300 hover:ring-gray-400'
      }`}
    >
      {loading ? (
        <div className="w-full h-32 bg-gray-300 animate-pulse" />
      ) : imageUrl ? (
        <img src={imageUrl} alt={card.name} className="w-full h-auto" />
      ) : (
        <div className="w-full h-32 bg-gray-400 flex items-center justify-center text-white text-sm text-center px-2">
          {card.name}
        </div>
      )}
    </button>
  )
}
