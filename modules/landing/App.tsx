import { Features } from "@/modules/landing/Features"
import { Footer } from "@/modules/landing/Footer"
import { Hero } from "@/modules/landing/Hero"
import { ReferralSection } from "@/modules/landing/ReferralSection"
import { Stats } from "@/modules/landing/Stats"

export const App = () => {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero />
      <Stats />
      <Features />
      <ReferralSection />
      <Footer />
    </main>
  )
}
