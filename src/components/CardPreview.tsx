import React, { useEffect, useState } from 'react'
import { Card } from '../types'

interface CardPreviewProps {
  card?: Card
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card }) => {
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
        // Use imageUrl from service call if available
        if (card.imageUrl) {
          if (isMounted) {
            setImageUrl(card.imageUrl)
            setLoading(false)
          }
          return
        }

        // Fall back to Scryfall API
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

  // Desktop fixed preview on right side
  if (!isMobile && card && imageUrl) {
    return (
      <div 
        className="hidden lg:block fixed top-48 z-50 pointer-events-none"
        style={{ left: 'calc(50% + min(48rem, 100vw) / 2)' }}
      >
        <div className="shadow-2xl rounded-lg overflow-hidden">
          {loading ? (
            <div className="w-80 aspect-[5/7] bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          ) : (
            <img
              src={imageUrl}
              alt={card.name}
              className="w-80 h-auto rounded"
            />
          )}
        </div>
      </div>
    )
  }

  // Mobile: show nothing (disabled on mobile)
  return null
}
