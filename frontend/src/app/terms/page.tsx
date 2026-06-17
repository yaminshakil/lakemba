import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for Lakemba General Medical Practice.',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-36 pb-20 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <span className="inline-block px-3 py-1 bg-[#EBF4FC] text-[#1B72B5] text-xs font-semibold rounded-full uppercase tracking-wide mb-4">Legal</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Terms of Use</h1>
            <p className="text-gray-500 text-sm">Last updated: May 2026</p>
            <div className="mt-4 h-1 w-16 rounded-full bg-[#6BBE44]" />
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Lakemba General Medical Practice website (&quot;Site&quot;), you accept
                and agree to be bound by these Terms of Use. If you do not agree to these terms, please
                do not use this Site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Medical Disclaimer</h2>
              <p>
                The information provided on this Site is for general informational purposes only and is
                not intended as, nor should it be considered a substitute for, professional medical advice,
                diagnosis, or treatment. Always seek the advice of your physician or other qualified health
                provider with any questions you may have regarding a medical condition.
              </p>
              <p className="mt-3">
                In case of a medical emergency, call 000 immediately or go to your nearest emergency department.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Use of the Site</h2>
              <p>You agree to use this Site only for lawful purposes and in a manner that does not:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Infringe the rights of others.</li>
                <li>Distribute harmful, offensive, or misleading content.</li>
                <li>Attempt to gain unauthorised access to any part of the Site or its systems.</li>
                <li>Interfere with the proper functioning of the Site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Intellectual Property</h2>
              <p>
                All content on this Site, including text, images, logos, and graphics, is the property of
                Lakemba General Medical Practice or its content suppliers and is protected by Australian
                copyright law. You may not reproduce, distribute, or use any content without our prior
                written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Links</h2>
              <p>
                This Site may contain links to third-party websites (such as HealthEngine for online bookings).
                These links are provided for your convenience only. We have no control over the content
                of those sites and accept no responsibility for them or for any loss or damage that may
                arise from your use of them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Online Appointments</h2>
              <p>
                Online appointment bookings are facilitated through HealthEngine, a third-party platform. By
                using the online booking system, you also agree to HealthEngine&apos;s terms and conditions and
                privacy policy. Lakemba General Medical Practice is not responsible for any issues arising
                from the use of the HealthEngine platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p>
                To the extent permitted by law, Lakemba General Medical Practice excludes all liability
                for any loss or damage (including indirect or consequential loss) arising from your use
                of, or inability to use, this Site or any information on it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to These Terms</h2>
              <p>
                We reserve the right to modify these Terms of Use at any time. Changes will be effective
                immediately upon posting to the Site. Your continued use of the Site after any changes
                constitutes your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Governing Law</h2>
              <p>
                These terms are governed by the laws of New South Wales, Australia. Any disputes arising
                from these terms shall be subject to the exclusive jurisdiction of the courts of New South Wales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
              <p>If you have any questions about these Terms of Use, please contact us:</p>
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
