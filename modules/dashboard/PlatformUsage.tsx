'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { MeetingRecord } from '@/lib/types/meeting';
import { WidgetEmptyState } from './WidgetEmptyState';

interface PlatformUsageProps {
  readonly data: readonly MeetingRecord[];
}

interface CustomTooltipPayload {
  platform: string;
  count: number;
  percentage: number;
}

interface CustomTooltipPropsType {
  active?: boolean;
  payload?: Array<{ payload: CustomTooltipPayload }>;
  label?: string;
}

const PLATFORM_ICON_MAP: Record<string, { light: string; dark?: string; alt: string }> = {
  'Google Meet': {
    light: '/platforms/Meet_Icon.original.png',
    alt: 'Google Meet logo',
  },
  Zoom: {
    light: '/platforms/Zoom_Logo_Bloom_RGB.svg',
    alt: 'Zoom logo',
  },
  'Cal.com Video': {
    light: '/platforms/cal-logo-light.jpeg',
    dark: '/platforms/cal-logo-dark.jpeg',
    alt: 'Cal.com logo',
  },
  Other: {
    light: '/logo/callytics-logo-light.png',
    dark: '/logo/callytics-logo-dark.png',
    alt: 'Other platform logo',
  },
};

const CustomTooltip = (props: CustomTooltipPropsType) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload as CustomTooltipPayload;
    return (
      <div className="rounded-xl border border-primary/15 bg-card/92 p-3 shadow-lg backdrop-blur">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {data.count} meetings ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export function PlatformUsage({ data }: PlatformUsageProps) {
  const { resolvedTheme } = useTheme();

  if (data.length === 0) {
    return (
      <Card className="surface-tertiary">
        <CardHeader>
          <CardTitle>Platform Usage</CardTitle>
          <CardDescription>No platform distribution is visible in the current slice.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <WidgetEmptyState
            title="Platform usage is empty"
            description="Update the current filters to compare where meetings are actually happening."
          />
        </CardContent>
      </Card>
    );
  }

  const getPlatform = (url: string) => {
    if (url.includes('meet.google.com')) return 'Google Meet';
    if (url.includes('zoom.us')) return 'Zoom';
    if (url.includes('app.cal.com')) return 'Cal.com Video';
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
    const iconConfig = PLATFORM_ICON_MAP[platform] ?? PLATFORM_ICON_MAP.Other;
    const isDark = resolvedTheme === 'dark';
    const src = isDark && iconConfig.dark ? iconConfig.dark : iconConfig.light;

    return {
      src,
      alt: iconConfig.alt,
    };
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      'Google Meet': 'var(--color-chart-2)',
      'Zoom': 'var(--color-chart-3)',
      'Cal.com Video': 'var(--color-accent)',
      'Other': '#f87171',
    };
    return colors[platform as keyof typeof colors] || '#6B7280';
  };

  const mostUsedPlatform = chartData[0];

  return (
    <Card className="surface-tertiary">
      <CardHeader>
        <CardTitle>Platform Usage</CardTitle>
        <CardDescription>
          Distribution of meeting platforms used
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="h-[220px] w-full mb-3 sm:h-[260px] sm:mb-4 lg:h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="platform"
                tick={{ fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                fill="var(--color-chart-1)"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="space-y-2 sm:space-y-3">
          {chartData.map((item, index) => {
            const icon = getPlatformIcon(item.platform);
            return (
              <motion.div
                key={item.platform}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-primary/12 bg-primary/4 p-2.5 backdrop-blur sm:rounded-2xl sm:p-3"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/30 bg-muted/30 sm:h-10 sm:w-10"
                  >
                    <Image
                      src={icon.src}
                      alt={icon.alt}
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain rounded sm:h-7 sm:w-7"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.platform}</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {item.count} meetings
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{item.percentage}%</p>
                  <div className="w-12 h-1.5 bg-muted rounded-full mt-1 sm:w-16 sm:h-2">
                    <div
                      className="h-full rounded-full transition-all"
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-3 rounded-xl border border-primary/12 bg-primary/4 p-2.5 backdrop-blur sm:mt-4 sm:rounded-2xl sm:p-3"
        >
          <p className="text-xs text-muted-foreground sm:text-sm">Most Used Platform</p>
          <p className="text-sm font-semibold sm:text-base">
            {mostUsedPlatform?.platform} ({mostUsedPlatform?.count} meetings)
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
