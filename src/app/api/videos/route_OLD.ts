import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ]

  return patterns.some((pattern) => pattern.test(url))
}

// GET VIDEOS
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const type = searchParams.get('type')
    const published = searchParams.get('published')

    const where: any = {}

    if (type) {
      where.type = type
    }

    if (published === 'true') {
      where.isPublished = true
    }

    const videos = await prisma.video.findMany({
      where,
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching videos:', error)

    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

// CREATE VIDEO
export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()

    const { type, title, youtubeUrl } = body

    if (!type || !title || !youtubeUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    const video = await prisma.video.create({
      data: {
        type,
        title,
        url: youtubeUrl,
        isPublished: true,
      },
    })

    return NextResponse.json({
      success: true,
      video,
    })
  } catch (error) {
    console.error('Error creating video:', error)

    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}

// UPDATE VIDEO
export async function PUT(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()

    const { id, title, youtubeUrl, isPublished } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Missing video ID' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (title !== undefined) {
      updateData.title = title
    }

    if (youtubeUrl !== undefined) {
      if (!isValidYouTubeUrl(youtubeUrl)) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL' },
          { status: 400 }
        )
      }

      updateData.url = youtubeUrl
    }

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished
    }

    const video = await prisma.video.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      video,
    })
  } catch (error) {
    console.error('Error updating video:', error)

    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    )
  }
}

// DELETE VIDEO
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing video ID' },
        { status: 400 }
      )
    }

    await prisma.video.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting video:', error)

    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}