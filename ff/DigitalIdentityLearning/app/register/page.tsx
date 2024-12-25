'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PassPointsAuth from '@/components/PassPointsAuth'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState<'teacher' | 'student'>('student')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (points: { x: number; y: number }[]) => {
    setError('')
    if (!username || !email) {
      setError('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, userType, points }),
      })

      if (response.ok) {
        router.push('/login')
      } else {
        const data = await response.json()
        setError(data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as 'teacher' | 'student')}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <PassPointsAuth
            onAuthenticate={handleRegister}
            isRegistration={true}
          />
        </div>
      </div>
    </div>
  )
}

