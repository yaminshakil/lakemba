import axios from 'axios'
import type { Doctor, Service, Testimonial, BlogPost, Faq, GalleryImage, HomepageSection, ContactDetails, SeoMeta, ApiResponse } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Simple in-memory cache for GET requests (15 min TTL)
const cache = new Map<string, { data: any; ts: number }>()
const TTL = 15 * 60 * 1000

async function cachedGet<T>(url: string): Promise<T> {
  const hit = cache.get(url)
  if (hit && Date.now() - hit.ts < TTL) return hit.data as T
  const res = await api.get<T>(url)
  cache.set(url, { data: res, ts: Date.now() })
  return res as T
}

export function bustCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key)
  }
}

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// Public endpoints (cached)
export const getDoctors = () => cachedGet<ApiResponse<Doctor[]>>('/doctors')
export const getDoctor = (id: number | string) => cachedGet<ApiResponse<Doctor>>(`/doctors/${id}`)
export const getFeaturedDoctors = () => cachedGet<ApiResponse<Doctor[]>>('/doctors?featured=1&limit=4')

export const getServices = () => cachedGet<ApiResponse<Service[]>>('/services')
export const getService = (slug: string) => cachedGet<ApiResponse<Service>>(`/services/${slug}`)
export const getFeaturedServices = () => cachedGet<ApiResponse<Service[]>>('/services?featured=1&limit=6')

export const getTestimonials = () => cachedGet<ApiResponse<Testimonial[]>>('/testimonials')

export const getBlogPosts = (page = 1) => cachedGet<ApiResponse<BlogPost[]>>(`/blog?page=${page}`)
export const getBlogPost = (slug: string) => cachedGet<ApiResponse<BlogPost>>(`/blog/${slug}`)
export const getRecentBlogPosts = () => cachedGet<ApiResponse<BlogPost[]>>('/blog?limit=3')

export const getFaqs = (category?: string) => cachedGet<ApiResponse<Faq[]>>(`/faqs${category ? `?category=${category}` : ''}`)

export const getGallery = () => cachedGet<ApiResponse<GalleryImage[]>>('/gallery')

export const getHomepageSections = () => cachedGet<ApiResponse<HomepageSection[]>>('/homepage')
export const getHomepageSection = (key: string) => cachedGet<ApiResponse<HomepageSection>>(`/homepage/${key}`)

export const getContactDetails = () => cachedGet<ApiResponse<ContactDetails>>('/contact')

export const getSetting = (key: string) => cachedGet<ApiResponse<{ value: string }>>(`/settings/${key}`)
export const getSettings = () => cachedGet<ApiResponse<Record<string, string>>>('/settings')

export const getSeoMeta = (page: string) => cachedGet<ApiResponse<SeoMeta>>(`/seo/${page}`)

export const submitContactForm = (data: {
  name: string; email: string; phone?: string; message: string; subject?: string
}) => api.post('/contact/submit', data)

export const subscribeNewsletter = (email: string) => api.post('/newsletter/subscribe', { email })

// Admin endpoints
export const adminLogin = (email: string, password: string) =>
  api.post('/admin/login', { email, password })

export const adminRegister = (name: string, email: string, password: string, password_confirmation: string) =>
  api.post('/admin/register', { name, email, password, password_confirmation })

export const adminLogout = () => api.post('/admin/logout')

export const adminForgotPassword = (email: string) =>
  api.post('/admin/password/forgot', { email })

export const adminResetPassword = (data: { email: string; token: string; password: string; password_confirmation: string }) =>
  api.post('/admin/password/reset', data)

export const adminUpdateProfile = (data: { name?: string; email?: string; current_password?: string }) =>
  api.put('/admin/profile', data)

export const adminChangePassword = (data: { current_password: string; password: string; password_confirmation: string }) =>
  api.put('/admin/profile/password', data)

export const adminGetDashboard = () => api.get('/admin/dashboard')

export const adminCreateDoctor = (data: FormData) =>
  api.post('/admin/doctors', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateDoctor = (id: number, data: FormData) =>
  api.post(`/admin/doctors/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteDoctor = (id: number) => api.delete(`/admin/doctors/${id}`)

export const adminCreateService = (data: FormData) =>
  api.post('/admin/services', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateService = (id: number, data: FormData) =>
  api.post(`/admin/services/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteService = (id: number) => api.delete(`/admin/services/${id}`)

export const getBlogPostById = (id: number) => api.get<ApiResponse<BlogPost>>(`/blog/${id}`)

export const adminCreateBlogPost = (data: FormData) =>
  api.post('/admin/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateBlogPost = (id: number, data: FormData) =>
  api.post(`/admin/blog/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteBlogPost = (id: number) => api.delete(`/admin/blog/${id}`)

export const adminCreateTestimonial = (data: object) => api.post('/admin/testimonials', data)
export const adminUpdateTestimonial = (id: number, data: object) => api.put(`/admin/testimonials/${id}`, data)
export const adminDeleteTestimonial = (id: number) => api.delete(`/admin/testimonials/${id}`)

export const adminCreateFaq = (data: object) => api.post('/admin/faqs', data)
export const adminUpdateFaq = (id: number, data: object) => api.put(`/admin/faqs/${id}`, data)
export const adminDeleteFaq = (id: number) => api.delete(`/admin/faqs/${id}`)

export const adminUploadGalleryImage = (data: FormData) =>
  api.post('/admin/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteGalleryImage = (id: number) => api.delete(`/admin/gallery/${id}`)

export const adminUpdateSettings = (data: Record<string, string>) => api.put('/admin/settings', data)

export const adminSendTestEmail  = () => api.post('/admin/settings/test-email')
export const adminGetMessages    = (page = 1, filter?: 'unread') =>
  api.get(`/admin/messages?page=${page}${filter ? `&filter=${filter}` : ''}`)
export const adminGetMessage     = (id: number) => api.get(`/admin/messages/${id}`)
export const adminMarkMessageRead = (id: number) => api.patch(`/admin/messages/${id}/read`)
export const adminReplyMessage   = (id: number, body: string) => api.post(`/admin/messages/${id}/reply`, { body })
export const adminDeleteMessage  = (id: number) => api.delete(`/admin/messages/${id}`)
export const adminGetUnreadCount = () => api.get('/admin/messages/unread-count')
export const adminUploadLogo = (data: FormData) =>
  api.post('/admin/settings/logo', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateHomepageSection = (key: string, data: object) => api.put(`/admin/homepage/${key}`, data)
export const adminUploadHomepageImage = (key: string, data: FormData) =>
  api.post(`/admin/homepage/${key}/image`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateContactDetails = (data: object) => api.put('/admin/contact', data)
export const adminUpdateSeoMeta = (page: string, data: object) => api.put(`/admin/seo/${page}`, data)

export const getFeesSettings = () => api.get('/fees')
export const adminUpdateFeesSettings = (data: object) => api.put('/admin/fees', data)

export const adminGetUsers = () => api.get('/admin/users')
export const adminCreateUser = (data: { name: string; email: string; password: string; password_confirmation: string; role: 'admin' | 'manager' }) =>
  api.post('/admin/users', data)
export const adminDeleteUser = (id: number) => api.delete(`/admin/users/${id}`)

export default api
