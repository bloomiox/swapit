import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'outline'
  size?: 'default' | 'large' | 'small' | 'lg'
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    const getButtonStyle = () => {
      return {}
    }

    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          
          // Variants
          {
            'bg-primary text-white hover:bg-primary/90': variant === 'primary',
            'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50': variant === 'secondary' || variant === 'outlined' || variant === 'outline',
          },
          
          // Sizes
          {
            'px-3 sm:px-4 py-2.5 text-sm font-medium': size === 'default',
            'px-4 py-3 text-base font-medium': size === 'large' || size === 'lg',
            'px-3 py-2 text-sm font-medium': size === 'small',
          },
          
          className
        )}
        style={getButtonStyle()}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'