import { NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'
import pool from '@/lib/db'

function calculateDistance(point1: { x: number, y: number }, point2: { x: number, y: number }) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}

export async function POST(request: Request) {
  const { username, userType, points } = await request.json()

  try {
    const client = await pool.connect()
    const userResult = await client.query('SELECT * FROM users WHERE username = $1 AND user_type = $2', [username, userType])

    if (userResult.rows.length === 0) {
      client.release()
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    const user = userResult.rows[0]
    const storedPoints = JSON.parse(user.pass_points)

    const isAuthenticated = points.every((point, index) => {
      const storedPoint = storedPoints[index]
      const distance = calculateDistance(point, storedPoint)
      return distance < 30 // Increased tolerance to 30 pixels
    })

    if (!isAuthenticated) {
      client.release()
      return NextResponse.json({ message: 'Authentication failed' }, { status: 401 })
    }

    // Log user activity
    await client.query('INSERT INTO user_activity (user_id, activity_type) VALUES ($1, $2)', [user.id, 'login'])
    client.release()

    const token = await createToken({
      id: user.id,
      username: user.username,
      user_type: user.user_type,
    })

    const response = NextResponse.json({ message: 'Authentication successful', userType: user.user_type })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

