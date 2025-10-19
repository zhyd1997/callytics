'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Calendar, Clock } from 'lucide-react';
import type { Meeting } from '@/lib/types/meeting';

interface HostActivityProps {
  data: Meeting[];
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
    <Card>
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
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
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
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex-shrink-0 min-w-[200px] w-full sm:w-auto sm:max-w-[200px]"
          >
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex-shrink-0">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
            className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 flex-1 min-w-[200px]"
          >
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40 flex-shrink-0">
              <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
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
            className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 w-full min-w-[200px]"
          >
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex-shrink-0">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
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