"use client"

import Image from "next/image"
import Link from "next/link"
import { Github } from "lucide-react"
import { useTheme } from "next-themes"

import { SITE_CONFIG } from "@/constants/site"

export function Footer() {
  const { resolvedTheme } = useTheme()

  return (
    <footer className="pb-12 pt-8">
      <div className="shell-container">
        <div className="flex flex-col gap-8 rounded-[32px] border border-border/70 bg-card/72 px-6 py-8 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/logo/callytics-logo-dark.png"
                  : "/logo/callytics-logo-light.png"
              }
              alt="Callytics logo"
              width={34}
              height={34}
              className="rounded-xl"
            />
            <div>
              <p className="font-serif text-2xl tracking-[-0.05em] text-foreground">
                {SITE_CONFIG.name}
              </p>
              <p className="text-sm text-muted-foreground">{SITE_CONFIG.description}</p>
            </div>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Built for Cal.com operators who need a cleaner way to read booking
            patterns, explain changes, and prepare better reviews.
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
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
