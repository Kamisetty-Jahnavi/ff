import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function createToken(user: { id: number; username: string; user_type: string }) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload
}

export async function authenticateUser(username: string, points: { x: number; y: number }[]) {
  // This function should be implemented in an API route, not in the Edge runtime
  throw new Error('Not implemented in Edge runtime')
}

export function getUserFromRequest(req: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return null
  }

  try {
    return verifyToken(token)
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

