import { randomBytes } from 'crypto'

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

export function verifyCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken
}

