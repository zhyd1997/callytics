"use client"

import Image from "next/image"

import { useTheme } from "next-themes";
import { Github } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";

export function Footer() {
  const { resolvedTheme } = useTheme()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <Image src={resolvedTheme === 'dark' ? "/logo/callytics-logo-dark.png" : "/logo/callytics-logo-light.png"} alt="Callytics Logo" width={20} height={20} />
            </div>
            <span className="text-xl font-bold text-foreground">{SITE_CONFIG.name}</span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. {SITE_CONFIG.description}.
          </p>

          <div className="flex gap-6 text-sm text-muted-foreground">
              <a
                href={SITE_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            <a href={SITE_CONFIG.links.privacy} className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href={SITE_CONFIG.links.terms} className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a href={SITE_CONFIG.links.contact} className="transition-colors hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
