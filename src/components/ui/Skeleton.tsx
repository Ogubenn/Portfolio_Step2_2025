'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

/**
 * Basic Skeleton Loader Component
 * Animasyonlu placeholder için kullanılır
 */
export function Skeleton({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  animation = 'wave',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-700 relative overflow-hidden'
  
  const variantClasses = {
    text: 'h-4',
    rectangular: '',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  }

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    >
      {animation === 'wave' && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
      )}
    </div>
  )
}

/**
 * Project Card Skeleton
 */
export function ProjectCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
    >
      {/* Thumbnail */}
      <Skeleton variant="rectangular" height="200px" className="rounded-none" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton variant="rounded" height="24px" width="80%" />
        
        {/* Category & Year */}
        <Skeleton variant="rounded" height="16px" width="40%" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton variant="rounded" height="16px" width="100%" />
          <Skeleton variant="rounded" height="16px" width="90%" />
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton variant="rounded" height="36px" width="100px" />
          <Skeleton variant="rounded" height="36px" width="100px" />
          <Skeleton variant="rounded" height="36px" width="40px" className="ml-auto" />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Skill Card Skeleton
 */
export function SkillCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-4"
    >
      {/* Name & Category */}
      <div className="space-y-2">
        <Skeleton variant="rounded" height="20px" width="70%" />
        <Skeleton variant="rounded" height="16px" width="40%" />
      </div>
      
      {/* Level Bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton variant="rounded" height="12px" width="30px" />
          <Skeleton variant="rounded" height="12px" width="40px" />
        </div>
        <Skeleton variant="rounded" height="8px" width="100%" />
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        <Skeleton variant="rounded" height="36px" className="flex-1" />
        <Skeleton variant="rounded" height="36px" width="40px" />
        <Skeleton variant="rounded" height="36px" width="40px" />
      </div>
    </motion.div>
  )
}

/**
 * Service Card Skeleton
 */
export function ServiceCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4"
    >
      {/* Icon & Title */}
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width="48px" height="48px" />
        <Skeleton variant="rounded" height="24px" width="60%" />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton variant="rounded" height="16px" width="100%" />
        <Skeleton variant="rounded" height="16px" width="95%" />
        <Skeleton variant="rounded" height="16px" width="80%" />
      </div>
      
      {/* Features */}
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height="16px" width={`${90 - i * 10}%`} />
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <Skeleton variant="rounded" height="12px" width="60px" />
        <div className="flex gap-2">
          <Skeleton variant="rounded" height="36px" width="36px" />
          <Skeleton variant="rounded" height="36px" width="36px" />
          <Skeleton variant="rounded" height="36px" width="36px" />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Experience Card Skeleton
 */
export function ExperienceCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 border border-gray-700 rounded-xl p-6"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Position & Company */}
          <div className="space-y-1">
            <Skeleton variant="rounded" height="24px" width="70%" />
            <Skeleton variant="rounded" height="18px" width="50%" />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Skeleton variant="rounded" height="16px" width="100%" />
            <Skeleton variant="rounded" height="16px" width="90%" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Skeleton variant="rounded" height="36px" width="36px" />
          <Skeleton variant="rounded" height="36px" width="36px" />
          <Skeleton variant="rounded" height="36px" width="36px" />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Dashboard Stats Skeleton
 */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="circular" width="48px" height="48px" />
            <Skeleton variant="rounded" height="24px" width="60px" />
          </div>
          <Skeleton variant="rounded" height="16px" width="80%" />
        </motion.div>
      ))}
    </div>
  )
}

/**
 * List Skeleton (Generic)
 */
export function ListSkeleton({ count = 3, children }: { count?: number; children?: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {children || <Skeleton variant="rounded" height="80px" />}
        </div>
      ))}
    </div>
  )
}

/**
 * Table Row Skeleton
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height="20px" className="flex-1" />
      ))}
    </div>
  )
}
