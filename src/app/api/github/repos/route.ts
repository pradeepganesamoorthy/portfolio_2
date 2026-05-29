
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const config = await prisma.githubConfig.findFirst()
  if (!config?.username) return NextResponse.json({ repos: [] })

  try {
    const res = await fetch(
      `https://api.github.com/users/${config.username}/repos?per_page=100&sort=${config.sortBy}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 300 },
      }
    )

    if (!res.ok) return NextResponse.json({ repos: [], error: 'GitHub API error' })

    let repos = await res.json()

    if (config.excludeRepos.length > 0) {
      repos = repos.filter((r: { name: string }) => !config.excludeRepos.includes(r.name))
    }

    if (config.featuredRepos.length > 0) {
      repos = repos.filter((r: { name: string }) => config.featuredRepos.includes(r.name))
    }

    const mapped = repos.slice(0, 20).map((r: {
      id: number; name: string; description: string | null;
      html_url: string; language: string | null;
      stargazers_count: number; updated_at: string; fork: boolean;
    }) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      updatedAt: r.updated_at,
      fork: r.fork,
    }))

    return NextResponse.json({ repos: mapped, username: config.username })
  } catch {
    return NextResponse.json({ repos: [], error: 'Failed to fetch' })
  }
}
