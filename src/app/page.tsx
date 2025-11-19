import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Services from '@/components/sections/Services'
import Contact from '@/components/sections/Contact'

// Server Component - Her istekte fresh data
export const revalidate = 0 // Her zaman yeniden fetch et

async function getSettings() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/public/settings`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return null
  return res.json()
}

async function getSkills() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/public/skills`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return []
  return res.json()
}

async function getExperience() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/public/experience`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return []
  return res.json()
}

async function getServices() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/public/services`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return []
  return res.json()
}

async function getProjects() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/public/projects?featured=true`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return []
  return res.json()
}

export default async function HomePage() {
  // Server-side data fetch (paralel)
  const [settings, skills, experience, services, projects] = await Promise.all([
    getSettings(),
    getSkills(),
    getExperience(),
    getServices(),
    getProjects()
  ])

  return (
    <>
      <Hero settings={settings} />
      <About settings={settings} skills={skills} experience={experience} />
      <Projects projects={projects} />
      <Services services={services} />
      <Contact settings={settings} />
    </>
  )
}
