import axios from 'axios'
import type { Doctor, Service, Testimonial, BlogPost, Faq, GalleryImage, HomepageSection, ContactDetails, SeoMeta, ApiResponse } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

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

// Public endpoints
export const getDoctors = () => api.get<ApiResponse<Doctor[]>>('/doctors')
export const getDoctor = (id: number | string) => api.get<ApiResponse<Doctor>>(`/doctors/${id}`)
export const getFeaturedDoctors = () => api.get<ApiResponse<Doctor[]>>('/doctors?featured=1&limit=4')

export const getServices = () => api.get<ApiResponse<Service[]>>('/services')
export const getService = (slug: string) => api.get<ApiResponse<Service>>(`/services/${slug}`)
export const getFeaturedServices = () => api.get<ApiResponse<Service[]>>('/services?featured=1&limit=6')

export const getTestimonials = () => api.get<ApiResponse<Testimonial[]>>('/testimonials')

export const getBlogPosts = (page = 1) => api.get<ApiResponse<BlogPost[]>>(`/blog?page=${page}`)
export const getBlogPost = (slug: string) => api.get<ApiResponse<BlogPost>>(`/blog/${slug}`)
export const getRecentBlogPosts = () => api.get<ApiResponse<BlogPost[]>>('/blog?limit=3')

export const getFaqs = (category?: string) => api.get<ApiResponse<Faq[]>>(`/faqs${category ? `?category=${category}` : ''}`)

export const getGallery = () => api.get<ApiResponse<GalleryImage[]>>('/gallery')

export const getHomepageSections = () => api.get<ApiResponse<HomepageSection[]>>('/homepage')
export const getHomepageSection = (key: string) => api.get<ApiResponse<HomepageSection>>(`/homepage/${key}`)

export const getContactDetails = () => api.get<ApiResponse<ContactDetails>>('/contact')

export const getSetting = (key: string) => api.get<ApiResponse<{ value: string }>>(`/settings/${key}`)
export const getSettings = () => api.get<ApiResponse<Record<string, string>>>('/settings')

export const getSeoMeta = (page: string) => api.get<ApiResponse<SeoMeta>>(`/seo/${page}`)

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
export const adminUpdateHomepageSection = (key: string, data: object) => api.put(`/admin/homepage/${key}`, data)
export const adminUploadHomepageImage = (key: string, data: FormData) =>
  api.post(`/admin/homepage/${key}/image`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateContactDetails = (data: object) => api.put('/admin/contact', data)
export const adminUpdateSeoMeta = (page: string, data: object) => api.put(`/admin/seo/${page}`, data)

export const getFeesSettings = () => api.get('/fees')
export const adminUpdateFeesSettings = (data: object) => api.put('/admin/fees', data)

export default api
