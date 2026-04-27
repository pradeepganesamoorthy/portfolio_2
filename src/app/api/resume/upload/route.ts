import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const session = await requireAdmin().catch(() => null)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const filename = `resume_${uuidv4()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), buffer)

  await prisma.resumeFile.updateMany({ data: { isPublished: false } })
  await prisma.resumeFile.create({
    data: {
      filename: file.name,
      path: `/uploads/${filename}`,
      mimeType: file.type,
      isPublished: true,
    },
  })

  return NextResponse.json({ success: true, path: `/uploads/${filename}` })
}
