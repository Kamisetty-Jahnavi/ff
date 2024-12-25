import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import pool from '@/lib/db'
import { getVideoDetails } from '@/lib/youtube'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM videos ORDER BY created_at DESC')
    client.release()

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ message: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (user.user_type !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const { url, chapter } = await request.json()

  try {
    const videoId = new URL(url).searchParams.get('v')
    if (!videoId) {
      return NextResponse.json({ message: 'Invalid YouTube URL' }, { status: 400 })
    }

    const videoDetails = await getVideoDetails(videoId)

    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO videos (title, url, chapter, description, duration, thumbnail_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [videoDetails.title, url, chapter, videoDetails.description, videoDetails.duration, videoDetails.thumbnailUrl]
    )
    client.release()

    return NextResponse.json({ id: result.rows[0].id, message: 'Video added successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error adding video:', error)
    return NextResponse.json({ message: 'Failed to add video' }, { status: 500 })
  }
}

