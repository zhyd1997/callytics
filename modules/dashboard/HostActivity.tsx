'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Calendar, Clock } from 'lucide-react';
import type { MeetingRecord } from '@/lib/types/meeting';
import { WidgetEmptyState } from './WidgetEmptyState';

interface HostActivityProps {
  readonly data: readonly MeetingRecord[];
}

export function HostActivity({ data }: HostActivityProps) {
  if (data.length === 0) {
    return (
      <Card className="surface-tertiary">
        <CardHeader>
          <CardTitle>Host Activity</CardTitle>
          <CardDescription>No host activity is visible in the current slice.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <WidgetEmptyState
            title="Host activity is empty"
            description="Widen the current filters to compare workload, success rate, and meeting time across hosts."
          />
        </CardContent>
      </Card>
    );
  }

  const hostStats = data.reduce((acc, meeting) => {
    meeting.hosts.forEach(host => {
      if (!acc[host.email]) {
        acc[host.email] = {
          name: host.name,
          email: host.email,
          totalMeetings: 0,
          acceptedMeetings: 0,
          cancelledMeetings: 0,
          totalDuration: 0,
        };
      }

      acc[host.email].totalMeetings += 1;
      acc[host.email].totalDuration += meeting.duration;

      if (meeting.status === 'accepted') {
        acc[host.email].acceptedMeetings += 1;
      } else if (meeting.status === 'cancelled') {
        acc[host.email].cancelledMeetings += 1;
      }
    });

    return acc;
  }, {} as Record<string, {
    name: string;
    email: string;
    totalMeetings: number;
    acceptedMeetings: number;
    cancelledMeetings: number;
    totalDuration: number;
  }>);

  const sortedHosts = Object.values(hostStats)
    .sort((a, b) => b.totalMeetings - a.totalMeetings)
    .slice(0, 6);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSuccessRate = (accepted: number, total: number) => {
    return total > 0 ? Math.round((accepted / total) * 100) : 0;
  };

  const totalHosts = Object.keys(hostStats).length;
  const mostActiveHost = sortedHosts[0];
  const totalHostHours = Object.values(hostStats).reduce((sum, host) => sum + host.totalDuration, 0) / 60;

  return (
    <Card className="surface-tertiary">
      <CardHeader>
        <CardTitle>Host Activity</CardTitle>
        <CardDescription>
          Top hosts by meeting count and activity metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4 sm:space-y-3 sm:mb-6">
          {sortedHosts.map((host, index) => (
            <motion.div
              key={host.email}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-primary/15 bg-primary/4 p-2.5 transition-colors hover:border-primary/30 hover:bg-primary/8 sm:rounded-2xl sm:p-3"
            >
              <div className="flex items-center gap-2.5 min-w-0 sm:gap-3">
                <Avatar className="h-8 w-8 shrink-0 sm:h-10 sm:w-10">
                  <AvatarFallback className="text-xs sm:text-sm">
                    {getInitials(host.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{host.name}</p>
                  <p className="text-xs text-muted-foreground truncate sm:text-sm">
                    <span className="sm:hidden">{host.totalMeetings} mtgs</span>
                    <span className="hidden sm:inline">{host.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-sm sm:gap-4">
                <div className="hidden text-center sm:block">
                  <p className="font-semibold">{host.totalMeetings}</p>
                  <p className="text-xs text-muted-foreground">meetings</p>
                </div>
                <div className="hidden text-center md:block">
                  <p className="font-semibold">{(host.totalDuration / 60).toFixed(1)}h</p>
                  <p className="text-xs text-muted-foreground">total</p>
                </div>
                <div className="text-center">
                  <Badge
                    variant={getSuccessRate(host.acceptedMeetings, host.totalMeetings) >= 80 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {getSuccessRate(host.acceptedMeetings, host.totalMeetings)}%
                  </Badge>
                  <p className="text-[0.6rem] text-muted-foreground mt-0.5 sm:text-xs sm:mt-1">success</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="rounded-xl border border-primary/20 bg-primary/6 p-2.5 sm:rounded-2xl sm:p-3"
          >
            <Users className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
            <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">Total Hosts</p>
            <p className="text-sm font-semibold sm:text-base">{totalHosts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="rounded-xl border border-accent/20 bg-accent/6 p-2.5 sm:rounded-2xl sm:p-3"
          >
            <Calendar className="h-3.5 w-3.5 text-accent sm:h-4 sm:w-4" />
            <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">Most Active</p>
            <p className="text-xs font-semibold truncate sm:text-sm" title={mostActiveHost?.name}>
              {mostActiveHost?.name}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="rounded-xl border border-chart-5/20 bg-chart-5/6 p-2.5 sm:rounded-2xl sm:p-3"
          >
            <Clock className="h-3.5 w-3.5 text-chart-5 sm:h-4 sm:w-4" />
            <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">Total Hours</p>
            <p className="text-sm font-semibold sm:text-base">{totalHostHours.toFixed(1)}h</p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
