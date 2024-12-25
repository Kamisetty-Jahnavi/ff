import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { createToken } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(request: Request) {
  const { username, email, userType, points } = await request.json()

  if (!username || !email || !userType || !points || points.length !== 3) {
    return NextResponse.json({ message: 'Invalid input data' }, { status: 400 })
  }

  try {
    const client = await pool.connect()
    
    // Check if user already exists
    const existingUser = await client.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email])
    if (existingUser.rows.length > 0) {
      client.release()
      return NextResponse.json({ message: 'Username or email already exists' }, { status: 400 })
    }

    // Store the points as a JSON string
    const pointsJson = JSON.stringify(points)

    const result = await client.query(
      'INSERT INTO users (username, email, user_type, pass_points) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, email, userType, pointsJson]
    )
    client.release()

    const userId = result.rows[0].id

    const token = await createToken({ id: userId, username, user_type: userType })

    const response = NextResponse.json({ message: 'Registration successful' })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 })
  }
}

