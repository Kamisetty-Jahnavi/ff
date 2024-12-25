import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import pool from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { Server as SocketIOServer } from 'socket.io'

declare global {
  var io: SocketIOServer
}

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  const { searchParams } = new URL(request.url)
  const assignedTo = searchParams.get('assignedTo') || user.id

  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC', [assignedTo])
    client.release()

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  const { title, assignedTo } = await request.json()

  try {
    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO tasks (title, assigned_to) VALUES ($1, $2) RETURNING *',
      [title, assignedTo || user.id]
    )
    client.release()

    const newTask = result.rows[0]
    global.io.to(`user_${assignedTo || user.id}`).emit('new-task', newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error('Error adding task:', error)
    return NextResponse.json({ message: 'Failed to add task' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request)
  const { id, completed } = await request.json()

  try {
    const client = await pool.connect()
    const result = await client.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 AND assigned_to = $3 RETURNING *',
      [completed, id, user.id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Task not found or not authorized' }, { status: 404 })
    }

    const updatedTask = result.rows[0]
    global.io.to(`user_${user.id}`).emit('update-task', updatedTask)

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 })
  }
}

