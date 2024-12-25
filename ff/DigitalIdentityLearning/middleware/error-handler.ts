import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function errorHandler(error: unknown, req: NextRequest) {
  console.error('Error:', error)

  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 })
}

