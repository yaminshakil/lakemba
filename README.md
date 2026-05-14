# Lakemba General Medical Practice — Website

A premium, modern medical clinic website for **Lakemba General Medical Practice** built with Next.js 14, Tailwind CSS, Framer Motion, and a Laravel API backend.

---

## Project Structure

```
E:\Lakemba\
├── frontend/          ← Next.js 14 (App Router) + Tailwind + Framer Motion
└── backend_fresh/     ← Laravel 11 REST API + MySQL + Sanctum Auth
```

---

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

The frontend runs at **http://localhost:3000**

### Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-google-maps-api-key
```

---

## Backend Setup

### Prerequisites
- PHP 8.2+
- Composer
- MySQL 8.0+
- Laravel 11

### Installation

```bash
cd backend_fresh
composer install
cp .env.example .env
php artisan key:generate

# Configure database in .env:
# DB_DATABASE=lakemba_medical
# DB_USERNAME=your_db_user
# DB_PASSWORD=your_db_password

# Run migrations and seed
php artisan migrate --seed

# Create storage symlink
php artisan storage:link

# Install Sanctum
php artisan install:api

# Start development server
php artisan serve
```

The API runs at **http://localhost:8000**

### MySQL Schema

Create the database first:
```sql
CREATE DATABASE lakemba_medical CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

All tables are created by the migrations in `database/migrations/`:
- `doctors`
- `services`
- `testimonials`
- `blog_posts`
- `faqs`
- `galleries`
- `settings`
- `users` (admin auth)

---

## Admin Panel

Access: **http://localhost:3000/admin**

**Default credentials (after seeding):**
- Email: `admin@lakembagmp.com.au`
- Password: `admin123`

**Change the admin password immediately in production.**

### Admin Features
- Dashboard with content counts
- **Doctors** — Add, edit, delete, upload photos, set availability
- **Services** — Manage all clinic services
- **Blog** — Create and publish health articles
- **Testimonials** — Add and feature patient reviews
- **FAQs** — Manage frequently asked questions
- **Gallery** — Upload and organise clinic photos
- **Settings** — Configure contact details, hours, SEO, booking integration, email notifications

---

## HealthEngine Booking Integration

Booking is powered by [HealthEngine](https://healthengine.com.au) — Australia's most widely used medical booking platform.

### Setup (no code changes required)

1. Log in to your HealthEngine Provider account and copy your practice booking URL
   - Format: `https://healthengine.com.au/book-appointment/your-practice-slug`
2. Go to **Admin → Settings → Booking Integration**
3. Paste the URL into the **HealthEngine Booking URL** field and save

All "Book Appointment" buttons across the site (Hero, Header, Booking page) will immediately use the saved URL. The URL is cached in `localStorage` for instant subsequent loads, with the admin-saved value always taking precedence.

---

## Pages

### Public Site
| Page             | Route              |
|------------------|--------------------|
| Home             | `/`                |
| About            | `/about`           |
| Doctors          | `/doctors`         |
| Doctor Detail    | `/doctors/[id]`    |
| Services         | `/services`        |
| Book Appointment | `/booking`         |
| Blog             | `/blog`            |
| Blog Post        | `/blog/[slug]`     |
| FAQ              | `/faq`             |
| Contact          | `/contact`         |
| Emergency        | `/emergency`       |
| Fees Information | `/fees-information`|
| Terms            | `/terms`           |

### Admin Panel
| Page          | Route                    |
|---------------|--------------------------|
| Dashboard     | `/admin`                 |
| Login         | `/admin/login`           |
| Doctors       | `/admin/doctors`         |
| Add Doctor    | `/admin/doctors/new`     |
| Services      | `/admin/services`        |
| Blog          | `/admin/blog`            |
| Testimonials  | `/admin/testimonials`    |
| FAQs          | `/admin/faqs`            |
| Gallery       | `/admin/gallery`         |
| Settings      | `/admin/settings`        |

---

## API Endpoints

All public endpoints: `GET /api/...`

```
GET  /api/doctors                 List all doctors
GET  /api/doctors/{id}            Doctor detail
GET  /api/services                List services
GET  /api/blog                    List blog posts (paginated)
GET  /api/blog/{slug}             Blog post detail
GET  /api/testimonials            List testimonials
GET  /api/faqs                    List FAQs
GET  /api/gallery                 Gallery images
GET  /api/homepage                Homepage section content
GET  /api/contact                 Contact & hours
GET  /api/settings                Site settings
POST /api/contact/submit          Contact form submission
POST /api/newsletter/subscribe    Newsletter signup

POST   /api/admin/login
POST   /api/admin/logout          (auth required)
CRUD   /api/admin/doctors         (auth required)
CRUD   /api/admin/services        (auth required)
CRUD   /api/admin/blog            (auth required)
CRUD   /api/admin/testimonials    (auth required)
CRUD   /api/admin/faqs            (auth required)
POST   /api/admin/gallery         (auth required)
DELETE /api/admin/gallery/{id}    (auth required)
PUT    /api/admin/settings        (auth required)
PUT    /api/admin/contact         (auth required)
PUT    /api/admin/homepage/{key}  (auth required)
```

---

## Design System

### Colors
- **Primary Navy:** `#1E3A5F` — trust, professionalism
- **Medical Teal:** `#0D9488` — CTAs, highlights
- **Light Blue:** `#EBF4FF` — backgrounds, badges
- **Background:** `#F8FAFC` — page background

### Key Design Features
- Glassmorphism hero section with floating stats
- Smooth Framer Motion scroll animations
- Skeleton loading states for all data-fetched sections
- Sticky "Book Appointment" floating button
- Emergency contact floating button
- Fully responsive (mobile → ultra-wide)
- Accessible markup (ARIA labels, focus management)

---

## Production Deployment

### Frontend (Vercel recommended)
```bash
cd frontend
npm run build
# Deploy to Vercel, Netlify, or any Node.js host
```

### Backend (Laravel Forge / any PHP host)
```bash
cd backend_fresh
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

Set environment variables on your host:
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://api.lakembagmp.com.au`
- `SANCTUM_STATEFUL_DOMAINS=lakembagmp.com.au`

---

## Technology Stack

| Layer      | Technology              |
|------------|-------------------------|
| Framework  | Next.js 14 (App Router) |
| Styling    | Tailwind CSS 3          |
| Animations | Framer Motion 11        |
| HTTP       | Axios                   |
| Icons      | Lucide React            |
| Backend    | Laravel 11              |
| Auth       | Laravel Sanctum         |
| Database   | MySQL 8.0               |
| Booking    | HealthEngine            |
| Fonts      | Inter (Google Fonts)    |
