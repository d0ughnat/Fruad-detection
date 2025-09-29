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
    const dataType = searchParams.get('dataType')

    let dashboardData
    if (dataType) {
      dashboardData = await prisma.dashboardData.findUnique({
        where: {
          userId_dataType: {
            userId: user.id,
            dataType,
          },
        },
      })
    } else {
      dashboardData = await prisma.dashboardData.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
      })
    }

    return NextResponse.json({ dashboardData })
  } catch (error) {
    console.error('Get dashboard data API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { dataType, data } = await request.json()

    if (!dataType || !data) {
      return NextResponse.json(
        { error: 'dataType and data are required' },
        { status: 400 }
      )
    }

    const dashboardData = await prisma.dashboardData.upsert({
      where: {
        userId_dataType: {
          userId: user.id,
          dataType,
        },
      },
      update: {
        data,
      },
      create: {
        userId: user.id,
        dataType,
        data,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: 'DATA_SAVE',
        description: `Saved dashboard data: ${dataType}`,
        metadata: { dataType },
      },
    })

    return NextResponse.json({ dashboardData })
  } catch (error) {
    console.error('Save dashboard data API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get('dataType')

    if (!dataType) {
      return NextResponse.json(
        { error: 'dataType is required' },
        { status: 400 }
      )
    }

    await prisma.dashboardData.delete({
      where: {
        userId_dataType: {
          userId: user.id,
          dataType,
        },
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: 'DATA_DELETE',
        description: `Deleted dashboard data: ${dataType}`,
        metadata: { dataType },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete dashboard data API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
