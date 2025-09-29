import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Login API - Received request:', {
      email: email ? email.substring(0, 5) + '***' : 'NO_EMAIL',
      hasPassword: !!password,
      passwordLength: password?.length || 0
    })

    if (!email || !password) {
      console.log('Login API - Missing credentials')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Login API - Calling loginUser function...')
    const result = await loginUser(email, password)
    
    console.log('Login API - loginUser result:', {
      success: result.success,
      error: result.error,
      hasUser: !!result.user,
      hasToken: !!result.token
    })

    if (!result.success) {
      console.log('Login API - Authentication failed:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: result.user,
    })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
