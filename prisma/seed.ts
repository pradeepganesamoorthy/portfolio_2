import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const portfolioData = [
  {
    section: 'hero',
    key: 'main',
    draftValue: {
      name: 'Pradeep Ganesamoorthy',
      title: 'Data Engineer',
      subtitle: 'ETL/ELT · BigQuery · Python · Cloud Data Platforms',
      tagline: 'Results-driven Data Engineer with 6+ years designing and automating data pipelines at enterprise scale.',
      ctaText: 'View My Work',
      ctaSecondary: 'Download Resume',
    },
    order: 0,
  },
  {
    section: 'about',
    key: 'main',
    draftValue: {
      bio: 'Results-driven Data Engineer with 6+ years of experience designing and automating ETL/ELT pipelines, migrating large-scale data systems, and implementing data security frameworks. Proven expertise in Python, SQL, BigQuery, and cloud data platforms. Delivered a 25% improvement in system resilience and a 40% improvement in reporting speed across enterprise-scale projects. Recognized with 6 awards at TCS for technical excellence, cross-functional collaboration, and delivery quality.',
      location: 'Bangalore, Karnataka',
      email: 'pradeepganesh111@gmail.com',
      phone: '+91 8807526370',
      linkedin: 'https://linkedin.com/in/pradeepganesamoorthy',
      github: 'https://github.com/pradeepganesh',
    },
    order: 1,
  },
  {
    section: 'skills',
    key: 'languages',
    draftValue: {
      category: 'Languages & Tools',
      items: ['Python', 'SQL', 'Shell Scripting', 'Git'],
      icon: 'code',
    },
    order: 0,
  },
  {
    section: 'skills',
    key: 'cloud',
    draftValue: {
      category: 'Cloud & Databases',
      items: ['Google BigQuery', 'PostgreSQL', 'MySQL', 'Teradata', 'Oracle Cloud'],
      icon: 'cloud',
    },
    order: 1,
  },
  {
    section: 'skills',
    key: 'engineering',
    draftValue: {
      category: 'Data Engineering',
      items: ['ETL/ELT Pipelines', 'Data Migration', 'Workflow Automation', 'Data Quality', 'AES Encryption', 'PII Protection'],
      icon: 'database',
    },
    order: 2,
  },
  {
    section: 'skills',
    key: 'frameworks',
    draftValue: {
      category: 'Frameworks & Libraries',
      items: ['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'Streamlit'],
      icon: 'layers',
    },
    order: 3,
  },
  {
    section: 'experience',
    key: 'tcs',
    draftValue: {
      title: 'Data Engineer / Systems Engineer',
      company: 'Tata Consultancy Services (TCS)',
      project: 'PayPal Project',
      location: 'Bangalore, Karnataka',
      startDate: 'Jul 2023',
      endDate: 'Present',
      current: true,
      bullets: [
        'Led end-to-end data migration from Teradata to Google BigQuery, including schema mapping, data validation, and reconciliation for enterprise-scale datasets.',
        'Implemented AES (AEAD_AES_GCM_256) encryption for all sensitive data, strengthening data security posture and achieving 25% improvement in system resilience and data integrity.',
        'Developed and automated ETL/ELT workflows using Python and Shell Scripting, significantly reducing manual turnaround time.',
        'Built an end-to-end ETL pipeline for the Canada project (Mar–Aug 2025) including fraud detection logic, PII encryption, and audit compliance improvements.',
        'Managed workflow failures proactively, performing root cause analysis (RCA) and resolving issues within SLA timelines.',
        'Received 6 TCS awards including On the Spot Award, Star of the Month, and Applause Award for technical excellence.',
      ],
    },
    order: 0,
  },
  {
    section: 'experience',
    key: 'nhm',
    draftValue: {
      title: 'Software Developer',
      company: 'NHM Tech Solution Pvt Ltd',
      project: 'Data Integration & Analytics Engineering',
      location: 'India',
      startDate: 'Feb 2021',
      endDate: 'Jul 2023',
      current: false,
      bullets: [
        'Designed, built, and maintained ETL pipelines to automate data ingestion and transformation processes across multiple data sources.',
        'Integrated REST APIs to synchronize external business data with internal reporting systems, ensuring real-time data accuracy.',
        'Developed custom analytics reports and dashboards using Python, PostgreSQL, QWeb, and Excel, improving reporting speed by 40%.',
        'Automated recurring data tasks using cron jobs and dynamic workflow templates.',
        'Contributed to 15+ data-related features and system optimizations, improving system performance and user satisfaction by 30%.',
      ],
    },
    order: 1,
  },
  {
    section: 'experience',
    key: 'sathya',
    draftValue: {
      title: 'Software Developer',
      company: 'SathyaSaran Business Solutions Pvt Ltd',
      project: 'ERP Data Modules & Analytics',
      location: 'India',
      startDate: 'Oct 2018',
      endDate: 'Sep 2019',
      current: false,
      bullets: [
        'Built and optimized data modules for ERP systems focused on sales and inventory analytics.',
        'Developed SQL-based data extraction and transformation logic for analytics workflows using Python and SQL.',
        'Supported data validation, debugging, and performance tuning, improving overall system efficiency by 15%.',
        'Streamlined development and code review processes, improving team productivity by 15%.',
      ],
    },
    order: 2,
  },
  {
    section: 'projects',
    key: 'canada_etl',
    draftValue: {
      title: 'Canada ETL Pipeline',
      company: 'TCS — PayPal',
      period: 'Mar 2025 – Aug 2025',
      description: 'End-to-end ETL pipeline for transactional data extraction, fraud detection grouping, unique reference assignment, AES-encrypted PII protection, and scalable audit-compliant data loading.',
      tags: ['Python', 'BigQuery', 'AES Encryption', 'ETL', 'Fraud Detection'],
      featured: true,
    },
    order: 0,
  },
  {
    section: 'projects',
    key: 'movie_rec',
    draftValue: {
      title: 'Movie Recommendation System',
      company: 'Personal Project',
      period: 'Apr 2024 – May 2024',
      description: 'Personalized recommendation engine using collaborative + content-based filtering, SVD matrix factorization, RMSE/precision-recall evaluation, and Streamlit deployment.',
      tags: ['Python', 'Scikit-learn', 'SVD', 'Streamlit', 'Pandas'],
      featured: true,
    },
    order: 1,
  },
  {
    section: 'projects',
    key: 'hr_dashboard',
    draftValue: {
      title: 'HR Data Analysis Dashboard',
      company: 'Personal Project',
      period: 'Aug 2024',
      description: 'Python + Pandas solution to identify low-performing employees, generate workforce performance reports, and visualize insights using Matplotlib and Seaborn for HR decision-making.',
      tags: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Data Analysis'],
      featured: false,
    },
    order: 2,
  },
  {
    section: 'certifications',
    key: 'oci_foundations',
    draftValue: {
      title: 'Oracle Cloud Infrastructure 2025 Certified Foundations Associate',
      issuer: 'Oracle',
      date: 'Oct 2025',
      credentialUrl: '',
    },
    order: 0,
  },
  {
    section: 'certifications',
    key: 'oci_ai',
    draftValue: {
      title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
      issuer: 'Oracle',
      date: 'Oct 2025',
      credentialUrl: '',
    },
    order: 1,
  },
  {
    section: 'certifications',
    key: 'bigquery',
    draftValue: {
      title: 'Build a Data Warehouse with BigQuery',
      issuer: 'Google / Credly',
      date: 'Jan 2025',
      credentialUrl: '',
    },
    order: 2,
  },
  {
    section: 'certifications',
    key: 'bigquery_sql',
    draftValue: {
      title: 'Practical Google BigQuery for Those Who Already Know SQL',
      issuer: 'Udemy',
      date: 'Aug 2024',
      credentialUrl: '',
    },
    order: 3,
  },
  {
    section: 'certifications',
    key: 'python_dev',
    draftValue: {
      title: 'Complete Python Developer: Zero to Mastery',
      issuer: 'Udemy',
      date: 'Aug 2023',
      credentialUrl: '',
    },
    order: 4,
  },
  {
    section: 'education',
    key: 'be',
    draftValue: {
      degree: 'Bachelor of Engineering (B.E.)',
      field: 'Electrical & Electronics Engineering',
      institution: 'Velalar College of Engineering and Technology',
      location: 'Erode, Tamil Nadu',
      startYear: '2012',
      endYear: '2016',
    },
    order: 0,
  },
  {
    section: 'awards',
    key: 'tcs_awards',
    draftValue: {
      items: [
        { title: 'On the Spot Award', issuer: 'TCS', date: 'Aug 2025' },
        { title: 'Appreciation Award', issuer: 'TCS', date: 'Jan 2025' },
        { title: 'Star of the Month', issuer: 'TCS', date: 'Sep 2024' },
        { title: 'Applause Award', issuer: 'TCS', date: 'May 2024' },
        { title: 'Appreciation Award', issuer: 'TCS', date: 'Jun 2024' },
        { title: 'Appreciation Award', issuer: 'TCS', date: 'Sep 2023' },
      ],
    },
    order: 0,
  },
  {
    section: 'contact',
    key: 'main',
    draftValue: {
      heading: "Let's build something together",
      subtext: 'Open to Data Engineer, ETL Developer, and Cloud Data Engineering roles across India.',
      email: 'pradeepganesh111@gmail.com',
      phone: '+91 8807526370',
      linkedin: 'https://linkedin.com/in/pradeepganesamoorthy',
      github: 'https://github.com/pradeepganesh',
    },
    order: 0,
  },
]

async function main() {
  console.log('Seeding database...')

  const hashed = await bcrypt.hash('admin', 12)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashed, isDefault: true },
  })

  for (const item of portfolioData) {
    await prisma.portfolio.upsert({
      where: { section_key: { section: item.section, key: item.key } },
      update: {},
      create: {
        section: item.section,
        key: item.key,
        draftValue: item.draftValue,
        liveValue: item.draftValue,
        isDraft: false,
        order: item.order,
        visible: true,
        publishedAt: new Date(),
      },
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

// Also seed the resume file reference
async function seedResume() {
  await prisma.resumeFile.upsert({
    where: { id: 'seed-resume' },
    update: {},
    create: {
      id: 'seed-resume',
      filename: 'Pradeep_Ganesamoorthy_DataEngineer_6years.pdf',
      path: '/uploads/resume_pradeep.pdf',
      mimeType: 'application/pdf',
      isPublished: true,
    },
  })
}

seedResume().catch(console.error)
