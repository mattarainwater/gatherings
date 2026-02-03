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
        // Use imageUrl from service call if available
        if (card.imageUrl) {
          setImageUrl(card.imageUrl)
          setLoading(false)
          return
        }
        console.log('fallback to scryfall for', card.name)
        // Fall back to Scryfall API
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
  }, [card.id, card.imageUrl])

  const baseClass = 'rounded transition-all cursor-pointer overflow-hidden aspect-[5/7]'

  if (solved) {
    return (
      <button
        disabled
        className={`${baseClass} ${color || 'bg-gray-600'} opacity-100 ring-4 ring-offset-2 flex items-center justify-center`}
      >
        {loading ? (
          <div className="w-full h-full bg-gray-300 animate-pulse" />
        ) : imageUrl ? (
          <img src={imageUrl} alt={card.name} className="w-full h-full object-cover sm:object-contain object-center" />
        ) : (
          <div className="w-full h-full bg-gray-500 flex items-center justify-center text-white text-xs">
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
          : 'ring-2 ring-gray-300 dark:ring-gray-600 hover:ring-gray-400 dark:hover:ring-gray-500'
      } flex items-center justify-center`}
    >
      {loading ? (
        <div className="h-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
      ) : imageUrl ? (
        <img src={imageUrl} alt={card.name} className="h-full w-full object-cover sm:object-contain object-center" />
      ) : (
        <div className="h-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs text-center px-2">
          {card.name}
        </div>
      )}
    </button>
  )
}
