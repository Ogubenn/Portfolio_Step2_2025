'use client'

import { motion } from 'framer-motion'
import { Code, Palette, Gamepad2, Wrench } from 'lucide-react'

const services = [
  {
    id: '1',
    icon: Code,
    title: 'Web Geliştirme',
    description: 'Modern teknolojilerle web uygulamaları geliştiriyorum',
    features: [
      'React & Next.js ile full-stack projeler',
      'Responsive ve kullanıcı dostu arayüzler',
      'API entegrasyonları ve database yönetimi',
      'Modern CSS ve animasyonlar',
    ],
  },
  {
    id: '2',
    icon: Palette,
    title: 'UI/UX Tasarım',
    description: 'Estetik ve işlevsel kullanıcı arayüzleri tasarlıyorum',
    features: [
      'Figma ile tasarım ve prototipleme',
      'Modern ve minimal tasarım anlayışı',
      'Renk teorisi ve tipografi uygulamaları',
      'Kullanıcı deneyimi odaklı yaklaşım',
    ],
  },
  {
    id: '3',
    icon: Gamepad2,
    title: 'Oyun Geliştirme',
    description: 'Eğlenceli oyunlar ve interaktif deneyimler yaratıyorum',
    features: [
      'Unity ile 2D/3D oyun geliştirme',
      'Oyun mekaniği tasarımı ve kodlama',
      'Pixel art ve sprite animasyonları',
      'Cross-platform oyun çözümleri',
    ],
  },
  {
    id: '4',
    icon: Wrench,
    title: 'Problem Çözme',
    description: 'Kod optimizasyonu ve performans iyileştirmeleri',
    features: [
      'Clean code prensipleri',
      'Performance optimizasyonu',
      'Bug fixing ve debugging',
      'Kod kalitesi ve maintainability',
    ],
  },
]

export default function Services() {
  return (
    <section id="services" className="section-padding bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Yeteneklerim</h2>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Odaklandığım alanlar ve teknolojiler
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:border-accent-electric dark:hover:border-accent-purple transition-colors"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-electric/20 via-accent-purple/20 to-accent-pink/20 flex items-center justify-center mb-4">
                <service.icon className="w-7 h-7 text-accent-electric" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-accent-electric to-accent-purple mt-1.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            Benimle çalışmak veya bir proje hakkında konuşmak ister misin?
          </p>
          <a href="/#contact" className="btn-primary">
            Benimle İletişime Geç
          </a>
        </motion.div>
      </div>
    </section>
  )
}
