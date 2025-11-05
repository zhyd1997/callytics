import { Calendar, Clock, Users, Video, CheckCircle, XCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { MeetingRecord } from '@/lib/types/meeting';

interface MeetingDetailsProps {
  readonly meeting: MeetingRecord;
}

export function MeetingDetails({ meeting }: MeetingDetailsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const getPlatformName = (url: string) => {
    if (url.includes('meet.google.com')) return 'Google Meet';
    if (url.includes('zoom.us')) return 'Zoom';
    if (url.includes('app.cal.com')) return 'Cal.com Video';
    return 'Other';
  };

  return (
    <div className="space-y-6">
      {/* Title and Status */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="text-2xl flex-1">{meeting.title}</h2>
          <Badge
            variant={meeting.status === 'accepted' ? 'default' : 'secondary'}
            className="flex items-center gap-1"
          >
            {meeting.status === 'accepted' ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            {meeting.status}
          </Badge>
        </div>
        {meeting.description && (
          <p className="text-muted-foreground text-sm whitespace-pre-line break-words">{meeting.description}</p>
        )}
      </div>

      {/* Rescheduling Reason - Moved to top */}
      {meeting.reschedulingReason && (
        <>
          <Separator />
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm">Rescheduling Reason</div>
              <div className="text-muted-foreground text-sm">{meeting.reschedulingReason}</div>
              {meeting.rescheduledByEmail && (
                <div className="text-muted-foreground text-xs mt-1">
                  Rescheduled by: {meeting.rescheduledByEmail}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Cancellation Reason - Moved to top */}
      {meeting.cancellationReason && (
        <>
          <Separator />
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm">Cancellation Reason</div>
              <div className="text-muted-foreground text-sm">{meeting.cancellationReason}</div>
              {meeting.cancelledByEmail && (
                <div className="text-muted-foreground text-xs mt-1">
                  Cancelled by: {meeting.cancelledByEmail}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Date and Time */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <div className="text-sm">Date</div>
            <div className="text-muted-foreground text-sm">{formatDate(meeting.start)}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <div className="text-sm">Time</div>
            <div className="text-muted-foreground text-sm">
              {formatTime(meeting.start)} - {formatTime(meeting.end)}
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              Duration: {meeting.duration} minutes
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Meeting Platform */}
      <div className="flex items-start gap-3">
        <Video className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div className="flex-1">
          <div className="text-sm">Platform</div>
          <div className="text-muted-foreground text-sm">{getPlatformName(meeting.meetingUrl)}</div>
          <a
            href={meeting.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline break-all mt-1 block"
          >
            {meeting.meetingUrl}
          </a>
        </div>
      </div>

      <Separator />

      {/* Host */}
      <div className="flex items-start gap-3">
        <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div>
          <div className="text-sm">Host</div>
          {meeting.hosts.map((host) => (
            <div key={host.id} className="text-muted-foreground text-sm">
              {host.name}
              <span className="text-xs ml-2">({host.email})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attendees */}
      {meeting.attendees.length > 0 && (
        <>
          <Separator />
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm">Attendees</div>
              <div className="space-y-1 mt-1">
                {meeting.attendees.map((attendee, index) => (
                  <div key={index} className="text-muted-foreground text-sm">
                    {attendee.name}
                    <span className="text-xs ml-2">({attendee.email})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
