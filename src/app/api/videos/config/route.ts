export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch video config
export async function GET() {
  try {
    let config = await prisma.videoConfig.findFirst()

    // Create default config if none exists
    if (!config) {
      config = await prisma.videoConfig.create({
        data: {
          enabled: true,
        },
      })
    }

    return NextResponse.json(
      {
        success: true,
        config,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching video config:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch config',
      },
      { status: 500 }
    )
  }
}

// PUT - Update video config
export async function PUT(req: NextRequest) {
  try {
    // Admin validation
    const session = await requireAdmin().catch(() => null)

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const body = await req.json()
    const enabled = Boolean(body?.enabled)

    let config = await prisma.videoConfig.findFirst()

    // Create config if not exists
    if (!config) {
      config = await prisma.videoConfig.create({
        data: {
          enabled,
        },
      })
    } else {
      // Update existing config
      config = await prisma.videoConfig.update({
        where: {
          id: config.id,
        },
        data: {
          enabled,
        },
      })
    }

    return NextResponse.json(
      {
        success: true,
        config,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating video config:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update config',
      },
      { status: 500 }
    )
  }
}