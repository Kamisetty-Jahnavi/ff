'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PassPointsAuth from '@/components/PassPointsAuth'

export default function AddStudent() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, points }),
    })

    if (response.ok) {
      router.push('/teacher-dashboard')
    } else {
      alert('Failed to add student. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Set PassPoints:</label>
          <PassPointsAuth
            imageUrl="/auth-image.jpg"
            onAuthenticate={(newPoints) => setPoints(newPoints)}
            isRegistration={true}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Student
        </button>
      </form>
    </div>
  )
}

