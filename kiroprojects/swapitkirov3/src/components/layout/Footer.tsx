import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Link } from '@/components/ui/Link'

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-footer)' }}>
      {/* Main Footer Content */}
      <div className="flex flex-col gap-8 lg:gap-12 px-4 md:px-6 lg:px-8 py-section-mobile md:py-section-tablet lg:py-20">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-21 w-full">
          {/* Logo and Description */}
          <div className="flex flex-col gap-4 w-full lg:w-[354px] text-center lg:text-left">
            <h3 className="text-h4 font-bold" style={{ color: 'var(--text-footer)' }}>
              SwapIt
            </h3>
            <p className="text-body-normal" style={{ color: 'var(--text-footer)' }}>
              Building a sustainable future through community-driven item exchange.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex justify-center lg:justify-start">
            <div className="flex flex-col gap-4">
              <h4 className="text-body-small-bold text-primary-light text-center lg:text-left">
                Quick Links
              </h4>
              <div className="flex flex-col gap-3 text-center lg:text-left">
                <Link href="/about" className="text-gray-200 hover:text-white transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-200 hover:text-white transition-colors">
                  Contact
                </Link>
                <Link href="/terms" className="text-gray-200 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" className="text-gray-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div 
        className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-16 px-4 md:px-6 lg:px-8 py-6 border-t"
        style={{ 
          backgroundColor: 'var(--bg-footer)',
          borderColor: 'var(--border-color)'
        }}
      >
        <p className="text-body-normal text-center sm:text-left text-sm sm:text-base" style={{ color: 'var(--text-footer)' }}>
          © 2024 SwapIt. All rights reserved. Made with ❤️ for sustainability.
        </p>
        
        {/* Social Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button className="w-6 h-6 text-general-white hover:text-primary-light transition-colors">
            <Facebook className="w-full h-full" />
          </button>
          <button className="w-6 h-6 text-general-white hover:text-primary-light transition-colors">
            <Twitter className="w-full h-full" />
          </button>
          <button className="w-6 h-6 text-general-white hover:text-primary-light transition-colors">
            <Instagram className="w-full h-full" />
          </button>
          <button className="w-6 h-6 text-general-white hover:text-primary-light transition-colors">
            <Youtube className="w-full h-full" />
          </button>
        </div>
      </div>
    </footer>
  )
}