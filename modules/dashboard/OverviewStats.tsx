'use client';

import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedNumber } from './AnimatedNumber';
import type { Meeting } from '@/lib/types/meeting';

interface OverviewStatsProps {
  data: Meeting[];
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
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Accepted',
      numericValue: acceptedMeetings,
      suffix: '',
      decimals: 0,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      extraInfo: acceptanceRate,
    },
    {
      title: 'Cancelled',
      numericValue: cancelledMeetings,
      suffix: '',
      decimals: 0,
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Total Hours',
      numericValue: totalHours,
      suffix: 'h',
      decimals: 1,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
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
          <Card className="relative overflow-hidden">
            <CardContent className="p-4 sm:p-6">
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
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
