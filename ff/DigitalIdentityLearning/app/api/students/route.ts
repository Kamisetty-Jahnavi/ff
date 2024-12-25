import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import pool from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (user.user_type !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  try {
    const client = await pool.connect()
    const result = await client.query('SELECT id, username, email FROM users WHERE user_type = $1', ['student'])
    client.release()

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ message: 'Failed to fetch students' }, { status: 500 })
  }
}

