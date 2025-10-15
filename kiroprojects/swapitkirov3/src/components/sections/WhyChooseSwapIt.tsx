import { Recycle, Users, Zap } from 'lucide-react'

const benefits = [
  {
    icon: Recycle,
    title: 'Sustainable',
    description: 'Reduce waste and environmental impact through circular economy',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with like-minded people in your neighborhood',
  },
  {
    icon: Zap,
    title: 'Easy to Use',
    description: 'Simple interface makes swapping items quick and enjoyable',
  },
]

export function WhyChooseSwapIt() {
  return (
    <section 
      className="flex flex-col items-center gap-6 lg:gap-10 px-4 md:px-6 lg:px-[165px] py-section-mobile md:py-section-tablet lg:py-10"
      style={{ backgroundColor: '#F7F5EC' }}
    >
      {/* Section Header */}
      <div className="flex flex-col gap-1 text-center max-w-2xl">
        <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>
          Why Choose SwapIt?
        </h2>
        <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
          Join thousands who are making a difference
        </p>
      </div>

      {/* Benefits */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-2 w-full">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex flex-col justify-center gap-4 p-6 border rounded-2xl flex-1"
            style={{ 
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
          >
            {/* Icon */}
            <div className="flex justify-center">
              <div 
                className="w-16 h-16 rounded-full shadow-cards flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <benefit.icon className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h3 className="text-body-normal-bold" style={{ color: 'var(--text-primary)' }}>
                {benefit.title}
              </h3>
              <p className="text-body-small" style={{ color: 'var(--text-secondary)' }}>
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}