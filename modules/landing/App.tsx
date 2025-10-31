import { Hero } from "@/modules/landing/Hero";
import { Stats } from "@/modules/landing/Stats";
import { Features } from "@/modules/landing/Features";
import { Footer } from "@/modules/landing/Footer";
import { ReferralSection } from "./ReferralSection";

export const App = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Stats />
      <Features />
      <ReferralSection />
      <Footer />
    </main>
  )
}
