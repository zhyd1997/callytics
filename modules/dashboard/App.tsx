'use client';

import type { FC } from 'react';
import { useMemo } from 'react';
import { motion } from 'motion/react';
import { OverviewStats } from './OverviewStats';
import { MeetingStatusChart } from './MeetingStatusChart';
import { DurationAnalysis } from './DurationAnalysis';
import { MeetingTimeline } from './MeetingTimeline';
import { PlatformUsage } from './PlatformUsage';
import { HostActivity } from './HostActivity';
import { RecentMeetings } from './RecentMeetings';
import { removeSelfMeetings } from '@/lib/utils/meetings';
import { MEETING_DATA } from '@/constants/meetings';
import type { MeetingCollection, MeetingRecord } from '@/lib/types/meeting';
import {
  fadeInFromTop,
  fadeInFromBottom,
  fadeInFromLeft,
  fadeInFromRight,
  createTransition,
} from '@/lib/constants/animations';

interface DashboardAppProps {
  readonly initialMeetings?: MeetingCollection;
}

export const App: FC<DashboardAppProps> = ({ initialMeetings }) => {
  const meetingData = useMemo<MeetingCollection>(() => {
    return initialMeetings ?? MEETING_DATA.data;
  }, [initialMeetings]);

  const filteredMeetings = useMemo<MeetingRecord[]>(() => {
    return removeSelfMeetings(meetingData);
  }, [meetingData]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(99,91,255,0.24),_transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(0,212,255,0.22),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,_rgba(45,212,191,0.18),_transparent_60%)] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[-30%] h-[520px] bg-[linear-gradient(135deg,rgba(99,91,255,0.32),rgba(56,189,248,0.2),rgba(16,185,129,0.18))] opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:pt-16">
        <motion.div
          variants={fadeInFromTop}
          initial="initial"
          animate="animate"
          transition={createTransition()}
          className="mb-10 max-w-3xl text-center sm:text-left"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary shadow-[0_0_24px_rgba(99,91,255,0.35)] animate-[stripe-glow_6s_ease-in-out_infinite]">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary via-sky-400 to-cyan-300" />
            Live insights refreshed every sync
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-primary via-sky-400 to-primary bg-clip-text text-transparent [text-shadow:0_0_30px_rgba(99,91,255,0.45)]">
              Meeting insights
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Comprehensive analytics for your calendar data with a crisp, payments-inspired finish.
          </p>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.1)}
          className="mb-8"
        >
          <OverviewStats data={filteredMeetings} />
        </motion.div>

        {/* Recent Meetings */}
        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.15)}
          className="mb-8"
        >
          <RecentMeetings data={filteredMeetings} />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            variants={fadeInFromLeft}
            initial="initial"
            animate="animate"
            transition={createTransition(0.2)}
          >
            <MeetingStatusChart data={filteredMeetings} />
          </motion.div>
          
          <motion.div
            variants={fadeInFromRight}
            initial="initial"
            animate="animate"
            transition={createTransition(0.3)}
          >
            <DurationAnalysis data={filteredMeetings} />
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          variants={fadeInFromBottom}
          initial="initial"
          animate="animate"
          transition={createTransition(0.4)}
          className="mb-8"
        >
          <MeetingTimeline data={filteredMeetings} />
        </motion.div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            variants={fadeInFromLeft}
            initial="initial"
            animate="animate"
            transition={createTransition(0.5)}
          >
            <PlatformUsage data={filteredMeetings} />
          </motion.div>
          
          <motion.div
            variants={fadeInFromRight}
            initial="initial"
            animate="animate"
            transition={createTransition(0.6)}
          >
            <HostActivity data={filteredMeetings} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
