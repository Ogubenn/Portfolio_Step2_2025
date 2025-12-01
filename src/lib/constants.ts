/**
 * Form Field Character Limits
 * These match the database schema constraints
 */

export const CHAR_LIMITS = {
  // Common fields
  TITLE: 191,
  SLUG: 191,
  NAME: 191,
  EMAIL: 191,
  
  // Short text
  ICON: 50,
  PHONE: 50,
  CATEGORY: 50,
  TYPE: 50,
  CTA: 100,
  DURATION: 100,
  
  // Medium text
  SUBTITLE: 500,
  SHORT_DESC: 500,
  META_DESC: 500,
  URL: 500,
  
  // Long text (still has soft limit for UX)
  DESCRIPTION: 5000,
  BIO: 5000,
  CONTENT: 10000,
  
  // No limit (TEXT fields)
  UNLIMITED: undefined
} as const

/**
 * Helper to get appropriate rows for textarea based on limit
 */
export const getTextAreaRows = (limit?: number): number => {
  if (!limit) return 10 // Unlimited
  if (limit <= 200) return 3
  if (limit <= 500) return 5
  if (limit <= 1000) return 8
  return 12
}
