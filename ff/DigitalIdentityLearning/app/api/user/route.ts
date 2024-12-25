import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: Request) {
  const user = getUserFromRequest(request)

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    userType: user.user_type
  })
}

