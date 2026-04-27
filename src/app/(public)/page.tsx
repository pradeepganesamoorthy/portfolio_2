import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { Certifications } from '@/components/sections/Certifications'
import { Awards } from '@/components/sections/Awards'
import { Education } from '@/components/sections/Education'
import { GitHub } from '@/components/sections/GitHub'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Awards />
      <Education />
      <GitHub />
      <Contact />
      <Footer />
    </main>
  )
}
