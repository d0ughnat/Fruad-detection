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
    const name = searchParams.get('name')

    let promptChains
    if (name) {
      promptChains = await prisma.promptChain.findUnique({
        where: { name },
      })
    } else {
      promptChains = await prisma.promptChain.findMany({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      })
    }

    return NextResponse.json({ promptChains })
  } catch (error) {
    console.error('Get prompt chains API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { name, description, prompts } = await request.json()

    if (!name || !prompts) {
      return NextResponse.json(
        { error: 'name and prompts are required' },
        { status: 400 }
      )
    }

    const promptChain = await prisma.promptChain.create({
      data: {
        name,
        description,
        prompts,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: 'PROMPT_CHAIN_CREATE',
        description: `Created prompt chain: ${name}`,
        metadata: { name, promptCount: prompts.length },
      },
    })

    return NextResponse.json({ promptChain })
  } catch (error) {
    console.error('Create prompt chain API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id, name, description, prompts, isActive } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const promptChain = await prisma.promptChain.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        prompts: prompts || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: 'PROMPT_CHAIN_UPDATE',
        description: `Updated prompt chain: ${promptChain.name}`,
        metadata: { id, name },
      },
    })

    return NextResponse.json({ promptChain })
  } catch (error) {
    console.error('Update prompt chain API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
