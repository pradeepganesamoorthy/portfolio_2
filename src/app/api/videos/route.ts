import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Extract YouTube ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/,
    /youtube\.com\/embed\/([^&?/]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }

  return null
}

// Validate YouTube URL
function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null
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
      where.isDraft = false
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { type, title, description, youtubeUrl, projectName } = body

    if (!type || !title || !youtubeUrl) {
      return NextResponse.json(
        { error: 'Type, title, and YouTube URL are required' },
        { status: 400 }
      )
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Use youtube.com/watch or youtu.be format' },
        { status: 400 }
      )
    }

    const youtubeId = extractYouTubeId(youtubeUrl)
    if (!youtubeId) {
      return NextResponse.json(
        { error: 'Could not extract YouTube ID from URL' },
        { status: 400 }
      )
    }

    const maxOrderVideo = await prisma.video.findFirst({
      where: { type },
      orderBy: { createdAt: 'desc' },
    })

    const newOrder = maxOrderVideo ? maxOrderVideo.order + 1 : 0

    const video = await prisma.video.create({
      data: {
        type,
        title,
        url: youtubeUrl,
        description: description || '',
        youtubeUrl,
        youtubeId,
        projectName: projectName || '',
        order: newOrder,
        visible: true,
        showInGallery: true,
        isDraft: true,
      },
    })

    return NextResponse.json({ success: true, video })
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      id,
      title,
      description,
      youtubeUrl,
      projectName,
      order,
      visible,
      showInGallery,
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (projectName !== undefined) updateData.projectName = projectName
    if (order !== undefined) updateData.order = order
    if (visible !== undefined) updateData.visible = visible
    if (showInGallery !== undefined) updateData.showInGallery = showInGallery

    if (youtubeUrl !== undefined) {
      if (!isValidYouTubeUrl(youtubeUrl)) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL' },
          { status: 400 }
        )
      }

      const youtubeId = extractYouTubeId(youtubeUrl)
      if (!youtubeId) {
        return NextResponse.json(
          { error: 'Could not extract YouTube ID from URL' },
          { status: 400 }
        )
      }

      updateData.url = youtubeUrl
      updateData.youtubeUrl = youtubeUrl
      updateData.youtubeId = youtubeId
    }

    const video = await prisma.video.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, video })
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    await prisma.video.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}