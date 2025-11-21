'use client'

import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string
  order: number
  visible: boolean
}

interface ServicesProps {
  services: Service[] | null
}

export default function Services({ services }: ServicesProps) {
  const servicesData = services || []

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Code
    return Icon
  }

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
          <h2 className="heading-2 mb-4">Hizmetlerim</h2>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Sunduğum profesyonel hizmetler
          </p>
        </motion.div>

        {servicesData.length === 0 ? (
          <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-12">
            Henüz hizmet eklenmedi.
          </p>
        ) : (
          <>
            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesData.map((service, index) => {
                const Icon = getIcon(service.icon)
                const features = JSON.parse(service.features || '[]')
                
                return (
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
                      <Icon className="w-7 h-7 text-accent-electric" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-2 break-words">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4 break-words whitespace-normal">
                      {service.description}
                    </p>

                    {/* Features List */}
                    {features.length > 0 && (
                      <ul className="space-y-2">
                        {features.map((feature: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-accent-electric to-accent-purple mt-1.5 flex-shrink-0" />
                            <span className="break-words">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )
              })}
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
          </>
        )}
      </div>
    </section>
  )
}
