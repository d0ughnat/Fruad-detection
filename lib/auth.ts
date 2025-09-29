import { PrismaClient } from '@/app/generated/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

// Ensure consistent JWT secret across all environments
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key'
  return secret
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
  isActive: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: number, userInfo?: { name: string; email: string; role: string }): string {
  try {
    const secret = getJWTSecret()
    
    // Validate secret
    if (!secret || secret.length < 8) {
      throw new Error('JWT secret is too short or missing')
    }
    
    const payload: any = { 
      userId
    }
    
    // Include user info in JWT for Edge Runtime compatibility
    if (userInfo) {
      payload.name = userInfo.name
      payload.email = userInfo.email
      payload.role = userInfo.role
    }
    
    console.log('Generating JWT token with payload:', {
      userId: payload.userId,
      hasName: !!payload.name,
      hasEmail: !!payload.email,
      hasRole: !!payload.role
    })
    
    const token = jwt.sign(payload, secret, { expiresIn: '7d' })
    
    console.log('Generated JWT token:', {
      secret: secret === 'fallback-secret-key' ? 'FALLBACK' : 'SECRET_SET',
      payloadKeys: Object.keys(payload),
      tokenLength: token.length,
      tokenPreview: token.substring(0, 30) + '...'
    })
    
    return token
  } catch (error) {
    console.error('JWT token generation error:', error)
    throw new Error('Failed to generate authentication token')
  }
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    const secret = getJWTSecret()
    const decoded = jwt.verify(token, secret) as { userId: number }
    return decoded
  } catch {
    return null
  }
}

export async function createSession(userId: number, userInfo?: { name: string; email: string; role: string }): Promise<string> {
  const token = generateToken(userId, userInfo)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })
  
  return token
}

export async function validateSession(token: string): Promise<User | null> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })
    
    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } })
      }
      return null
    }
    
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      avatar: session.user.avatar || undefined,
      isActive: session.user.isActive,
    }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) return null
  
  return validateSession(token)
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    console.log('loginUser - Starting authentication for:', email)
    
    const user = await prisma.user.findUnique({
      where: { email },
    })
    
    console.log('loginUser - Database lookup result:', {
      userFound: !!user,
      hasPassword: !!(user?.password),
      isActive: user?.isActive,
      userId: user?.id
    })
    
    if (!user || !user.password) {
      console.log('loginUser - User not found or no password')
      return { success: false, error: 'Invalid credentials' }
    }
    
    console.log('loginUser - Verifying password...')
    const isValid = await verifyPassword(password, user.password)
    console.log('loginUser - Password verification result:', isValid)
    
    if (!isValid) {
      console.log('loginUser - Password verification failed')
      return { success: false, error: 'Invalid credentials' }
    }
    
    if (!user.isActive) {
      console.log('loginUser - User account is deactivated')
      return { success: false, error: 'Account is deactivated' }
    }
    
    const token = await createSession(user.id, {
      name: user.name,
      email: user.email,
      role: user.role
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        description: 'User logged in successfully',
      },
    })
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || undefined,
        isActive: user.isActive,
      },
      token,
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResult> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existingUser) {
      return { success: false, error: 'Email already exists' }
    }
    
    const hashedPassword = await hashPassword(password)
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    
    const token = await createSession(user.id, {
      name: user.name,
      email: user.email,
      role: user.role
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        description: 'User registered successfully',
      },
    })
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || undefined,
        isActive: user.isActive,
      },
      token,
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Registration failed' }
  }
}

export async function logoutUser(token: string): Promise<void> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
    })
    
    if (session) {
      // Log activity
      await prisma.activity.create({
        data: {
          userId: session.userId,
          action: 'LOGOUT',
          description: 'User logged out',
        },
      })
      
      await prisma.session.delete({
        where: { token },
      })
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
}
