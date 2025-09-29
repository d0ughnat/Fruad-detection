import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@/app/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const taskType = searchParams.get('taskType')
    const taskId = searchParams.get('taskId')

    let progress
    if (taskType && taskId) {
      progress = await prisma.progress.findUnique({
        where: {
          userId_taskType_taskId: {
            userId: user.id,
            taskType,
            taskId,
          },
        },
      })
    } else {
      progress = await prisma.progress.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
      })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Get progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { taskType, taskId, status, percentage, metadata } = await request.json()

    if (!taskType || !taskId) {
      return NextResponse.json(
        { error: 'taskType and taskId are required' },
        { status: 400 }
      )
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_taskType_taskId: {
          userId: user.id,
          taskType,
          taskId,
        },
      },
      update: {
        status: status || undefined,
        percentage: percentage !== undefined ? percentage : undefined,
        metadata: metadata || undefined,
      },
      create: {
        userId: user.id,
        taskType,
        taskId,
        status: status || 'IN_PROGRESS',
        percentage: percentage || 0,
        metadata: metadata || undefined,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: 'PROGRESS_UPDATE',
        description: `Updated progress for ${taskType}:${taskId}`,
        metadata: { taskType, taskId, status, percentage },
      },
    })

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Update progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
