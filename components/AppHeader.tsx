'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Github, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { SITE_CONFIG } from '@/constants/site';
import { authClient } from '@/lib/auth-client';
import { signOut } from '@/lib/auth/sign-out';
import { toast } from 'sonner';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { data: session, isPending, error } = authClient.useSession();

  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const showLogout = isDashboardRoute && session && !isPending && !error;
  const showGithub = !isDashboardRoute;

  const handleLogout = async () => {
    try {
      await signOut(() => router.push('/'));
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const logoSrc =
    resolvedTheme === 'dark'
      ? '/logo/callytics-logo-dark.png'
      : '/logo/callytics-logo-light.png';

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logoSrc}
            alt={`${SITE_CONFIG.name} logo mark`}
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
            priority
          />
          <span className="text-lg font-semibold text-foreground sm:text-xl">
            {SITE_CONFIG.name}
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <ModeToggle />
          {showGithub && (
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
          )}
          {showLogout && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2 border-primary/40 bg-primary/10 text-primary hover:border-primary/60 hover:bg-primary/20 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
