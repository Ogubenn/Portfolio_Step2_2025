import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Services from '@/components/sections/Services'
import Contact from '@/components/sections/Contact'

// Her 10 saniyede bir sayfayı yeniden oluştur
export const revalidate = 10

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Services />
      <Contact />
    </>
  )
}
