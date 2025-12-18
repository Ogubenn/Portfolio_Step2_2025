'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Award, CheckCircle, GraduationCap } from 'lucide-react'
import type { Education } from '@/types'

interface EducationProps {
  educations: Education[]
}

export default function Education({ educations }: EducationProps) {
  if (!educations || educations.length === 0) {
    return null
  }

  const formatDate = (date: string | Date | null) => {
    if (!date) return null
    const d = new Date(date)
    return d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section id="education" className="section-padding bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            Eğitim Geçmişi
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Eğitim Hayatım
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Akademik geçmişim ve aldığım eğitimler
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>

          {/* Education Items */}
          <div className="space-y-12">
            {educations.map((edu, index) => {
              const isEven = index % 2 === 0
              const achievements = 
                typeof edu.achievements === 'string'
                  ? JSON.parse(edu.achievements || '[]')
                  : edu.achievements || []

              return (
                <motion.div
                  key={edu.id}
                  variants={itemVariants}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full ring-4 ring-white shadow-lg"></div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ${isEven ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className={`flex-1 ${isEven ? 'md:order-2' : ''}`}>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {edu.school}
                          </h3>
                          <div className="flex flex-col gap-1">
                            <p className="text-lg font-semibold text-blue-600">
                              {edu.degree}
                            </p>
                            <p className="text-gray-700">
                              {edu.field}
                            </p>
                          </div>
                        </div>

                        {edu.gpa && (
                          <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full ${isEven ? 'md:order-1' : ''}`}>
                            <Award className="w-5 h-5 text-amber-600" />
                            <span className="text-sm font-bold text-amber-700">
                              {edu.gpa}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Date & Location */}
                      <div className={`flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500 ${isEven ? 'md:justify-end' : ''}`}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(edu.startDate)} -{' '}
                            {edu.current ? (
                              <span className="text-green-600 font-medium">Devam Ediyor</span>
                            ) : (
                              formatDate(edu.endDate || null)
                            )}
                          </span>
                        </div>

                        {edu.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {edu.description && (
                        <div 
                          className={`prose prose-sm max-w-none text-gray-600 mb-4 ${isEven ? 'md:prose-right' : ''}`}
                          dangerouslySetInnerHTML={{ __html: edu.description }}
                        />
                      )}

                      {/* Achievements */}
                      {achievements.length > 0 && (
                        <div className={`mt-4 ${isEven ? 'md:flex md:flex-col md:items-end' : ''}`}>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Başarılar & Ödüller
                          </h4>
                          <ul className={`space-y-1 ${isEven ? 'md:text-right' : ''}`}>
                            {achievements.map((achievement: string, idx: number) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-600 flex items-start gap-2"
                              >
                                <span className="text-green-500 mt-1">•</span>
                                <span className="flex-1">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Empty space for alignment on the other side */}
                  <div className="hidden md:block flex-1"></div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
