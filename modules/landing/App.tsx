import { Hero } from "@/modules/landing/Hero";
import { Stats } from "@/modules/landing/Stats";
import { Features } from "@/modules/landing/Features";
import { WaitlistSection } from "@/modules/landing/WaitlistSection";
import { Footer } from "@/modules/landing/Footer";

export const App = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Stats />
      <Features />
      <WaitlistSection />
      <Footer />
    </main>
  )
}
