import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set in environment variables')
    }
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : undefined
    })
  }
  return pool
}

export default {
  query: async (text: string, params: any[]) => {
    const pool = getPool()
    const client = await pool.connect()
    try {
      return await client.query(text, params)
    } finally {
      client.release()
    }
  },
}

