import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import pool from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  const { videoId } = await request.json()

  try {
    const client = await pool.connect()
    await client.query(
      'INSERT INTO video_watches (user_id, video_id) VALUES ($1, $2) ON CONFLICT (user_id, video_id) DO NOTHING',
      [user.id, videoId]
    )
    client.release()

    return NextResponse.json({ message: 'Video marked as watched' }, { status: 201 })
  } catch (error) {
    console.error('Error marking video as watched:', error)
    return NextResponse.json({ message: 'Failed to mark video as watched' }, { status: 500 })
  }
}

