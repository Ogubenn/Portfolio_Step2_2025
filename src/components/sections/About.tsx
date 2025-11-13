'use client'

import { motion } from 'framer-motion'
import { Download, Code, Palette, Gamepad2, Database, FileText } from 'lucide-react'

const skills = [
  {
    category: 'Front-End',
    icon: Code,
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3'],
  },
  {
    category: 'UI/UX Design',
    icon: Palette,
    items: ['Figma', 'Adobe XD', 'Responsive Design', 'User Research', 'Prototyping'],
  },
  {
    category: 'Game Development',
    icon: Gamepad2,
    items: ['Unity', 'C#', 'Game Design', 'Pixel Art', 'Aseprite'],
  },
  {
    category: 'Back-End & Tools',
    icon: Database,
    items: ['Node.js', 'Python', 'REST APIs', 'Git', 'PostgreSQL'],
  },
]

const skillLevels = [
  { name: 'React & Next.js', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Unity & C#', level: 80 },
  { name: 'UI/UX Design', level: 75 },
  { name: 'Node.js', level: 70 },
  { name: 'Python', level: 65 },
]

const workExperience = [
  {
    company: 'Şirket Adı 1',
    position: 'Full-Stack Developer',
    period: '2023 - Günümüz',
    description: 'Web uygulamaları geliştirme ve takım liderliği',
  },
  {
    company: 'Şirket Adı 2',
    position: 'Frontend Developer',
    period: '2021 - 2023',
    description: 'React ve Next.js ile modern web projeleri',
  },
  {
    company: 'Freelance',
    position: 'Bağımsız Çalışan',
    period: '2020 - 2021',
    description: 'Çeşitli web ve oyun geliştirme projeleri',
  },
]

export default function About() {
  return (
    <section id="about" className="section-padding bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Hakkımda</h2>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Tutkuyla kod yazan, detaylara önem veren bir geliştirici
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-light-text-primary dark:text-dark-text-primary leading-relaxed mb-4">
                Merhaba! Ben Oğulcan, yazılım geliştirme tutkusuyla kod yazan bir
                yazılımcıyım. Web uygulamaları ve oyun geliştirme alanında kendimi
                sürekli geliştiriyor, yeni teknolojiler öğrenmeyi seviyorum.
              </p>
              <p className="text-light-text-primary dark:text-dark-text-primary leading-relaxed mb-4">
                Her projede kaliteli ve kullanıcı dostu çözümler üretmeye odaklanıyorum.
                Temiz kod yazmaya, performans optimizasyonuna ve kullanıcı deneyimine
                önem veriyorum. Öğrenmeye açık, detaylara özen gösteren ve problem
                çözme odaklı bir yaklaşımım var.
              </p>
              <p className="text-light-text-primary dark:text-dark-text-primary leading-relaxed mb-6">
                Yeni projeler ve iş birlikleri için her zaman heyecanlıyım. İyi bir
                fikir ve motivasyonla harika şeyler yaratabileceğimize inanıyorum.
                Benimle çalışmak isterseniz, iletişime geçmekten çekinmeyin!
              </p>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="/cv.pdf"
                download
                className="btn-primary inline-flex group"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                CV İndir
              </a>
              <a
                href="/personality-test.pdf"
                download
                className="btn-secondary inline-flex group"
              >
                <FileText className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                Personality Test İndir
              </a>
            </div>
          </motion.div>

          {/* Right Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {skills.map((skillGroup, index) => (
                <motion.div
                  key={skillGroup.category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-electric/20 via-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
                      <skillGroup.icon className="w-5 h-5 text-accent-electric" />
                    </div>
                    <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {skillGroup.category}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {skillGroup.items.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-accent-electric to-accent-purple" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 p-6 bg-gradient-to-br from-accent-electric/5 via-accent-purple/5 to-accent-pink/5 rounded-xl border border-light-border dark:border-dark-border transition-all duration-300 hover:scale-105 hover:border-accent-electric/50 dark:hover:border-accent-purple/50 hover:shadow-xl"
            >
              <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                Çalışma Yaklaşımım
              </h4>
              <ul className="space-y-2 text-sm text-light-text-primary dark:text-dark-text-primary">
                <li className="flex items-start gap-2">
                  <span className="text-accent-electric mt-1">✓</span>
                  <span>Agile/Scrum metodolojisi ile çalışma</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-purple mt-1">✓</span>
                  <span>Test-driven development (TDD) yaklaşımı</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-pink mt-1">✓</span>
                  <span>Sürekli öğrenme ve kendini geliştirme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-electric mt-1">✓</span>
                  <span>Clean code ve best practices'e önem</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Skill Levels Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8 text-center">
            Yetenek Seviyeleri
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {skillLevels.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-2 p-4 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary transition-all duration-300 hover:scale-105 hover:border-accent-electric/50 dark:hover:border-accent-purple/50 hover:shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {skill.name}
                  </span>
                  <span className="text-sm font-semibold text-gradient">
                    {skill.level}%
                  </span>
                </div>
                <div className="h-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-accent-electric via-accent-purple to-accent-pink rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Work Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8 text-center">
            Çalıştığım Yerler
          </h3>
          <div className="max-w-3xl mx-auto space-y-6">
            {workExperience.map((work, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-1">
                    {work.position}
                  </h4>
                  <p className="text-accent-electric dark:text-accent-purple font-medium mb-2">
                    {work.company}
                  </p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {work.description}
                  </p>
                </div>
                <div className="md:text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-accent-electric/20 via-accent-purple/20 to-accent-pink/20 text-light-text-primary dark:text-dark-text-primary border border-accent-electric/30 dark:border-accent-purple/30">
                    {work.period}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
