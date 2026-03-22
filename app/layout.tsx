import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Analytics } from "@vercel/analytics/next"
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google"

import { AppHeader } from "@/components/AppHeader"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
})

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://callytics.vercel.app"),
  title: {
    default: "Callytics",
    template: "%s | Callytics",
  },
  description:
    "A sharper analytics layer for Cal.com teams that need booking signal, host load, and trend visibility without building a backend.",
  applicationName: "Callytics",
  appleWebApp: {
    title: "Callytics",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${fraunces.variable} ${plexMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <AppHeader />
            <main>{children}</main>
          </div>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
