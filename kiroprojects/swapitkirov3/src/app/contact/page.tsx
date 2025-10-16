'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Mail, Phone, MapPin, MessageCircle, Clock, Users } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email and we\'ll respond within 24 hours',
    contact: 'hello@swapit.ch',
    action: 'mailto:hello@swap-it.ch'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak directly with our support team',
    contact: '+41 43 123-4567',
    action: 'tel:+41431234567'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with us in real-time for instant help',
    contact: 'Available 9:00 - 16:00',
    action: '#'
  }
]

const faqs = [
  {
    question: 'How does Swap It work?',
    answer: 'Swap It connects people in your community who want to exchange items. Simply browse available items, contact the owner, and arrange a swap that works for both parties.'
  },
  {
    question: 'Is Swap It free to use?',
    answer: 'Yes! Swap It is completely free to use. You can browse, list items, and connect with other users without any fees.'
  },
  {
    question: 'How do I ensure safe transactions?',
    answer: 'We recommend meeting in public places, bringing a friend, and trusting your instincts. We also provide safety guidelines and user verification features.'
  },
  {
    question: 'Can I sell items instead of swapping?',
    answer: 'While Swap It focuses on swapping and free exchanges, users can arrange their own terms including monetary exchanges if both parties agree.'
  }
]

export default function ContactPage() {
  return (
    <main className="min-h-screen px-2.5">
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 
              className="text-h1 mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Get in Touch
            </h1>
            <p 
              className="text-body-large"
              style={{ color: 'var(--text-secondary)' }}
            >
              Have questions, feedback, or need help? We're here to assist you. 
              Reach out to us through any of the methods below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <div 
                  key={index}
                  className="text-center p-8 border rounded-2xl hover:shadow-cards transition-shadow"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <method.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 
                    className="text-h4 mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {method.title}
                  </h3>
                  <p 
                    className="text-body-medium mb-4"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {method.description}
                  </p>
                  <p 
                    className="text-body-small-bold mb-6"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {method.contact}
                  </p>
                  <Button 
                    variant="outlined" 
                    size="default"
                    onClick={() => window.location.href = method.action}
                  >
                    Contact Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-h2 mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Send Us a Message
              </h2>
              <p 
                className="text-body-large"
                style={{ color: 'var(--text-secondary)' }}
              >
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            
            <div 
              className="p-8 border rounded-2xl"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label 
                      className="block text-body-small-bold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ 
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-body-small-bold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ 
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label 
                    className="block text-body-small-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-body-small-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Subject
                  </label>
                  <select
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Account Issues</option>
                    <option>Feature Request</option>
                    <option>Bug Report</option>
                    <option>Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label 
                    className="block text-body-small-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <div className="text-center">
                  <Button variant="primary" size="large" className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-h2 mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Frequently Asked Questions
              </h2>
              <p 
                className="text-body-large"
                style={{ color: 'var(--text-secondary)' }}
              >
                Find quick answers to common questions about SwapIt.
              </p>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="p-6 border rounded-2xl"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <h3 
                    className="text-h4 mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {faq.question}
                  </h3>
                  <p 
                    className="text-body-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p 
                className="text-body-medium mb-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                Still have questions?
              </p>
              <Button variant="outlined" size="default">
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}