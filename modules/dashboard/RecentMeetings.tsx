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

  // Filter for accepted meetings, sort by start date (most recent first) and take top 3
  const recentMeetings = [...data]
    .filter((meeting) => meeting.status === 'accepted')
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
    .slice(0, 3);

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

  return (
    <>
      <Card className="border border-primary/10 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Meetings
          </CardTitle>
          <CardDescription>Your 3 most recent accepted meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMeetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedMeeting(meeting)}
                className="group flex cursor-pointer items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4 transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm truncate flex-1">{meeting.title}</h3>
                    <Badge
                      variant={new Date(meeting.start) > new Date() ? 'default' : 'secondary'}
                      className="shrink-0 text-xs"
                    >
                      {new Date(meeting.start) > new Date() ? 'upcoming' : 'past'}
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
                </div>
                
                <ChevronRight className="h-5 w-5 shrink-0 text-primary/70 transition-colors group-hover:text-primary" />
              </motion.div>
            ))}
          </div>
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
