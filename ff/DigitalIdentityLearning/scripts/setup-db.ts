import { getPool } from '../lib/db'

async function setupDatabase() {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        user_type VARCHAR(10) NOT NULL,
        pass_points JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create user_activity table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        activity_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create videos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        chapter VARCHAR(100) NOT NULL,
        description TEXT,
        duration VARCHAR(20),
        thumbnail_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        assigned_to INTEGER REFERENCES users(id),
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create video_watches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS video_watches (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        video_id INTEGER REFERENCES videos(id),
        watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, video_id)
      )
    `)

    await client.query('COMMIT')
    console.log('Database setup completed successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error setting up database:', error)
  } finally {
    client.release()
  }
}

setupDatabase().catch(console.error)

