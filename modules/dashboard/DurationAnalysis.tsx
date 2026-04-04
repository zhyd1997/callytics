"use client";

import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { MeetingRecord } from '@/lib/types/meeting';
import { scaleIn, fadeInFromBottom, createTransition } from '@/lib/constants/animations';
import { WidgetEmptyState } from './WidgetEmptyState';

interface DurationAnalysisProps {
  readonly data: readonly MeetingRecord[];
}

interface CustomTooltipPayload {
  duration: string;
  total: number;
  accepted: number;
  cancelled: number;
  sortKey: number;
}

interface CustomTooltipPropsType {
  active?: boolean;
  payload?: Array<{ payload: CustomTooltipPayload }>;
  label?: string;
}

const CustomTooltip = (props: CustomTooltipPropsType) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload as CustomTooltipPayload;
    return (
      <div className="rounded-lg border border-primary/20 bg-card/90 p-3 shadow-[0_8px_30px_rgba(249,115,22,0.15)] backdrop-blur">
        <p className="font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span style={{ color: 'var(--color-chart-1)' }}>●</span> Total: {data.total}
          </p>
          <p className="text-sm">
            <span style={{ color: 'var(--color-chart-1)' }}>●</span> Accepted: {data.accepted}
          </p>
          <p className="text-sm">
            <span style={{ color: '#f87171' }}>●</span> Cancelled: {data.cancelled}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function DurationAnalysis({ data }: DurationAnalysisProps) {
  if (data.length === 0) {
    return (
      <Card className="surface-tertiary">
        <CardHeader>
          <CardTitle>Meeting Duration Analysis</CardTitle>
          <CardDescription>No duration data is visible in the current slice.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <WidgetEmptyState
            title="Duration analysis is empty"
            description="Widen the current filters to compare meeting lengths and success patterns."
          />
        </CardContent>
      </Card>
    );
  }

  // Group meetings by duration
  const durationGroups = data.reduce((acc, meeting) => {
    const duration = meeting.duration;
    const key = `${duration} min`;
    
    if (!acc[key]) {
      acc[key] = { duration, total: 0, accepted: 0, cancelled: 0 };
    }
    
    acc[key].total += 1;
    if (meeting.status === 'accepted') {
      acc[key].accepted += 1;
    } else if (meeting.status === 'cancelled') {
      acc[key].cancelled += 1;
    }
    
    return acc;
  }, {} as Record<string, { duration: number; total: number; accepted: number; cancelled: number }>);

  const chartData = Object.entries(durationGroups)
    .map(([key, value]) => ({
      duration: key,
      total: value.total,
      accepted: value.accepted,
      cancelled: value.cancelled,
      sortKey: value.duration,
    }))
    .sort((a, b) => a.sortKey - b.sortKey);

  const averageDuration = data.length
    ? data.reduce((acc, meeting) => acc + meeting.duration, 0) / data.length
    : 0;
  const mostCommonDurationEntry = Object.entries(durationGroups)
    .sort(([, a], [, b]) => b.total - a.total)[0];
  const mostCommonDurationLabel = mostCommonDurationEntry?.[0] ?? 'N/A';
  const mostCommonDurationStats = mostCommonDurationEntry?.[1];

  return (
    <Card className="surface-tertiary">
      <CardHeader>
        <CardTitle>Meeting Duration Analysis</CardTitle>
        <CardDescription>
          Distribution of meeting lengths and their success rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          transition={createTransition()}
          className="h-[220px] w-full mb-4 sm:h-[260px] lg:h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="duration"
                tick={{ fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="accepted" stackId="a" fill="var(--color-chart-1)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="cancelled" stackId="a" fill="#f87171" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            variants={fadeInFromBottom}
            initial="initial"
            animate="animate"
            transition={createTransition(0.1)}
            className="rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur"
          >
            <p className="text-sm text-muted-foreground">Average Duration</p>
            <p className="text-lg font-semibold">{averageDuration.toFixed(0)} minutes</p>
          </motion.div>
          
          <motion.div
            variants={fadeInFromBottom}
            initial="initial"
            animate="animate"
            transition={createTransition(0.2)}
            className="rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur"
          >
            <p className="text-sm text-muted-foreground">Most Common</p>
            <p className="text-lg font-semibold">
              {mostCommonDurationStats ? `${mostCommonDurationStats.duration} min (${mostCommonDurationStats.total} meetings)` : mostCommonDurationLabel}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
