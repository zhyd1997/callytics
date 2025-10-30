'use client';

import type { FC } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OverviewStats } from './OverviewStats';
import { MeetingStatusChart } from './MeetingStatusChart';
import { DurationAnalysis } from './DurationAnalysis';
import { MeetingTimeline } from './MeetingTimeline';
import { PlatformUsage } from './PlatformUsage';
import { HostActivity } from './HostActivity';
import { RecentMeetings } from './RecentMeetings';
import { removeSelfMeetings } from '@/utils/meetings';
import { ModeToggle } from '@/components/mode-toggle';
import { MEETING_DATA } from '@/constants/meetings';
import type { MeetingCollection, MeetingRecord } from '@/lib/types/meeting';
import { toast } from 'sonner';
import { signOut } from '@/lib/auth/sign-out';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface DashboardAppProps {
  readonly initialMeetings?: MeetingCollection;
}

export const App: FC<DashboardAppProps> = ({ initialMeetings }) => {
  const router = useRouter()

  const { data: session, isPending, error } = authClient.useSession();

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isPending || error || !session) {
      setIsAuthorized(false)
    } else {
      setIsAuthorized(true)
    }
  }, [session, isPending, error])

  const meetingData = useMemo<MeetingCollection>(() => {
    return initialMeetings ?? MEETING_DATA.data;
  }, [initialMeetings]);

  const filteredMeetings = useMemo<MeetingRecord[]>(() => {
    return removeSelfMeetings(meetingData);
  }, [meetingData]);

  const handleLogout = async () => {
    try {
      await signOut(() => router.push("/")); // redirect to login page
      setIsAuthorized(false);
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong!")
    }
  };

  // Show landing page if not authorized
  // if (!isAuthorized) {
  //   return (
  //     <div className="relative">
  //       <div className="absolute top-4 right-4 z-10">
  //         <ModeToggle />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.28),_transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(168,85,247,0.25),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,_rgba(59,130,246,0.18),_transparent_60%)] mix-blend-screen" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:pt-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="text-center sm:text-left">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-medium text-primary shadow-[0_0_20px_rgba(249,115,22,0.35)] animate-[gradient-flow_5s_ease_infinite]">
              <span className="text-base animate-[float_3s_ease-in-out_infinite]">🕸️</span>
              Insights in full moon mode
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent [text-shadow:0_0_30px_rgba(249,115,22,0.45)]">
                Meeting Insights
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Comprehensive analytics for your calendar data with a seasonal glow.
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-center gap-2 sm:justify-end">
            <ModeToggle />

            {isAuthorized && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 shrink-0 border-primary/50 bg-primary/10 text-primary hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/25 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <OverviewStats data={filteredMeetings} />
        </motion.div>

        {/* Recent Meetings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8"
        >
          <RecentMeetings data={filteredMeetings} />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MeetingStatusChart data={filteredMeetings} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <DurationAnalysis data={filteredMeetings} />
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <MeetingTimeline data={filteredMeetings} />
        </motion.div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <PlatformUsage data={filteredMeetings} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <HostActivity data={filteredMeetings} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
