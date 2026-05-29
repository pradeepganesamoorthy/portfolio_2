import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let config = await prisma.animationConfig.findFirst()
    
    if (!config) {
      config = await prisma.animationConfig.create({
        data: {
          id: 'default',
          selectedAnimation: 'quantum-field',
        },
      })
    }

    return NextResponse.json({ config })
  } catch (error) {
    console.error('Error fetching animation config:', error)
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    
    let config = await prisma.animationConfig.findFirst()

    if (!config) {
      config = await prisma.animationConfig.create({
        data: {
          id: 'default',
          ...body,
        },
      })
    } else {
      config = await prisma.animationConfig.update({
        where: { id: config.id },
        data: body,
      })
    }

    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error('Error updating animation config:', error)
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
}
