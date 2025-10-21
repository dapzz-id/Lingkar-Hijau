"use client"

import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import StatsSection from "@/components/stats-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
