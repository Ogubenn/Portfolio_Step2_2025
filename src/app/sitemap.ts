import { MetadataRoute } from 'next'

// Site base URL
const baseUrl = process.env.NEXTAUTH_URL || 'https://ogubenn.com.tr'

// Fetch published projects for dynamic sitemap
async function getPublishedProjects() {
  try {
    const response = await fetch(`${baseUrl}/api/public/projects`, {
      cache: 'no-store',
    })
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch projects for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic project slugs
  const projects = await getPublishedProjects()
  
  // Project URLs
  const projectUrls = projects.map((project: any) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt || project.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    // You can add more static pages here if needed
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.7,
    // },
  ]

  // Combine all URLs
  return [...staticPages, ...projectUrls]
}
