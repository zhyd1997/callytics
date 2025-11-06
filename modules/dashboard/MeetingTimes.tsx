'use client';

import { motion } from 'motion/react';
import { Sunrise, Coffee, Moon, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedNumber } from './AnimatedNumber';
import type { MeetingRecord } from '@/lib/types/meeting';
import { fadeInFromBottom, createTransition } from '@/lib/constants/animations';

interface MeetingTimesProps {
  readonly data: readonly MeetingRecord[];
}

type TimeCategory = 'morning' | 'afternoon' | 'evening' | 'night';

interface TimeCategoryData {
  readonly label: string;
  readonly timeRange: string;
  readonly count: number;
  readonly percentage: number;
  readonly icon: typeof Sunrise;
  readonly iconColor: string;
  readonly iconBg: string;
  readonly progressColor: string;
}

const getTimeCategory = (startTime: string): TimeCategory => {
  const date = new Date(startTime);
  const hour = date.getHours();
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export function MeetingTimes({ data }: MeetingTimesProps) {
  const timeCategories = data.reduce((acc, meeting) => {
    const category = getTimeCategory(meeting.start);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<TimeCategory, number>);

  const totalMeetings = data.length;

  const categoryData: Record<TimeCategory, TimeCategoryData> = {
    morning: {
      label: 'Morning',
      timeRange: '6AM - 12PM',
      count: timeCategories.morning || 0,
      percentage: totalMeetings > 0 ? Math.round(((timeCategories.morning || 0) / totalMeetings) * 100) : 0,
      icon: Sunrise,
      iconColor: 'text-[#facc15]',
      iconBg: 'bg-[#facc15]/15 border border-[#facc15]/30',
      progressColor: '#f97316',
    },
    afternoon: {
      label: 'Afternoon',
      timeRange: '12PM - 5PM',
      count: timeCategories.afternoon || 0,
      percentage: totalMeetings > 0 ? Math.round(((timeCategories.afternoon || 0) / totalMeetings) * 100) : 0,
      icon: Coffee,
      iconColor: 'text-[#f97316]',
      iconBg: 'bg-[#f97316]/15 border border-[#f97316]/30',
      progressColor: '#f97316',
    },
    evening: {
      label: 'Evening',
      timeRange: '5PM - 9PM',
      count: timeCategories.evening || 0,
      percentage: totalMeetings > 0 ? Math.round(((timeCategories.evening || 0) / totalMeetings) * 100) : 0,
      icon: Moon,
      iconColor: 'text-[#a855f7]',
      iconBg: 'bg-[#a855f7]/15 border border-[#a855f7]/30',
      progressColor: '#a855f7',
    },
    night: {
      label: 'Night',
      timeRange: '9PM - 6AM',
      count: timeCategories.night || 0,
      percentage: totalMeetings > 0 ? Math.round(((timeCategories.night || 0) / totalMeetings) * 100) : 0,
      icon: Clock,
      iconColor: 'text-muted-foreground',
      iconBg: 'bg-muted/15 border border-muted/30',
      progressColor: '#6b7280',
    },
  };

  const categories: TimeCategory[] = ['morning', 'afternoon', 'evening', 'night'];

  return (
    <Card className="border border-primary/10 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle>Meeting Times</CardTitle>
        <CardDescription>
          Distribution of meetings across different times of day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => {
            const categoryInfo = categoryData[category];
            const Icon = categoryInfo.icon;
            
            return (
              <motion.div
                key={category}
                variants={fadeInFromBottom}
                initial="initial"
                animate="animate"
                transition={createTransition(index * 0.1)}
                className="flex items-center gap-4"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${categoryInfo.iconBg} shadow-[0_0_20px_rgba(249,115,22,0.15)]`}>
                  <Icon className={`h-5 w-5 ${categoryInfo.iconColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">{categoryInfo.label}</p>
                      <p className="text-xs text-muted-foreground">{categoryInfo.timeRange}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-sm sm:text-base">
                        <AnimatedNumber value={categoryInfo.count} duration={1.5} />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <AnimatedNumber value={categoryInfo.percentage} duration={1.5} />%
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${categoryInfo.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: categoryInfo.progressColor }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

