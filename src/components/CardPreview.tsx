import React, { useEffect, useState, useRef } from 'react'
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
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const previewRef = useRef<HTMLDivElement>(null)

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

  // Calculate optimal position to keep preview on screen
  useEffect(() => {
    if (!previewRef.current || !card || !imageUrl) return

    const rect = previewRef.current.getBoundingClientRect()
    const previewWidth = rect.width || 256 // w-64 = 256px
    const previewHeight = rect.height || 384 // h-96 = 384px
    const offset = 10

    let x = mouseX + offset
    let y = mouseY + offset

    // Check if preview goes off right edge
    if (x + previewWidth > window.innerWidth) {
      x = mouseX - previewWidth - offset
    }

    // Check if preview goes off bottom edge
    if (y + previewHeight > window.innerHeight) {
      y = mouseY - previewHeight - offset
    }

    // Check if preview goes off left edge
    if (x < 0) {
      x = offset
    }

    // Check if preview goes off top edge
    if (y < 0) {
      y = offset
    }

    setPosition({ x, y })
  }, [mouseX, mouseY, card, imageUrl])

  // Desktop floating preview
  if (!isMobile && card && imageUrl) {
    return (
      <div
        ref={previewRef}
        className="fixed pointer-events-none z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="shadow-2xl rounded-lg overflow-hidden">
          {loading ? (
            <div className="w-64 h-96 bg-gray-200 animate-pulse rounded" />
          ) : (
            <img
              src={imageUrl}
              alt={card.name}
              className="w-96 h-auto rounded"
            />
          )}
        </div>
      </div>
    )
  }

  // Mobile: show nothing (disabled on mobile)
  return null
}
