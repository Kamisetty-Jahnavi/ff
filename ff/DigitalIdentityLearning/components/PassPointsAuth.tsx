import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Point {
  x: number
  y: number
}

interface PassPointsAuthProps {
  onAuthenticate: (points: Point[]) => void
  isRegistration?: boolean
}

const PassPointsAuth: React.FC<PassPointsAuthProps> = ({ onAuthenticate, isRegistration = false }) => {
  const [points, setPoints] = useState<Point[]>([])
  const imageRef = useRef<HTMLImageElement>(null)
  const imageUrl = 'https://picsum.photos/seed/digitalidentity/500/300'

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (imageRef.current && points.length < 3) {
      const rect = imageRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setPoints([...points, { x, y }])
    }
  }

  useEffect(() => {
    if (!isRegistration && points.length === 3) {
      onAuthenticate(points)
    }
  }, [points, isRegistration, onAuthenticate])

  const handleSubmit = () => {
    if (points.length === 3) {
      onAuthenticate(points)
    } else {
      alert('Please select 3 points on the image.')
    }
  }

  return (
    <div className="relative">
      <Image
        ref={imageRef}
        src={imageUrl}
        alt="Authentication Image"
        width={500}
        height={300}
        onClick={handleImageClick}
        className="cursor-crosshair"
      />
      {points.map((point, index) => (
        <div
          key={index}
          className="absolute w-3 h-3 bg-red-500 rounded-full"
          style={{ left: point.x - 4, top: point.y - 4 }}
        />
      ))}
      {isRegistration && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {points.length === 3 ? 'Register Points' : `Select ${3 - points.length} more point${3 - points.length === 1 ? '' : 's'}`}
        </button>
      )}
    </div>
  )
}

export default PassPointsAuth

