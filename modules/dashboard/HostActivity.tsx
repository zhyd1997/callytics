'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Calendar, Clock } from 'lucide-react';
import type { MeetingRecord } from '@/lib/types/meeting';

interface HostActivityProps {
  readonly data: readonly MeetingRecord[];
}

export function HostActivity({ data }: HostActivityProps) {
  // Aggregate host statistics
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
    .slice(0, 6); // Show top 6 hosts

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
    <Card className="border border-primary/10 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle>Host Activity</CardTitle>
        <CardDescription>
          Top hosts by meeting count and activity metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {sortedHosts.map((host, index) => (
            <motion.div
              key={host.email}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3 transition-colors hover:border-primary/40 hover:bg-primary/10"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm">
                    {getInitials(host.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{host.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {host.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center hidden sm:block">
                  <p className="font-semibold">{host.totalMeetings}</p>
                  <p className="text-muted-foreground">meetings</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="font-semibold">{(host.totalDuration / 60).toFixed(1)}h</p>
                  <p className="text-muted-foreground">total</p>
                </div>
                <div className="text-center">
                  <Badge 
                    variant={getSuccessRate(host.acceptedMeetings, host.totalMeetings) >= 80 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {getSuccessRate(host.acceptedMeetings, host.totalMeetings)}%
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">success</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="flex flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="flex min-w-[200px] w-full flex-shrink-0 items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-3 text-primary shadow-[0_0_25px_rgba(249,115,22,0.18)] backdrop-blur sm:w-auto sm:max-w-[200px]"
          >
            <div className="flex-shrink-0 rounded-lg border border-primary/20 bg-primary/15 p-2">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Total Hosts</p>
              <p className="font-semibold">{totalHosts}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="flex min-w-[200px] flex-1 items-center gap-3 rounded-lg border border-[#facc15]/40 bg-[#facc15]/15 p-3 text-[#f59e0b] shadow-[0_0_25px_rgba(250,204,21,0.22)] backdrop-blur"
          >
            <div className="flex-shrink-0 rounded-lg border border-[#facc15]/30 bg-[#facc15]/25 p-2">
              <Calendar className="h-4 w-4 text-[#f59e0b]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Most Active</p>
              <p className="font-semibold text-xs sm:text-sm truncate" title={mostActiveHost?.name}>
                {mostActiveHost?.name}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="flex min-w-[200px] w-full items-center gap-3 rounded-lg border border-[#a855f7]/40 bg-[#a855f7]/20 p-3 text-[#c084fc] shadow-[0_0_25px_rgba(168,85,247,0.25)] backdrop-blur"
          >
            <div className="flex-shrink-0 rounded-lg border border-[#a855f7]/30 bg-[#a855f7]/25 p-2">
              <Clock className="h-4 w-4 text-[#c084fc]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="font-semibold">{totalHostHours.toFixed(1)}h</p>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
