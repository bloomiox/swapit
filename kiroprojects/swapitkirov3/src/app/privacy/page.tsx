import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | SwapIt',
  description: 'Privacy Policy for SwapIt - learn how we protect and handle your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-2.5">
      <Navbar />
      
      <div style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 max-w-6xl mx-auto">
        <h1 
          className="text-h1 mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          Privacy Policy
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
              1. Introduction
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              SwapIt ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our 
              item swapping platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              2. Information We Collect
            </h2>
            
            <h3 
              className="text-h4 mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Personal Information
            </h3>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Name and contact information (email, phone number)</li>
              <li>Profile information and photos</li>
              <li>Location data (city, neighborhood)</li>
              <li>Account credentials and preferences</li>
            </ul>

            <h3 
              className="text-h4 mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Item Information
            </h3>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Photos and descriptions of items you list</li>
              <li>Item categories and conditions</li>
              <li>Swap history and preferences</li>
            </ul>

            <h3 
              className="text-h4 mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Usage Information
            </h3>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Device information and IP address</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and features used</li>
              <li>Search queries and interactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              3. How We Use Your Information
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We use your information to:
            </p>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Provide and maintain our swapping platform</li>
              <li>Connect you with other users for item swaps</li>
              <li>Send notifications about swap requests and messages</li>
              <li>Improve our services and user experience</li>
              <li>Prevent fraud and ensure platform safety</li>
              <li>Comply with legal obligations</li>
              <li>Send important updates about our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              4. Information Sharing
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We may share your information in the following circumstances:
            </p>
            
            <h3 
              className="text-h4 mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              With Other Users
            </h3>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Profile information and item listings are visible to other users</li>
              <li>Contact information is shared only when you agree to a swap</li>
              <li>Location is shown at a neighborhood level for safety</li>
            </ul>

            <h3 
              className="text-h4 mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              With Service Providers
            </h3>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Cloud hosting and data storage services</li>
              <li>Analytics and performance monitoring</li>
              <li>Customer support and communication tools</li>
            </ul>

            <h3 
              className="text-h4 mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Legal Requirements
            </h3>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>When required by law or legal process</li>
              <li>To protect our rights and prevent fraud</li>
              <li>In case of emergency to protect user safety</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              5. Data Security
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure data centers and infrastructure</li>
            </ul>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              However, no method of transmission over the internet is 100% secure, and we cannot 
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              6. Your Rights and Choices
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              You have the right to:
            </p>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Request a copy of your data</li>
              <li>Restrict or object to certain data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              7. Location Information
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We collect location information to help you find nearby swap opportunities. You can:
            </p>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Control location sharing through your device settings</li>
              <li>Manually set your preferred swap area</li>
              <li>Choose the level of location precision to share</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              8. Children's Privacy
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Our service is not intended for children under 18. We do not knowingly collect 
              personal information from children under 18. If we become aware that we have 
              collected such information, we will take steps to delete it.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              9. Data Retention
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We retain your information for as long as necessary to provide our services and 
              comply with legal obligations. When you delete your account, we will delete or 
              anonymize your personal information within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              10. International Data Transfers
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information during such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              11. Changes to This Policy
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 
              className="text-h3 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              12. Contact Us
            </h2>
            <p 
              className="text-body-medium mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul 
              className="list-disc pl-6 mb-4 space-y-2 text-body-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Email: privacy@swapit.com</li>
              <li>Through our contact page</li>
              <li>Mail: SwapIt Privacy Team, [Address]</li>
            </ul>
          </section>
        </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}