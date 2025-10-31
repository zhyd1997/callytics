'use client';

import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { TooltipProps } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { MeetingRecord } from '@/lib/types/meeting';

interface MeetingStatusChartProps {
  readonly data: readonly MeetingRecord[];
}

interface CustomTooltipPayload {
  name: string;
  value: number;
  percentage: number;
}

const COLORS = {
  Accepted: 'var(--color-chart-1)',
  Cancelled: '#f87171',
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CustomTooltipPayload;
    return (
      <div className="rounded-lg border border-primary/20 bg-card/90 p-3 shadow-[0_8px_30px_rgba(249,115,22,0.15)] backdrop-blur">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {data.value} meetings ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export function MeetingStatusChart({ data }: MeetingStatusChartProps) {
  const statusCounts = data.reduce((acc, meeting) => {
    acc[meeting.status] = (acc[meeting.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    percentage: Math.round((count / data.length) * 100),
  }));

  return (
    <Card className="border border-primary/10 bg-card/80 backdrop-blur">
      <CardHeader className="relative">
        <span className="pointer-events-none absolute -left-12 top-6 hidden h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.1),_transparent_70%)] sm:block" />
        <CardTitle>Meeting Status Distribution</CardTitle>
        <CardDescription>
          Breakdown of accepted vs cancelled meetings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm backdrop-blur"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.value} ({item.percentage}%)
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
