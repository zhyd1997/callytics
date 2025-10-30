'use client';

import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedNumber } from './AnimatedNumber';
import type { MeetingRecord } from '@/lib/types/meeting';

interface OverviewStatsProps {
  readonly data: readonly MeetingRecord[];
}

export function OverviewStats({ data }: OverviewStatsProps) {
  const totalMeetings = data.length;
  const acceptedMeetings = data.filter(meeting => meeting.status === 'accepted').length;
  const cancelledMeetings = data.filter(meeting => meeting.status === 'cancelled').length;
  const totalHours = data.reduce((acc, meeting) => acc + meeting.duration, 0) / 60;
  const acceptanceRate = totalMeetings > 0 ? Math.round((acceptedMeetings / totalMeetings) * 100) : 0;

  const stats = [
    {
      title: 'Total Meetings',
      numericValue: totalMeetings,
      suffix: '',
      decimals: 0,
      icon: Calendar,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/15 border border-primary/20 shadow-[0_0_25px_rgba(249,115,22,0.35)]',
    },
    {
      title: 'Accepted',
      numericValue: acceptedMeetings,
      suffix: '',
      decimals: 0,
      icon: CheckCircle,
      iconColor: 'text-[#facc15]',
      iconBg: 'bg-[#facc15]/15 border border-[#facc15]/30 shadow-[0_0_20px_rgba(250,204,21,0.35)]',
      extraInfo: acceptanceRate,
    },
    {
      title: 'Cancelled',
      numericValue: cancelledMeetings,
      suffix: '',
      decimals: 0,
      icon: XCircle,
      iconColor: 'text-[#f87171]',
      iconBg: 'bg-[#f87171]/15 border border-[#f87171]/30 shadow-[0_0_18px_rgba(248,113,113,0.35)]',
    },
    {
      title: 'Total Hours',
      numericValue: totalHours,
      suffix: 'h',
      decimals: 1,
      icon: Clock,
      iconColor: 'text-[#a855f7]',
      iconBg: 'bg-[#a855f7]/15 border border-[#a855f7]/30 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden border border-primary/10 bg-card/80 backdrop-blur">
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.08),_transparent_70%)] opacity-60" />
            <CardContent className="relative z-[1] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-lg sm:text-2xl">
                    <AnimatedNumber
                      value={stat.numericValue}
                      decimals={stat.decimals}
                      duration={1.5}
                    />
                    {stat.suffix}
                  </p>
                  {stat.extraInfo !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <AnimatedNumber value={stat.extraInfo} duration={1.5} />% rate
                    </p>
                  )}
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${stat.iconBg}`}>
                  <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
