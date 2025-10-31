'use client';

import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import type { MeetingRecord } from '@/lib/types/meeting';

interface MeetingTimelineProps {
  readonly data: readonly MeetingRecord[];
}

interface TooltipPayloadEntry {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipPropsType {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}

const CustomTooltip = (props: CustomTooltipPropsType) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-primary/20 bg-card/90 p-3 shadow-[0_8px_30px_rgba(249,115,22,0.15)] backdrop-blur">
        <p className="mb-2 font-medium">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: TooltipPayloadEntry, index: number) => {
            return (
              <p key={index} className="text-sm">
                <span style={{ color: entry.color }}>●</span> {entry.name}: {entry.value}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export function MeetingTimeline({ data }: MeetingTimelineProps) {
  // Group meetings by month
  const monthlyData = data.reduce((acc, meeting) => {
    const date = new Date(meeting.start);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        total: 0,
        accepted: 0,
        cancelled: 0,
        sortKey: monthKey,
      };
    }
    
    acc[monthKey].total += 1;
    if (meeting.status === 'accepted') {
      acc[monthKey].accepted += 1;
    } else if (meeting.status === 'cancelled') {
      acc[monthKey].cancelled += 1;
    }
    
    return acc;
  }, {} as Record<string, { month: string; total: number; accepted: number; cancelled: number; sortKey: string }>);

  const timelineData = Object.values(monthlyData)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const totalMeetings = timelineData.reduce((sum, month) => sum + month.total, 0);
  const avgPerMonth = timelineData.length ? totalMeetings / timelineData.length : 0;
  const trend = timelineData.length > 1 
    ? timelineData[timelineData.length - 1].total - timelineData[0].total
    : 0;
  const peakMonth = timelineData.length
    ? timelineData.reduce((max, month) => (month.total > max.total ? month : max), timelineData[0])
    : undefined;

  return (
    <Card className="border border-primary/10 bg-card/80 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Meeting Timeline</CardTitle>
            <CardDescription>
              Monthly meeting activity over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-4 w-4 ${trend >= 0 ? 'text-primary' : 'text-[#f87171]'}`} />
            <span className={`text-sm font-medium ${trend >= 0 ? 'text-primary' : 'text-[#f87171]'}`}>
              {trend >= 0 ? '+' : ''}{trend} trend
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[300px] w-full mb-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="var(--color-chart-1)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-chart-1)', strokeWidth: 2, r: 4 }}
                name="Total Meetings"
              />
              <Line 
                type="monotone" 
                dataKey="accepted" 
                stroke="#facc15" 
                strokeWidth={2}
                dot={{ fill: '#facc15', strokeWidth: 2, r: 4 }}
                name="Accepted"
              />
              <Line 
                type="monotone" 
                dataKey="cancelled" 
                stroke="#f87171" 
                strokeWidth={2}
                dot={{ fill: '#f87171', strokeWidth: 2, r: 4 }}
                name="Cancelled"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur"
          >
            <p className="text-sm text-muted-foreground">Total Months</p>
            <p className="text-lg font-semibold">{timelineData.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur"
          >
            <p className="text-sm text-muted-foreground">Avg per Month</p>
            <p className="text-lg font-semibold">{avgPerMonth.toFixed(1)}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur"
          >
            <p className="text-sm text-muted-foreground">Peak Month</p>
            <p className="text-lg font-semibold">
              {peakMonth?.month ?? 'N/A'}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
