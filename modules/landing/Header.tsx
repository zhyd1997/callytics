"use client"

import Image from "next/image";

import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "next-themes";

export function Header() {
  const { resolvedTheme } = useTheme()

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
        </div>
      </div>
    </header>
  );
}
