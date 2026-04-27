export interface ParsedResume {
  name?: string
  title?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  skills?: string[]
  experience?: Array<{
    title: string
    company: string
    startDate: string
    endDate: string
    bullets: string[]
  }>
  education?: Array<{
    degree: string
    institution: string
    startYear: string
    endYear: string
  }>
  certifications?: Array<{ title: string; issuer: string; date: string }>
  projects?: Array<{ title: string; description: string; tags: string[] }>
}

export async function parseResume(buffer: Buffer, mimeType: string): Promise<ParsedResume> {
  let text = ''

  if (mimeType === 'application/pdf') {
    try {
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(buffer)
      text = data.text
    } catch {
      text = ''
    }
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } catch {
      text = ''
    }
  }

  return extractFromText(text)
}

function extractFromText(text: string): ParsedResume {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const result: ParsedResume = {}

  // Email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i)
  if (emailMatch) result.email = emailMatch[0]

  // Phone
  const phoneMatch = text.match(/\+?[\d\s\-().]{10,15}/)
  if (phoneMatch) result.phone = phoneMatch[0].trim()

  // Name (usually first non-email line)
  if (lines[0] && !lines[0].includes('@') && !lines[0].match(/\d{5}/)) {
    result.name = lines[0]
  }

  // Title (second line often)
  if (lines[1] && lines[1].length < 80) {
    result.title = lines[1]
  }

  // Skills section
  const skillsIdx = lines.findIndex(l =>
    /skills|technologies|tech stack/i.test(l)
  )
  if (skillsIdx !== -1) {
    const skillLines = lines.slice(skillsIdx + 1, skillsIdx + 15)
    const skills: string[] = []
    for (const line of skillLines) {
      if (/experience|education|project|certif/i.test(line)) break
      const parts = line.split(/[,|•·]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 30)
      skills.push(...parts)
    }
    if (skills.length) result.skills = skills.slice(0, 30)
  }

  // Summary
  const summaryIdx = lines.findIndex(l => /summary|profile|objective/i.test(l))
  if (summaryIdx !== -1) {
    const summaryLines = lines.slice(summaryIdx + 1, summaryIdx + 6)
    result.summary = summaryLines.join(' ').slice(0, 500)
  }

  return result
}
