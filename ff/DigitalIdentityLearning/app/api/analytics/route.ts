import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import pool from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (user.user_type !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('studentId')

  try {
    const client = await pool.connect()
    let result

    if (studentId) {
      result = await client.query(`
        SELECT 
          u.username,
          COUNT(DISTINCT t.id) as total_tasks,
          COUNT(DISTINCT CASE WHEN t.completed = true THEN t.id END) as completed_tasks,
          COUNT(DISTINCT v.id) as total_videos,
          COUNT(DISTINCT vw.video_id) as watched_videos
        FROM 
          users u
          LEFT JOIN tasks t ON u.id = t.assigned_to
          LEFT JOIN videos v ON true
          LEFT JOIN video_watches vw ON u.id = vw.user_id AND v.id = vw.video_id
        WHERE 
          u.id = $1
        GROUP BY 
          u.id, u.username
      `, [studentId])
    } else {
      result = await client.query(`
        SELECT 
          u.id,
          u.username,
          COUNT(DISTINCT t.id) as total_tasks,
          COUNT(DISTINCT CASE WHEN t.completed = true THEN t.id END) as completed_tasks,
          COUNT(DISTINCT v.id) as total_videos,
          COUNT(DISTINCT vw.video_id) as watched_videos
        FROM 
          users u
          LEFT JOIN tasks t ON u.id = t.assigned_to
          LEFT JOIN videos v ON true
          LEFT JOIN video_watches vw ON u.id = vw.user_id AND v.id = vw.video_id
        WHERE 
          u.user_type = 'student'
        GROUP BY 
          u.id, u.username
      `)
    }

    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ message: 'Failed to fetch analytics' }, { status: 500 })
  }
}

