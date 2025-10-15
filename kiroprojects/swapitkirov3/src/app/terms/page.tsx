import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms and Conditions | SwapIt',
  description: 'Terms and Conditions for using SwapIt - the sustainable item swapping platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-2.5">
      <Navbar />
      
      <div style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 max-w-6xl mx-auto">
        <h1 
          className="text-h1 mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          Terms and Conditions
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p 
            className="text-body-medium mb-6"
            style={{ color: 'var(--text-secondary)' }}
          >
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              1. Acceptance of Terms
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              By accessing and using SwapIt ("the Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              2. Description of Service
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              SwapIt is a platform that enables users to exchange items with other users in their local community. 
              The Service facilitates connections between users but does not participate in the actual exchange of items.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              3. User Responsibilities
            </h2>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>You must be at least 18 years old to use this Service</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree to provide accurate and complete information about items you list</li>
              <li>You are solely responsible for the items you offer for swap</li>
              <li>You must comply with all applicable local, state, and federal laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              4. Prohibited Items and Conduct
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              The following items and behaviors are strictly prohibited:
            </p>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Illegal items or substances</li>
              <li>Weapons, explosives, or dangerous materials</li>
              <li>Stolen or counterfeit goods</li>
              <li>Items that infringe on intellectual property rights</li>
              <li>Harassment, threats, or abusive behavior toward other users</li>
              <li>Fraudulent or misleading listings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              5. Safety and Meetings
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              SwapIt encourages safe practices when meeting other users:
            </p>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Meet in public, well-lit locations</li>
              <li>Bring a friend when possible</li>
              <li>Trust your instincts and report suspicious behavior</li>
              <li>Inspect items thoroughly before completing a swap</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              6. Limitation of Liability
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              SwapIt acts solely as a platform to connect users. We are not responsible for:
            </p>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>The quality, safety, or legality of items offered</li>
              <li>The accuracy of user listings or profiles</li>
              <li>Any disputes between users</li>
              <li>Any damages or losses resulting from swaps</li>
              <li>Any personal injury or property damage during meetings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              7. Account Termination
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We reserve the right to terminate or suspend accounts that violate these terms, 
              engage in fraudulent activity, or pose a risk to other users.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              8. Privacy
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              9. Changes to Terms
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We reserve the right to modify these terms at any time. Users will be notified 
              of significant changes, and continued use of the Service constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              10. Contact Information
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              If you have questions about these Terms and Conditions, please contact us through 
              our contact page or email us at legal@swapit.com.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}