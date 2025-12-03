// Google Analytics 4 Helper Functions

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    })
  }
}

// Event tracking
interface GtagEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export const event = ({ action, category, label, value }: GtagEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Predefined event helpers
export const trackProjectView = (projectTitle: string, projectSlug: string) => {
  event({
    action: 'view_project',
    category: 'Projects',
    label: projectTitle,
  })
}

export const trackProjectClick = (projectTitle: string, linkType: 'demo' | 'github') => {
  event({
    action: 'click_project_link',
    category: 'Projects',
    label: `${projectTitle} - ${linkType}`,
  })
}

export const trackContactFormSubmit = (success: boolean) => {
  event({
    action: 'submit_contact_form',
    category: 'Contact',
    label: success ? 'success' : 'error',
  })
}

export const trackCVDownload = () => {
  event({
    action: 'download_cv',
    category: 'CV',
    label: 'CV Download',
  })
}

export const trackSkillClick = (skillName: string, category: string) => {
  event({
    action: 'click_skill',
    category: 'Skills',
    label: `${category} - ${skillName}`,
  })
}

export const trackServiceView = (serviceName: string) => {
  event({
    action: 'view_service',
    category: 'Services',
    label: serviceName,
  })
}

// Social media link tracking
export const trackSocialClick = (platform: string) => {
  event({
    action: 'click_social_link',
    category: 'Social Media',
    label: platform,
  })
}

// Navigation tracking
export const trackNavigation = (destination: string) => {
  event({
    action: 'navigate',
    category: 'Navigation',
    label: destination,
  })
}

// Type augmentation for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void
    dataLayer: any[]
  }
}
