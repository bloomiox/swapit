import { Package, ArrowRightLeft, Star } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: Package,
    title: 'List Your Item',
    description: 'Upload items you no longer need with photos and descriptions',
  },
  {
    number: '2',
    icon: ArrowRightLeft,
    title: 'Swap or Drop',
    description: 'Exchange items directly with others or drop them for your community to pick up',
  },
  {
    number: '3',
    icon: Star,
    title: 'Review & Rate',
    description: 'Rate your experience after each exchange to build a trusted community',
  },
]

export function HowItWorks() {
  return (
    <section 
      className="flex flex-col items-center gap-6 lg:gap-10 px-4 md:px-6 lg:px-[165px] py-section-mobile md:py-section-tablet lg:py-20"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Section Header */}
      <div className="flex flex-col gap-1 text-center max-w-2xl">
        <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>
          How it works
        </h2>
        <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
          Simple steps to sustainable living
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-2 w-full">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex flex-col justify-center gap-4 p-6 border rounded-2xl flex-1"
            style={{ 
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
          >
            {/* Step Number */}
            <div className="absolute top-4 right-4 md:top-[114px] md:right-8 text-4xl md:text-h1 text-info-light font-medium">
              {step.number}
            </div>

            {/* Icon */}
            <div className="flex justify-center">
              <div 
                className="w-16 h-16 rounded-full shadow-cards flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <step.icon className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h3 className="text-body-normal-bold" style={{ color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              <p className="text-body-small" style={{ color: 'var(--text-secondary)' }}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}