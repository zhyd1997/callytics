"use client"

import Image from "next/image"
import Link from "next/link"
import { Github } from "lucide-react"
import { useTheme } from "next-themes"

import { SITE_CONFIG } from "@/constants/site"

export function Footer() {
  const { resolvedTheme } = useTheme()

  return (
    <footer className="pb-8 pt-6 sm:pb-12 sm:pt-8">
      <div className="shell-container">
        <div className="flex flex-col gap-6 rounded-2xl border border-border/50 bg-card/65 px-5 py-6 backdrop-blur-xl sm:rounded-[32px] sm:px-6 sm:py-8 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex items-center gap-3">
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/logo/callytics-logo-dark.png"
                  : "/logo/callytics-logo-light.png"
              }
              alt="Callytics logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg sm:rounded-xl"
            />
            <div>
              <p className="font-serif text-xl tracking-[-0.04em] text-foreground sm:text-2xl">
                {SITE_CONFIG.name}
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">{SITE_CONFIG.description}</p>
            </div>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Built for Cal.com operators who need a cleaner way to read booking
            patterns, explain changes, and prepare better reviews.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground sm:gap-5">
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <Link href={SITE_CONFIG.links.privacy} className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href={SITE_CONFIG.links.terms} className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href={SITE_CONFIG.links.contact} className="transition-colors hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
