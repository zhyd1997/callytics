'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { MeetingDetails } from './MeetingDetails';
import type { MeetingRecord } from '@/lib/types/meeting';

interface RecentMeetingsProps {
  readonly data: readonly MeetingRecord[];
}

export function RecentMeetings({ data }: RecentMeetingsProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter out completed meetings with future dates (invalid data)
  const now = new Date();
  const validMeetings = [...data].filter(meeting => {
    const meetingStart = new Date(meeting.start);
    // Completed meetings must have past dates
    if (meeting.status === 'completed' && meetingStart > now) {
      return false;
    }
    return true;
  });

  // Sort meetings by start date (most recent first) and take top 5
  // Ensure at least one cancelled meeting is included if available
  const sortedMeetings = validMeetings
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
  
  const top5 = sortedMeetings.slice(0, 5);
  const hasCancelledInTop5 = top5.some(meeting => meeting.status === 'cancelled');
  
  let recentMeetings = top5;
  
  // If no cancelled meeting in top 5, find the most recent cancelled meeting and replace the oldest one
  if (!hasCancelledInTop5) {
    const mostRecentCancelled = sortedMeetings.find(meeting => meeting.status === 'cancelled');
    if (mostRecentCancelled) {
      // Replace the oldest meeting (last in the array) with the cancelled one
      recentMeetings = [...top5.slice(0, 4), mostRecentCancelled]
        .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcomingAccepted = (meeting: MeetingRecord) => {
    const now = new Date();
    const meetingStart = new Date(meeting.start);
    return meeting.status === 'accepted' && meetingStart > now;
  };

  const getBadgeProps = (status: string) => {
    switch (status) {
      case 'accepted':
        return {
          variant: 'default' as const,
          className: 'shrink-0 text-xs bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-400',
        };
      case 'cancelled':
        return {
          variant: 'destructive' as const,
          className: 'shrink-0 text-xs',
        };
      case 'completed':
        return {
          variant: 'secondary' as const,
          className: 'shrink-0 text-xs bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
        };
      case 'pending':
        return {
          variant: 'outline' as const,
          className: 'shrink-0 text-xs bg-yellow-500/10 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400',
        };
      case 'rejected':
        return {
          variant: 'destructive' as const,
          className: 'shrink-0 text-xs',
        };
      case 'rescheduled':
        return {
          variant: 'outline' as const,
          className: 'shrink-0 text-xs bg-orange-500/10 text-orange-700 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400',
        };
      case 'upcoming':
        return {
          variant: 'outline' as const,
          className: 'shrink-0 text-xs bg-cyan-500/10 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-400',
        };
      case 'recurring':
        return {
          variant: 'outline' as const,
          className: 'shrink-0 text-xs bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400',
        };
      case 'past':
        return {
          variant: 'secondary' as const,
          className: 'shrink-0 text-xs bg-gray-500/10 text-gray-700 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400',
        };
      case 'unconfirmed':
        return {
          variant: 'outline' as const,
          className: 'shrink-0 text-xs bg-gray-500/10 text-gray-700 border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-400',
        };
      default:
        return {
          variant: 'secondary' as const,
          className: 'shrink-0 text-xs',
        };
    }
  };

  return (
    <>
      <Card className="border border-primary/10 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Meetings
          </CardTitle>
          <CardDescription>Your 5 most recent meetings</CardDescription>
        </CardHeader>
        <CardContent>
          {recentMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground/40 mb-4" />
              <p className="text-sm text-muted-foreground">No recent meetings</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Your meetings will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMeetings.map((meeting, index) => {
                const upcomingAccepted = isUpcomingAccepted(meeting);
                return (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedMeeting(meeting)}
                  className={`group flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors ${
                    upcomingAccepted
                      ? 'border-2 border-primary/60 bg-primary/10 shadow-md shadow-primary/20 hover:border-primary/80 hover:bg-primary/15'
                      : 'border border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm truncate flex-1">{meeting.title}</h3>
                      <Badge {...getBadgeProps(meeting.reschedulingReason ? 'rescheduled' : meeting.status)}>
                        {meeting.reschedulingReason ? 'rescheduled' : meeting.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(meeting.start)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(meeting.start)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {meeting.hosts[0]?.name || 'Unknown'}
                      </div>
                    </div>
                    {/* Rescheduling/Cancellation Reason */}
                    {meeting.reschedulingReason || meeting.cancellationReason ? (
                      <div className="mt-2 text-xs text-muted-foreground/80 italic">
                        {meeting.reschedulingReason
                          ? `Rescheduled: ${meeting.reschedulingReason}`
                          : meeting.cancellationReason
                          ? `Cancelled: ${meeting.cancellationReason}`
                          : null}
                      </div>
                    ) : null}
                  </div>
                  
                  <ChevronRight className="h-5 w-5 shrink-0 text-primary/70 transition-colors group-hover:text-primary" />
                </motion.div>
              );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile: Drawer */}
      {isMobile && (
        <Drawer open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Meeting Details</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8 overflow-y-auto max-h-[80vh]">
              {selectedMeeting && <MeetingDetails meeting={selectedMeeting} />}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Desktop: Dialog */}
      {!isMobile && (
        <Dialog open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Meeting Details</DialogTitle>
            </DialogHeader>
            {selectedMeeting && <MeetingDetails meeting={selectedMeeting} />}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
