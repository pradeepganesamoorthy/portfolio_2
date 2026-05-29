export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    let theme = await prisma.themeConfig.findFirst()
    
    if (!theme) {
      theme = await prisma.themeConfig.create({
        data: {
          id: 'default',
          themePreset: 'custom',
        },
      })
    }

    return NextResponse.json({ theme })
  } catch (error) {
    console.error('Error fetching theme:', error)
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    
    let theme = await prisma.themeConfig.findFirst()

    if (!theme) {
      theme = await prisma.themeConfig.create({
        data: {
          id: 'default',
          ...body,
        },
      })
    } else {
      theme = await prisma.themeConfig.update({
        where: { id: theme.id },
        data: body,
      })
    }

    return NextResponse.json({ success: true, theme })
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 })
  }
}
