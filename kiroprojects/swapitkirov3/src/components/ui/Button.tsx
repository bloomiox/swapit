import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined'
  size?: 'default' | 'large' | 'small'
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    const getButtonStyle = () => {
      if (variant === 'secondary' || variant === 'outlined') {
        return {
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
          color: 'var(--primary-color)'
        }
      }
      return {}
    }

    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          
          // Variants
          {
            'bg-primary text-general-white hover:bg-primary/90': variant === 'primary',
            'border hover:opacity-80': variant === 'secondary' || variant === 'outlined',
          },
          
          // Sizes
          {
            'px-3 sm:px-4 py-2.5 text-body-small-bold': size === 'default',
            'px-4 py-3 text-body-normal-bold': size === 'large',
            'px-3 py-2 text-body-small-bold': size === 'small',
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