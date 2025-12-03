import Script from 'next/script'

interface PersonSchemaProps {
  name: string
  url: string
  image?: string
  jobTitle: string
  description: string
  email?: string
  sameAs?: string[] // Social media profiles
}

export function PersonSchema({
  name,
  url,
  image,
  jobTitle,
  description,
  email,
  sameAs = [],
}: PersonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    image,
    jobTitle,
    description,
    email,
    sameAs,
    alumniOf: {
      '@type': 'Organization',
      name: 'University', // TODO: Üniversite adınızı ekleyin
    },
    knowsAbout: [
      'Web Development',
      'Game Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Unity',
      'Full-Stack Development',
    ],
  }

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface CreativeWorkSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  dateCreated?: string
  author: {
    name: string
    url: string
  }
  keywords?: string[]
  programmingLanguage?: string[]
}

export function CreativeWorkSchema({
  name,
  description,
  url,
  image,
  dateCreated,
  author,
  keywords = [],
  programmingLanguage = [],
}: CreativeWorkSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    image,
    dateCreated,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    keywords: keywords.join(', '),
    programmingLanguage,
  }

  return (
    <Script
      id="creative-work-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  name: string
  url: string
  description: string
  author: {
    name: string
    url: string
  }
}

export function WebsiteSchema({
  name,
  url,
  description,
  author,
}: WebsiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/projects?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface OrganizationSchemaProps {
  name: string
  url: string
  logo?: string
  description: string
  founder: {
    name: string
    url: string
  }
  sameAs?: string[]
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  founder,
  sameAs = [],
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    founder: {
      '@type': 'Person',
      name: founder.name,
      url: founder.url,
    },
    sameAs,
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
