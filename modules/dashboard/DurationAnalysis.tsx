'use client';

import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { MeetingRecord } from '@/lib/types/meeting';

interface DurationAnalysisProps {
  readonly data: readonly MeetingRecord[];
}

export function DurationAnalysis({ data }: DurationAnalysisProps) {
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600 dark:text-blue-400">●</span> Total: {data.total}
            </p>
            <p className="text-sm">
              <span className="text-green-600 dark:text-green-400">●</span> Accepted: {data.accepted}
            </p>
            <p className="text-sm">
              <span className="text-red-600 dark:text-red-400">●</span> Cancelled: {data.cancelled}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const averageDuration = data.reduce((acc, meeting) => acc + meeting.duration, 0) / data.length;
  const mostCommonDuration = Object.entries(durationGroups)
    .sort(([,a], [,b]) => b.total - a.total)[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Duration Analysis</CardTitle>
        <CardDescription>
          Distribution of meeting lengths and their success rates
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
                dataKey="duration" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="accepted" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="cancelled" stackId="a" fill="#EF4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-3 rounded-lg bg-muted/50"
          >
            <p className="text-sm text-muted-foreground">Average Duration</p>
            <p className="text-lg font-semibold">{averageDuration.toFixed(0)} minutes</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-3 rounded-lg bg-muted/50"
          >
            <p className="text-sm text-muted-foreground">Most Common</p>
            <p className="text-lg font-semibold">
              {mostCommonDuration[1].duration} min ({mostCommonDuration[1].total} meetings)
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
