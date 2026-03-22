"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ArrowUpRight, Github, LayoutDashboard, LogOut } from "lucide-react"
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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/72 backdrop-blur-xl">
      <div className="shell-container flex min-h-18 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logoSrc}
            alt={`${SITE_CONFIG.name} logo mark`}
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
            priority
          />
          <div>
            <span className="block font-serif text-xl tracking-[-0.04em] text-foreground">
              {SITE_CONFIG.name}
            </span>
            <span className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
              Cal.com intelligence layer
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {!isDashboardRoute &&
            MARKETING_LINKS.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className="rounded-full px-4 text-sm text-muted-foreground hover:text-foreground"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          {isDashboardRoute && (
            <div className="section-kicker">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Operator workspace
            </div>
          )}
          {isDemoRoute && (
            <div className="section-kicker">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Interactive demo
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <ModeToggle />
          <Button
            variant="outline"
            asChild
            className="hidden rounded-full border-border/70 bg-card/70 px-4 hover:bg-card md:inline-flex"
          >
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
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
              <span className="hidden sm:inline">Sign out</span>
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
      </div>
    </header>
  )
}
