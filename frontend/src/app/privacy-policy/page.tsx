import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Lakemba General Medical Practice.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-36 pb-20 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <span className="inline-block px-3 py-1 bg-[#EBF4FC] text-[#1B72B5] text-xs font-semibold rounded-full uppercase tracking-wide mb-4">Legal</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
            <p className="text-gray-500 text-sm">Last updated: May 2026</p>
            <div className="mt-4 h-1 w-16 rounded-full bg-[#6BBE44]" />
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p>
                Lakemba General Medical Practice (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy
                and handling your personal information in accordance with the Australian Privacy Act 1988 (Cth)
                and the Australian Privacy Principles (APPs).
              </p>
              <p className="mt-3">
                This Privacy Policy explains how we collect, use, disclose, and safeguard your personal and
                health information when you visit our clinic, use our website, or interact with our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Personal information:</strong> Name, date of birth, address, phone number, email address.</li>
                <li><strong>Health information:</strong> Medical history, diagnoses, treatment details, prescriptions, test results, and referrals.</li>
                <li><strong>Medicare and insurance details:</strong> Medicare number, private health fund details.</li>
                <li><strong>Website usage data:</strong> IP address, browser type, pages visited, and cookies (for website users).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Provide, manage, and coordinate your medical care.</li>
                <li>Process Medicare and insurance claims.</li>
                <li>Communicate appointment reminders and health information.</li>
                <li>Meet our legal and regulatory obligations.</li>
                <li>Improve our services and website experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Disclosure of Your Information</h2>
              <p>
                We may share your health information with other healthcare providers involved in your care
                (such as specialists, pathology, and hospitals), only when necessary and with your consent
                where required. We do not sell, rent, or trade your personal information to third parties.
              </p>
              <p className="mt-3">
                We may be required to disclose information to government agencies or other parties where
                required by law (e.g., mandatory reporting obligations).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Storage and Security</h2>
              <p>
                Your information is stored securely in our practice management system. We take reasonable
                steps to protect your information from misuse, interference, loss, and unauthorised access.
                Electronic records are protected by access controls, passwords, and encryption where appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Accessing and Correcting Your Information</h2>
              <p>
                You have the right to access and request corrections to your personal and health information.
                Please contact our practice in writing to make such a request. We will respond within a
                reasonable timeframe and in accordance with applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
              <p>
                Our website uses cookies to improve your browsing experience. You may disable cookies through
                your browser settings, though this may affect some website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy or how we handle your information, please contact us:</p>
              <div className="mt-3 p-4 bg-[#EBF4FC] rounded-xl">
                <p className="font-semibold text-[#1B72B5]">Lakemba General Medical Practice</p>
                <p className="text-sm mt-1">Phone: <a href="tel:+61272651000" className="text-[#1B72B5] hover:underline">02 7265 1000</a></p>
                <p className="text-sm">Location: 21 Haldon Street, Lakemba, NSW 2195</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
