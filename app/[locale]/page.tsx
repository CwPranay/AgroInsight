import { FeaturesGrid } from "./components/home/FeaturesGrid";
import { FooterCTA } from "./components/home/FooterCTA";
import { HeroSection } from "./components/home/HeroSection";
import { LiveDataPreview } from "./components/home/LiveDataPreview";
import { ValueSection } from "./components/home/ValueSection";

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
