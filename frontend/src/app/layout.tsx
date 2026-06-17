import type { Metadata } from 'next'
import Script from 'next/script'
import { Bitter, Source_Sans_3, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/context/AuthContext'
import BackToTop from '@/components/ui/BackToTop'
import HealthEngineTrigger from '@/components/booking/HealthEngineTrigger'
import './globals.css'

const bitter = Bitter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const SITE_URL = 'https://lakembagmp.com.au'
// Derive API origin for DNS prefetch (strips /api suffix)
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '')
const SITE_NAME = 'Lakemba General Medical Practice'
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Trusted GP in Lakemba NSW`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Lakemba General Medical Practice – compassionate, patient-centred GP care in Lakemba, NSW 2195. Bulk billing for eligible patients. Online bookings via HealthEngine. Doctors speaking Arabic, Mandarin, Vietnamese & more.',
  keywords: [
    'Lakemba GP', 'doctor Lakemba', 'bulk billing Lakemba', 'medical centre Lakemba',
    'general practice NSW 2195', 'GP near me Lakemba', 'HealthEngine Lakemba', 'bulk billing GP Sydney',
    'Arabic speaking doctor Sydney', 'family doctor Lakemba', 'Lakemba health centre',
    'Canterbury GP', 'Bankstown doctor', 'Medicare bulk billing',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Health & Medical',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Trusted GP in Lakemba NSW`,
    description:
      'Compassionate GP care in Lakemba NSW. Bulk billing available. Book online with HealthEngine. Multilingual doctors.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} – Lakemba NSW` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Trusted GP in Lakemba NSW`,
    description: 'Compassionate GP care in Lakemba NSW. Bulk billing available. Book online with HealthEngine.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: SITE_URL },
  other: {
    'geo.region': 'AU-NSW',
    'geo.placename': 'Lakemba',
    'geo.position': '-33.9176;151.0706',
    'ICBM': '-33.9176, 151.0706',
    // Add google-site-verification and msvalidate.01 here once obtained from Search Console / Bing
    // 'google-site-verification': 'YOUR_CODE',
    // 'msvalidate.01': 'YOUR_CODE',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['MedicalClinic', 'LocalBusiness'],
  name: SITE_NAME,
  alternateName: 'Lakemba GMP',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE,
  description:
    'Compassionate, patient-centred general practice in Lakemba, NSW. Bulk billing for eligible patients. Online bookings available.',
  telephone: '02 7265 1000',
  email: 'info@lakembagmp.com.au',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '21 Haldon St',
    addressLocality: 'Lakemba',
    addressRegion: 'NSW',
    postalCode: '2195',
    addressCountry: 'AU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -33.9176,
    longitude: 151.0706,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:30', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],
  medicalSpecialty: [
    'General Practice', 'Preventive Medicine', "Women's Health",
    'Mental Health Care', 'Chronic Disease Management',
  ],
  availableService: [
    { '@type': 'MedicalTherapy', name: 'General Consultations' },
    { '@type': 'MedicalTherapy', name: 'Bulk Billing' },
    { '@type': 'MedicalTherapy', name: 'Mental Health Care Plans' },
    { '@type': 'MedicalTherapy', name: 'Chronic Disease Management' },
    { '@type': 'MedicalTherapy', name: 'Childhood Immunisations' },
    { '@type': 'MedicalTherapy', name: "Women's Health" },
  ],
  paymentAccepted: 'Cash, Credit Card, Medicare Bulk Billing',
  priceRange: 'Bulk Billing Available',
  currenciesAccepted: 'AUD',
  areaServed: [
    { '@type': 'City', name: 'Lakemba' },
    { '@type': 'City', name: 'Bankstown' },
    { '@type': 'City', name: 'Canterbury' },
    { '@type': 'City', name: 'Punchbowl' },
    { '@type': 'City', name: 'Wiley Park' },
  ],
  hasMap: 'https://maps.google.com/?q=21+Haldon+St,+Lakemba+NSW+2195,+Australia',
  sameAs: [
    'https://www.healthengine.com.au',
    'https://www.facebook.com/lakembagmp',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bitter.variable} ${sourceSans.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1B72B5" />
        {API_ORIGIN && <link rel="dns-prefetch" href={API_ORIGIN} />}
        {API_ORIGIN && <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <BackToTop />
            <HealthEngineTrigger />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
