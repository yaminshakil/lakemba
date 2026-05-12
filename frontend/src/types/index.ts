export interface Doctor {
  id: number
  name: string
  slug: string
  image: string
  qualifications: string
  specialty: string
  experience_years: number
  biography: string
  languages: string[]
  available_days: string[]
  is_featured: boolean
  order: number
  social_links?: {
    linkedin?: string
    email?: string
  }
}

export interface Service {
  id: number
  title: string
  slug: string
  icon: string
  description: string
  full_description?: string
  image?: string
  is_featured: boolean
  order: number
}

export interface Testimonial {
  id: number
  patient_name: string
  patient_avatar?: string
  rating: number
  review: string
  service?: string
  date: string
  is_featured: boolean
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  author_avatar?: string
  category: string
  tags: string[]
  published_at: string
  is_published: boolean
}

export interface Faq {
  id: number
  question: string
  answer: string
  category: string
  order: number
}

export interface GalleryImage {
  id: number
  title: string
  image: string
  category: string
  order: number
}

export interface Setting {
  key: string
  value: string
}

export interface ContactDetails {
  phone: string
  phone_secondary?: string
  email: string
  email_secondary?: string
  address: string
  suburb: string
  state: string
  postcode: string
  opening_hours: OpeningHours[]
  google_maps_url?: string
  lat?: string
  lng?: string
}

export interface OpeningHours {
  day: string
  open: string
  close: string
  is_closed: boolean
}

export interface HeroContent {
  title: string
  subtitle: string
  description: string
  image: string
  cta_primary_text: string
  cta_secondary_text: string
}

export interface HomepageSection {
  key: string
  title: string
  subtitle?: string
  content?: string
  is_active: boolean
  metadata?: Record<string, unknown>
}

export interface SeoMeta {
  title: string
  description: string
  keywords: string
  og_image?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager'
  created_at?: string
}

export interface Stat {
  label: string
  value: number
  suffix?: string
  icon?: string
}
