'use client';

import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, Video, BarChart3, TrendingUp, Moon, Sun, LogOut } from 'lucide-react';
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

interface DashboardAppProps {
  readonly initialMeetings?: MeetingCollection;
}

export const App: FC<DashboardAppProps> = ({ initialMeetings }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const meetingData = useMemo<MeetingCollection>(() => {
    return initialMeetings ?? MEETING_DATA.data;
  }, [initialMeetings]);

  const filteredMeetings = useMemo<MeetingRecord[]>(() => {
    return removeSelfMeetings(meetingData);
  }, [meetingData]);

  const handleLogin = () => {
    setIsAuthorized(true);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
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
    <div className={`min-h-screen bg-background transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl mb-2">Meeting Insights</h1>
            <p className="text-muted-foreground">Comprehensive analytics for your calendar data</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto">
            <ModeToggle />
            {/*<Button*/}
            {/*  onClick={handleLogout}*/}
            {/*  variant="outline"*/}
            {/*  className="gap-2 shrink-0"*/}
            {/*>*/}
            {/*  <LogOut className="h-4 w-4" />*/}
            {/*  Logout*/}
            {/*</Button>*/}
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
