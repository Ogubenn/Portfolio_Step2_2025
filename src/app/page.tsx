import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Services from '@/components/sections/Services'
import Contact from '@/components/sections/Contact'

// Server Component - Her istekte fresh data
export const revalidate = 0 // Her zaman yeniden fetch et

async function getSettings() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://ogubenn.com.tr'
  const res = await fetch(`${baseUrl}/api/public/settings`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return null
  return res.json()
}

async function getSkills() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://ogubenn.com.tr'
  const res = await fetch(`${baseUrl}/api/public/skills`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return []
  return res.json()
}

async function getExperience() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://ogubenn.com.tr'
  const res = await fetch(`${baseUrl}/api/public/experience`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return []
  return res.json()
}

async function getServices() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://ogubenn.com.tr'
  const res = await fetch(`${baseUrl}/api/public/services`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  if (!res.ok) return []
  return res.json()
}

async function getProjects() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://ogubenn.com.tr'
  const res = await fetch(`${baseUrl}/api/public/projects?featured=true`, {
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
      <Hero settings={settings as any} />
      <About settings={settings as any} skills={skills as any} experience={experience as any} />
      <Projects projects={projects as any} />
      <Services services={services as any} />
      <Contact settings={settings as any} />
    </>
  )
}
