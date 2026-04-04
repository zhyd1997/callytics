"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ArrowUpRight, Github, LayoutDashboard, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/constants/site"
import { authClient } from "@/lib/auth-client"
import { signOut } from "@/lib/auth/sign-out"

const MARKETING_LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/#insights", label: "Insights" },
  { href: "/#platform", label: "Platform" },
] as const

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const { data: session, isPending, error } = authClient.useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isDashboardRoute = pathname?.startsWith("/dashboard")
  const isDemoRoute = pathname?.startsWith("/demo")
  const showLogout = isDashboardRoute && session && !isPending && !error
  const showDashboardLink = !showLogout && session && !isPending && !error

  const handleLogout = async () => {
    try {
      await signOut(() => router.push("/"))
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong!")
    }
  }

  const logoSrc =
    resolvedTheme === "dark"
      ? "/logo/callytics-logo-dark.png"
      : "/logo/callytics-logo-light.png"

  return (
    <header className="sticky top-0 z-40 border-b border-border/30 bg-background/70 backdrop-blur-2xl">
      <div className="shell-container flex h-16 items-center justify-between gap-3 sm:h-18 lg:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Image
            src={logoSrc}
            alt={`${SITE_CONFIG.name} logo mark`}
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg shadow-sm sm:h-[34px] sm:w-[34px] sm:rounded-xl"
            priority
          />
          <div>
            <span className="block font-serif text-xl tracking-[-0.04em] text-foreground sm:text-2xl">
              {SITE_CONFIG.name}
            </span>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
                Intelligence layer
              </span>
              <span className="h-1 w-1 rounded-full bg-accent/50" />
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-accent/80">
                v0.1
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {!isDashboardRoute &&
            MARKETING_LINKS.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className="rounded-full px-5 text-[13px] font-medium text-muted-foreground transition-all hover:bg-accent/8 hover:text-foreground"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          {isDashboardRoute && (
            <div className="flex items-center gap-3 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Operator workspace
            </div>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex md:gap-3">
          <ModeToggle />
          <div className="h-5 w-px bg-border/40" />
          <Button
            variant="outline"
            asChild
            className="rounded-full border-border/50 bg-transparent px-4 text-[13px] hover:bg-card"
          >
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </Button>
          {showDashboardLink && (
            <Button asChild className="rounded-full px-4">
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
          {showLogout && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-full border-primary/30 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/15 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          )}
          {!showLogout && !showDashboardLink && (
            <Button asChild className="rounded-full px-4">
              <Link href={isDemoRoute ? "/" : "/demo"}>
                {isDemoRoute ? "Home" : "Live demo"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-card/50 text-foreground backdrop-blur-sm transition-colors active:bg-card/80"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-panel"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-menu-panel" className="border-t border-border/30 bg-background/95 backdrop-blur-2xl md:hidden">
          <div className="shell-container space-y-2 py-4">
            {!isDashboardRoute &&
              MARKETING_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors active:bg-card/80 hover:bg-card/60 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            {isDashboardRoute && (
              <div className="flex items-center gap-3 px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Operator workspace
              </div>
            )}

            <div className="my-2 h-px bg-border/30" />

            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>

            {showDashboardLink && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            {showLogout && (
              <button
                type="button"
                onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            )}
            {!showLogout && !showDashboardLink && (
              <Link
                href={isDemoRoute ? "/" : "/demo"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
              >
                {isDemoRoute ? "Home" : "Live demo"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
