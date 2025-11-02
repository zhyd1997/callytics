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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.16),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_transparent_70%)]" />
      <div className="pointer-events-none absolute right-[-18%] top-32 h-[420px] w-[420px] rounded-full bg-[conic-gradient(from_140deg,_rgba(14,165,233,0.28),_transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute left-[-12%] bottom-[-20%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_bottom,_rgba(12,74,110,0.18),_transparent_60%)] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:pt-16">
        <motion.div
          variants={fadeInFromTop}
          initial="initial"
          animate="animate"
          transition={createTransition()}
          className="mb-10 max-w-3xl text-center sm:text-left"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            Cal.com overview
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Meeting intelligence that mirrors Cal.com
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Focus your operations reviews on signal, not noise. Surface booking momentum, host load, and event type velocity in a presentation layer that feels native to Cal.com.
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
