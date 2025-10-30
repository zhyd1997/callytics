'use client';

import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Monitor, Globe } from 'lucide-react';
import type { MeetingRecord } from '@/lib/types/meeting';

interface PlatformUsageProps {
  readonly data: readonly MeetingRecord[];
}

export function PlatformUsage({ data }: PlatformUsageProps) {
  // Extract platform from meeting URL
  const getPlatform = (url: string) => {
    if (url.includes('meet.google.com')) return 'Google Meet';
    if (url.includes('zoom.us')) return 'Zoom';
    if (url.includes('app.cal.com')) return 'Cal.com Video';
    if (url.includes('meeting.dingtalk.com')) return 'DingTalk';
    return 'Other';
  };

  const platformCounts = data.reduce((acc, meeting) => {
    const platform = getPlatform(meeting.meetingUrl || meeting.location);
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(platformCounts)
    .map(([platform, count]) => ({
      platform,
      count,
      percentage: Math.round((count / data.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Google Meet':
        return Globe;
      case 'Zoom':
        return Video;
      case 'Cal.com Video':
        return Monitor;
      default:
        return Video;
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      'Google Meet': 'var(--color-chart-1)',
      'Zoom': '#a855f7',
      'Cal.com Video': '#facc15',
      'DingTalk': '#fb923c',
      'Other': '#f87171',
    };
    return colors[platform as keyof typeof colors] || '#6B7280';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-primary/20 bg-card/90 p-3 shadow-[0_8px_30px_rgba(249,115,22,0.15)] backdrop-blur">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-sm text-muted-foreground">
            {data.count} meetings ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const mostUsedPlatform = chartData[0];

  return (
    <Card className="border border-primary/10 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle>Platform Usage</CardTitle>
        <CardDescription>
          Distribution of meeting platforms used
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[300px] w-full mb-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="platform" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
                fill="var(--color-chart-1)"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="space-y-3">
          {chartData.map((item, index) => {
            const Icon = getPlatformIcon(item.platform);
            return (
              <motion.div
                key={item.platform}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="rounded-lg border border-transparent p-2 shadow-[0_0_25px_rgba(249,115,22,0.18)]"
                    style={{ backgroundColor: `${getPlatformColor(item.platform)}33` }}
                  >
                    <Icon 
                      className="h-4 w-4" 
                      style={{ color: getPlatformColor(item.platform) }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.platform}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.count} meetings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.percentage}%</p>
                  <div className="w-16 h-2 bg-muted rounded-full mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: getPlatformColor(item.platform)
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur"
        >
          <p className="text-sm text-muted-foreground mb-1">Most Used Platform</p>
          <p className="font-semibold">
            {mostUsedPlatform?.platform} ({mostUsedPlatform?.count} meetings)
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
