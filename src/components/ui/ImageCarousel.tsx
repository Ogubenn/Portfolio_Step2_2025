'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, Keyboard, Autoplay, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ZoomIn, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

interface ImageData {
  id: string
  url: string
  alt: string | null
}

interface ImageCarouselProps {
  images: ImageData[]
  projectTitle: string
}

export default function ImageCarousel({ images, projectTitle }: ImageCarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  if (images.length === 0) return null

  return (
    <>
      {/* Main Carousel */}
      <div className="space-y-4">
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Keyboard, Autoplay]}
          spaceBetween={10}
          navigation
          pagination={{ 
            clickable: true,
            dynamicBullets: true 
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          keyboard={{
            enabled: true,
            onlyInViewport: true
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={images.length > 1}
          className="rounded-xl overflow-hidden bg-gray-900"
          style={{ 
            '--swiper-navigation-color': '#14B8A6',
            '--swiper-pagination-color': '#14B8A6',
          } as any}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id}>
              <div 
                className="relative aspect-video cursor-zoom-in group"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${projectTitle} - Görsel ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority={index === 0}
                />
                {/* Zoom overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Thumbs, FreeMode]}
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            className="thumbs-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide 
                key={image.id} 
                className="!w-24 h-16 cursor-pointer rounded-lg overflow-hidden"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Kapat"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Lightbox Carousel */}
            <div 
              className="w-full max-w-7xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Swiper
                modules={[Navigation, Keyboard]}
                initialSlide={lightboxIndex}
                navigation
                keyboard={{
                  enabled: true
                }}
                onSlideChange={(swiper) => setLightboxIndex(swiper.activeIndex)}
                loop={images.length > 1}
                className="lightbox-swiper"
                style={{ 
                  '--swiper-navigation-color': '#fff',
                  '--swiper-navigation-size': '44px',
                } as any}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={image.id}>
                    <div className="relative w-full h-[80vh] flex items-center justify-center">
                      <Image
                        src={image.url}
                        alt={image.alt || `${projectTitle} - Görsel ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority={index === lightboxIndex}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Image Title */}
              {images[lightboxIndex].alt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-4 text-white/80"
                >
                  {images[lightboxIndex].alt}
                </motion.div>
              )}
            </div>

            {/* ESC hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              ESC tuşu veya dışarıya tıklayarak kapatabilirsiniz
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(4px);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }

        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
        }

        .swiper-pagination-bullet-active {
          background: var(--swiper-pagination-color);
        }

        .thumbs-swiper .swiper-slide {
          opacity: 0.4;
          transition: opacity 0.3s;
          border: 2px solid transparent;
        }

        .thumbs-swiper .swiper-slide-thumb-active {
          opacity: 1;
          border-color: #14B8A6;
        }

        .lightbox-swiper .swiper-button-next,
        .lightbox-swiper .swiper-button-prev {
          background-color: rgba(0, 0, 0, 0.5);
        }

        .lightbox-swiper .swiper-button-next:hover,
        .lightbox-swiper .swiper-button-prev:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </>
  )
}
