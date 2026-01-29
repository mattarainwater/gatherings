import React, { useEffect, useState } from 'react'

interface CardPreviewProps {
  word?: string
}

export const CardPreview: React.FC<CardPreviewProps> = ({ word }) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchCardImage = async () => {
      if (!word) {
        setImageUrl('')
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const response = await fetch(
          `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(word)}`
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
  }, [word])

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <div className="text-sm font-semibold text-gray-700 mb-3">Card Preview</div>
      {!word && (
        <div className="text-gray-500 text-sm">Hover a card to preview.</div>
      )}
      {word && loading && (
        <div className="w-full h-64 bg-gray-200 animate-pulse rounded" />
      )}
      {word && !loading && imageUrl && (
        <img src={imageUrl} alt={word} className="w-full h-auto rounded" />
      )}
      {word && !loading && !imageUrl && (
        <div className="text-gray-500 text-sm">No image found.</div>
      )}
    </div>
  )
}
