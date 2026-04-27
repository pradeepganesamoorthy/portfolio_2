import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const resume = await prisma.resumeFile.findFirst({
    where: { isPublished: true },
    orderBy: { uploadedAt: 'desc' },
  })

  if (!resume) return NextResponse.json({ error: 'No resume published' }, { status: 404 })

  const filePath = path.join(process.cwd(), 'public', resume.path)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'File not found' }, { status: 404 })

  const buffer = fs.readFileSync(filePath)
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': resume.mimeType,
      'Content-Disposition': `attachment; filename="${resume.filename}"`,
    },
  })
}
