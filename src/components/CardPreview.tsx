import React, { useEffect, useState } from 'react'
import { Card } from '../types'

interface CardPreviewProps {
  card?: Card
  mouseX?: number
  mouseY?: number
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card, mouseX = 0, mouseY = 0 }) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchCardImage = async () => {
      if (!card) {
        setImageUrl('')
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const response = await fetch(
          `https://api.scryfall.com/cards/${card.scryfall_id}`
        )
        if (response.ok) {
          const data = await response.json()
          const url =
            data.image_uris?.large ||
            data.card_faces?.[0]?.image_uris?.large ||
            ''
          if (isMounted) {
            setImageUrl(url)
          }
        } else if (isMounted) {
          setImageUrl('')
        }
      } catch {
        if (isMounted) {
          setImageUrl('')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCardImage()

    return () => {
      isMounted = false
    }
  }, [card])

  // Desktop floating preview
  if (!isMobile && card && imageUrl) {
    return (
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${mouseX + 10}px`,
          top: `${mouseY + 10}px`,
        }}
      >
        <div className="shadow-2xl rounded-lg overflow-hidden">
          {loading ? (
            <div className="w-64 h-96 bg-gray-200 animate-pulse rounded" />
          ) : (
            <img
              src={imageUrl}
              alt={card.name}
              className="w-64 h-auto rounded"
            />
          )}
        </div>
      </div>
    )
  }

  // Mobile: show nothing (disabled on mobile)
  return null
}
