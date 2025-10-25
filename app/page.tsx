import { HeroSection } from "./components/home/HeroSection"
import { FeaturesGrid } from "./components/home/FeaturesGrid"
import { LiveDataPreview } from "./components/home/LiveDataPreview"
import { ValueSection } from "./components/home/ValueSection"
import { FooterCTA } from "./components/home/FooterCTA"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesGrid />
      <LiveDataPreview />
      <ValueSection />
      <FooterCTA />
    </main>
  )
}
