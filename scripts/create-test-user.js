const { PrismaClient } = require('../app/generated/prisma')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'USER',
        isActive: true,
      },
    })
    
    console.log('Test user created successfully!')
    console.log('Login credentials:')
    console.log('Email: test@example.com')
    console.log('Password: password123')
    console.log('User ID:', user.id)
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Test user already exists!')
      console.log('Login credentials:')
      console.log('Email: test@example.com')
      console.log('Password: password123')
    } else {
      console.error('Error creating test user:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
