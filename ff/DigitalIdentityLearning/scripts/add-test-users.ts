import { getPool } from '../lib/db'
import crypto from 'crypto'

async function addTestUsers() {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Add teacher
    const teacherPoints = [
      { x: 100, y: 100 },
      { x: 200, y: 200 },
      { x: 300, y: 300 }
    ]
    await client.query(
      'INSERT INTO users (username, email, user_type, pass_points) VALUES ($1, $2, $3, $4)',
      ['teacher1', 'teacher1@example.com', 'teacher', JSON.stringify(teacherPoints)]
    )

    // Add student
    const studentPoints = [
      { x: 150, y: 150 },
      { x: 250, y: 250 },
      { x: 350, y: 350 }
    ]
    await client.query(
      'INSERT INTO users (username, email, user_type, pass_points) VALUES ($1, $2, $3, $4)',
      ['student1', 'student1@example.com', 'student', JSON.stringify(studentPoints)]
    )

    await client.query('COMMIT')
    console.log('Test users added successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error adding test users:', error)
  } finally {
    client.release()
  }
}

addTestUsers().catch(console.error)

