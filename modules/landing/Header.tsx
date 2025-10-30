"use client"

import Image from "next/image";

import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Calendar, Github } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import { toast } from "sonner";
import { signIn } from "@/lib/auth/sign-in";

export function Header() {
  const { resolvedTheme } = useTheme()

  const handleCalOAuth = async () => {
    try {
      await signIn()
      // const authUrl = new URL("https://app.cal.com/auth/oauth2/authorize")
      // authUrl.search = new URLSearchParams({
      //   client_id: "",
      //   state: "x",
      //   // redirect_uri: "http://localhost:3000/api/cal/oauth/callback"
      // }).toString()

      // await fetch(authUrl.toString(), {
      //   method: "GET",
      //   mode: "no-cors",
      //   redirect: "follow",
      //   cache: "no-store",
      //   credentials: "omit",
      // })
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong!")
    }
  }

  return (
    <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Image src={resolvedTheme === 'dark' ? "/logo/callytics-logo-dark.png" : "/logo/callytics-logo-light.png"} alt="Callytics Logo" width={20} height={20} />
          </div>
          <span className="text-xl font-bold text-foreground">Callytics</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />

          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>

          <Button onClick={handleCalOAuth} variant="outline" className="gap-2 shrink-0">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Sign in with Cal.com</span>
            <span className="sm:hidden">Cal.com</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
