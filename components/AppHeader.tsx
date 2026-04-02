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
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-2xl">
      <div className="shell-container flex min-h-20 items-center justify-between gap-4 py-4">
        <Link href="/" className="group flex items-center gap-4 transition-opacity hover:opacity-90">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-primary/20 to-accent/20 opacity-0 blur transition-opacity group-hover:opacity-100" />
            <Image
              src={logoSrc}
              alt={`${SITE_CONFIG.name} logo mark`}
              width={34}
              height={34}
              className="relative h-[34px] w-[34px] rounded-xl shadow-sm"
              priority
            />
          </div>
          <div>
            <span className="block font-serif text-2xl tracking-[-0.05em] text-foreground transition-transform group-hover:scale-[1.01]">
              {SITE_CONFIG.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden text-[0.62rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/80 sm:block">
                Intelligence layer
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
              <span className="hidden text-[0.62rem] font-bold uppercase tracking-[0.24em] text-accent sm:block">
                v0.1
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {!isDashboardRoute &&
            MARKETING_LINKS.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className="rounded-full px-5 text-[13px] font-medium text-muted-foreground transition-all hover:bg-accent/5 hover:text-foreground"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          {isDashboardRoute && (
            <div className="flex items-center gap-3 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Operator workspace
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />
          <div className="hidden h-5 w-px bg-border/50 md:block" />
          <Button
            variant="outline"
            asChild
            className="hidden rounded-full border-border/50 bg-transparent px-5 text-[13px] hover:bg-card md:inline-flex"
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
