import NextLink from 'next/link'
import { AnchorHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: 'default' | 'nav'
  children: React.ReactNode
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'default', href, children, ...props }, ref) => {
    return (
      <NextLink
        href={href}
        className={cn(
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          {
            'hover:text-primary': variant === 'default',
            'text-body-small-bold hover:text-primary': variant === 'nav',
          },
          className
        )}
        style={{ color: 'var(--text-primary)' }}
        ref={ref}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = 'Link'