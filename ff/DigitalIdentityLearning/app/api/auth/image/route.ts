import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ message: 'Username is required' }, { status: 400 })
  }

  try {
    const client = await pool.connect()
    const result = await client.query('SELECT image_path FROM users WHERE username = $1', [username])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ imagePath: result.rows[0].image_path })
  } catch (error) {
    console.error('Error fetching user image:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

