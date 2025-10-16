import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Recycle, Users, Heart, Globe } from 'lucide-react'

const features = [
  {
    icon: Recycle,
    title: 'Sustainable Living',
    description: 'Reduce waste by giving items a second life through our community-driven platform.'
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Connect with neighbors and build meaningful relationships through sharing and swapping.'
  },
  {
    icon: Heart,
    title: 'Made with Care',
    description: 'Every feature is designed with love to create the best experience for our users.'
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Join thousands of users worldwide making a positive environmental impact.'
  }
]

const stats = [
  { number: '50K+', label: 'Active Users' },
  { number: '200K+', label: 'Items Swapped' },
  { number: '100+', label: 'Cities' },
  { number: '95%', label: 'User Satisfaction' }
]

export default function AboutPage() {
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
              About SwapIt
            </h1>
            <p 
              className="text-body-large mb-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              We're on a mission to create a more sustainable world through community-driven sharing. 
              SwapIt connects people who want to give their unused items a new home with those looking 
              for exactly what they need.
            </p>
            <Button variant="primary" size="large">
              Join Our Community
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 
                  className="text-h2 mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Our Mission
                </h2>
                <p 
                  className="text-body-large mb-6"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  In a world where consumption continues to grow, we believe there's a better way. 
                  Instead of buying new, why not swap, share, and sustain? Our platform makes it 
                  easy for communities to exchange items, reduce waste, and build connections.
                </p>
                <p 
                  className="text-body-large"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Every swap on our platform is a step towards a more circular economy, where 
                  resources are valued, reused, and kept in circulation for as long as possible.
                </p>
              </div>
              <div className="relative">
                <div className="w-full h-[400px] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop&crop=center"
                    alt="Hands holding a small plant growing from soil, symbolizing sustainability and circular economy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-h2 mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                What Drives Us
              </h2>
              <p 
                className="text-body-large max-w-2xl mx-auto"
                style={{ color: 'var(--text-secondary)' }}
              >
                Our core values shape everything we do, from product development to community building.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="text-center p-6 border rounded-2xl"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 
                    className="text-h4 mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-body-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-h2 mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Our Impact
              </h2>
              <p 
                className="text-body-large"
                style={{ color: 'var(--text-secondary)' }}
              >
                Together, we're making a real difference in communities worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="text-h1 font-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {stat.number}
                  </div>
                  <div 
                    className="text-body-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-h2 mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Meet the Team
              </h2>
              <p 
                className="text-body-large max-w-2xl mx-auto"
                style={{ color: 'var(--text-secondary)' }}
              >
                The passionate founders behind SwapIt who are dedicated to creating a more sustainable future.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Cem Yelcin */}
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                    alt="Cem Yelcin - Co-founder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 
                  className="text-h4 mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Cem Yelcin
                </h3>
                <p 
                  className="text-body-medium mb-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Co-founder
                </p>
                <p 
                  className="text-body-small"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Passionate about sustainable technology and community building.
                </p>
              </div>

              {/* Güngör Gücüyener - Center */}
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                    alt="Güngör Gücüyener - Founder & CEO"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 
                  className="text-h4 mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Güngör Gücüyener
                </h3>
                <p 
                  className="text-body-medium mb-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Founder & CEO
                </p>
                <p 
                  className="text-body-small"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Visionary leader driving the circular economy revolution through innovative solutions.
                </p>
              </div>

              {/* Berat Sezer */}
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
                    alt="Berat Sezer - Co-founder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 
                  className="text-h4 mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Berat Sezer
                </h3>
                <p 
                  className="text-body-medium mb-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Co-founder
                </p>
                <p 
                  className="text-body-small"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Expert in product development and user experience design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-h2 mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Ready to Make a Difference?
            </h2>
            <p 
              className="text-body-large mb-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              Join thousands of users who are already making their communities more sustainable, 
              one swap at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="large">
                Get Started Today
              </Button>
              <Button variant="outlined" size="large">
                Browse Items
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}