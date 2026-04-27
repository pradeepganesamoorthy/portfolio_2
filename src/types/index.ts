export interface HeroData {
  name: string
  title: string
  subtitle: string
  tagline: string
  ctaText: string
  ctaSecondary: string
}

export interface AboutData {
  bio: string
  location: string
  email: string
  phone: string
  linkedin: string
  github: string
  profileImage?: string
}

export interface SkillCategory {
  category: string
  items: string[]
  icon?: string
}

export interface ExperienceData {
  title: string
  company: string
  project?: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface ProjectData {
  title: string
  company: string
  period: string
  description: string
  tags: string[]
  featured: boolean
  thumbnail?: string
  url?: string
}

export interface CertificationData {
  title: string
  issuer: string
  date: string
  credentialUrl?: string
  badge?: string
}

export interface EducationData {
  degree: string
  field: string
  institution: string
  location: string
  startYear: string
  endYear: string
}

export interface ContactData {
  heading: string
  subtext: string
  email: string
  phone: string
  linkedin: string
  github: string
}

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  url: string
  language: string | null
  stars: number
  updatedAt: string
  fork: boolean
}

export interface AdminUser {
  id: string
  username: string
  isDefault: boolean
}

export interface PortfolioItem {
  id: string
  section: string
  key: string
  value: unknown
  visible: boolean
  order: number
  isDraft: boolean
  publishedAt: string | null
  updatedAt: string
}
