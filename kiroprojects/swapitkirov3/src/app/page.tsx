import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { FeaturedItems } from '@/components/sections/FeaturedItems'
import { WhyChooseSwapIt } from '@/components/sections/WhyChooseSwapIt'
import { DownloadApp } from '@/components/sections/DownloadApp'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen px-2.5">
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeaturedItems />
      <WhyChooseSwapIt />
      <DownloadApp />
      <Footer />
    </main>
  )
}