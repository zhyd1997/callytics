import type { Meeting, MeetingItem, MeetingHost, MeetingAttendee } from '@/lib/types/meeting';

function deterministicInt(min: number, max: number, seed: number) {
  // Simple deterministic "random" function using seed
  const x = Math.sin(seed) * 10000;
  const normalized = (x - Math.floor(x));
  return Math.floor(normalized * (max - min + 1)) + min;
}

function daysInMonth(year: number, month0: number) {
  return new Date(year, month0 + 1, 0).getDate();
}

function deterministicUtcIsoIn(year: number, month0: number, seed: number) {
  const dmax = daysInMonth(year, month0);
  const d = deterministicInt(1, dmax, seed);
  const h = deterministicInt(0, 23, seed + 1);
  const m = deterministicInt(0, 59, seed + 2);
  const s = deterministicInt(0, 59, seed + 3);
  return new Date(Date.UTC(year, month0, d, h, m, s)).toISOString();
}

// Helper function to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Helper function to add hours to a date
function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// Pool of names for generating hosts and attendees
const HOST_NAMES = [
  { name: 'Jane Doe', email: 'jane100@example.com', username: 'jane100', timeZone: 'America/Los_Angeles' },
  { name: 'Alex Smith', email: 'alex.smith@example.com', username: 'alexsmith', timeZone: 'Europe/London' },
  { name: 'Maria Garcia', email: 'maria.garcia@example.com', username: 'mariag', timeZone: 'America/New_York' },
  { name: 'Robert Kim', email: 'robert.kim@example.com', username: 'robertk', timeZone: 'Asia/Tokyo' },
  { name: 'Sarah Wilson', email: 'sarah.wilson@example.com', username: 'sarahw', timeZone: 'America/New_York' },
  { name: 'David Chen', email: 'david.chen@example.com', username: 'davidc', timeZone: 'Asia/Shanghai' },
  { name: 'Emma Davis', email: 'emma.davis@example.com', username: 'emmad', timeZone: 'Europe/London' },
  { name: 'Alex Johnson', email: 'alex.johnson@example.com', username: 'alexj', timeZone: 'America/Los_Angeles' },
  { name: 'Jennifer Lee', email: 'jennifer.lee@example.com', username: 'jenniferl', timeZone: 'America/Chicago' },
  { name: 'Mark Thompson', email: 'mark.thompson@example.com', username: 'markt', timeZone: 'Europe/Berlin' },
  { name: 'Rachel Green', email: 'rachel.green@example.com', username: 'rachelg', timeZone: 'America/New_York' },
  { name: 'Oliver Kim', email: 'oliver.kim@example.com', username: 'oliverk', timeZone: 'Asia/Seoul' },
  { name: 'Lisa Anderson', email: 'lisa.anderson@example.com', username: 'lisaa', timeZone: 'America/New_York' },
  { name: 'Michael Park', email: 'michael.park@example.com', username: 'michaelp', timeZone: 'America/Los_Angeles' },
  { name: 'Sarah Martinez', email: 'sarah.martinez@example.com', username: 'sarahm', timeZone: 'America/Chicago' },
  { name: 'Tom Wilson', email: 'tom.wilson@example.com', username: 'tomw', timeZone: 'America/New_York' },
  { name: 'Patricia Taylor', email: 'patricia.taylor@example.com', username: 'patriciat', timeZone: 'America/New_York' },
  { name: 'Kevin Brown', email: 'kevin.brown@example.com', username: 'kevinb', timeZone: 'America/Los_Angeles' },
  { name: 'Chris Johnson', email: 'chris.johnson@example.com', username: 'chrisj', timeZone: 'America/New_York' },
  { name: 'Amanda White', email: 'amanda.white@example.com', username: 'amandaw', timeZone: 'America/New_York' },
  { name: 'Nancy Davis', email: 'nancy.davis@example.com', username: 'nancyd', timeZone: 'America/Chicago' },
];

const ATTENDEE_NAMES = [
  { name: 'John Doe', email: 'john@example.com', timeZone: 'America/New_York' },
  { name: 'Alice Smith', email: 'alice.smith@example.com', timeZone: 'America/Chicago' },
  { name: 'Bob Johnson', email: 'bob.johnson@example.com', timeZone: 'America/Denver' },
  { name: 'Carol Williams', email: 'carol.williams@example.com', timeZone: 'America/Los_Angeles' },
  { name: 'David Brown', email: 'david.brown@example.com', timeZone: 'America/New_York' },
  { name: 'Eve Wilson', email: 'eve.wilson@example.com', timeZone: 'America/Chicago' },
];

// Meeting template configuration
interface MeetingTemplate {
  id: number;
  title: string;
  description: string;
  status: 'accepted' | 'completed' | 'cancelled' | 'rescheduled' | 'upcoming' | 'recurring' | 'past' | 'pending' | 'rejected' | 'unconfirmed';
  duration: number;
  eventTypeId: number;
  eventTypeSlug: string;
  meetingPlatform: 'google' | 'zoom' | 'cal';
  daysOffset: number; // Days from now (negative = past, positive = future)
  hostIndex: number;
  attendeeCount: number;
  attendeeIndices: number[];
  guests?: string[];
  metadata?: Record<string, unknown>;
  bookingFieldsResponses?: Record<string, unknown>;
  cancellationReason?: string;
  cancelledByEmail?: string;
  reschedulingReason?: string;
  rescheduledByEmail?: string;
  absentHost?: boolean;
  rating?: number;
}

const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    id: 123, title: 'Consultation', description: 'Learn how to integrate scheduling into marketplace.',
    status: 'accepted', duration: 60, eventTypeId: 50, eventTypeSlug: 'some-event',
    meetingPlatform: 'google', daysOffset: -90, hostIndex: 0, attendeeCount: 2, attendeeIndices: [0, 1],
    guests: ['guest1@example.com', 'guest2@example.com'],
    metadata: { key: 'value' }, bookingFieldsResponses: { customField: 'customValue' },
    cancellationReason: 'User requested cancellation', cancelledByEmail: 'canceller@example.com',
    reschedulingReason: 'User rescheduled the event', rescheduledByEmail: 'rescheduler@example.com',
    absentHost: true, rating: 4,
  },
  {
    id: 124, title: 'Product Demo', description: 'Demonstration of new features and capabilities.',
    status: 'completed', duration: 60, eventTypeId: 51, eventTypeSlug: 'product-demo',
    meetingPlatform: 'zoom', daysOffset: -30, hostIndex: 1, attendeeCount: 3, attendeeIndices: [2, 3, 4],
    guests: ['observer@example.com'],
    metadata: { department: 'Sales', priority: 'high' },
    bookingFieldsResponses: { company: 'TechCorp Inc', role: 'CTO', interests: 'AI, Machine Learning' },
    rating: 5,
  },
  {
    id: 125, title: 'Team Standup', description: 'Daily team synchronization meeting.',
    status: 'cancelled', duration: 30, eventTypeId: 52, eventTypeSlug: 'team-standup',
    meetingPlatform: 'cal', daysOffset: -15, hostIndex: 2, attendeeCount: 3, attendeeIndices: [0, 1, 2],
    metadata: { team: 'Engineering', recurring: true },
    bookingFieldsResponses: { team: 'Engineering', project: 'Mobile App' },
    cancellationReason: 'Host unavailable due to emergency', cancelledByEmail: 'maria.garcia@example.com',
    absentHost: true,
  },
  {
    id: 126, title: 'Client Onboarding', description: 'Welcome session for new enterprise client.',
    status: 'rescheduled', duration: 90, eventTypeId: 53, eventTypeSlug: 'client-onboarding',
    meetingPlatform: 'google', daysOffset: -10, hostIndex: 3, attendeeCount: 3, attendeeIndices: [3, 4, 5],
    guests: ['legal@example.com', 'finance@example.com'],
    metadata: { clientTier: 'Enterprise', region: 'APAC', accountManager: 'Robert Kim' },
    bookingFieldsResponses: { company: 'Enterprise Solutions Ltd', industry: 'Financial Services', teamSize: '500+', budget: 'Enterprise', timeline: 'Q4 2024' },
    reschedulingReason: 'Client requested different time slot', rescheduledByEmail: 'client.manager@example.com',
    rating: 4,
  },
  {
    id: 127, title: 'Sales Pitch', description: 'Presenting our solution to potential enterprise client.',
    status: 'completed', duration: 45, eventTypeId: 54, eventTypeSlug: 'sales-pitch',
    meetingPlatform: 'zoom', daysOffset: -25, hostIndex: 4, attendeeCount: 2, attendeeIndices: [0, 2],
    guests: ['decision.maker@example.com'],
    metadata: { department: 'Sales', priority: 'high', leadSource: 'Website' },
    bookingFieldsResponses: { company: 'Global Corp', role: 'VP Engineering', budget: 'High', timeline: 'Q1 2025' },
    rating: 4,
  },
  {
    id: 128, title: 'Technical Review', description: 'Deep dive into technical implementation details.',
    status: 'accepted', duration: 120, eventTypeId: 55, eventTypeSlug: 'technical-review',
    meetingPlatform: 'cal', daysOffset: 5, hostIndex: 5, attendeeCount: 4, attendeeIndices: [1, 3, 4, 5],
    metadata: { department: 'Engineering', complexity: 'High', reviewType: 'Architecture' },
    bookingFieldsResponses: { project: 'Microservices Migration', urgency: 'Medium', teamSize: '8' },
  },
  {
    id: 129, title: 'Customer Support', description: 'Resolving customer issues and providing assistance.',
    status: 'completed', duration: 30, eventTypeId: 56, eventTypeSlug: 'customer-support',
    meetingPlatform: 'google', daysOffset: -90, hostIndex: 6, attendeeCount: 2, attendeeIndices: [2, 5],
    metadata: { department: 'Support', priority: 'Medium', issueType: 'Technical' },
    bookingFieldsResponses: { issue: 'Login Problems', severity: 'Medium', account: 'Premium' },
    rating: 5,
  },
  {
    id: 130, title: 'Project Kickoff', description: 'Starting a new project with the development team.',
    status: 'completed', duration: 90, eventTypeId: 57, eventTypeSlug: 'project-kickoff',
    meetingPlatform: 'zoom', daysOffset: -20, hostIndex: 7, attendeeCount: 4, attendeeIndices: [0, 1, 2, 3],
    guests: ['stakeholder@example.com'],
    metadata: { department: 'Product', projectPhase: 'Initiation', budget: 'Large' },
    bookingFieldsResponses: { project: 'Mobile App Redesign', timeline: '6 months', teamSize: '12' },
    rating: 4,
  },
  {
    id: 131, title: 'Training Session', description: 'Training new team members on company processes.',
    status: 'cancelled', duration: 180, eventTypeId: 58, eventTypeSlug: 'training-session',
    meetingPlatform: 'cal', daysOffset: -35, hostIndex: 8, attendeeCount: 2, attendeeIndices: [4, 5],
    metadata: { department: 'HR', trainingType: 'Onboarding', participants: 'New Hires' },
    bookingFieldsResponses: { department: 'Engineering', experience: 'Junior', startDate: '2024-12-01' },
    cancellationReason: 'Trainer sick, rescheduled for next week', cancelledByEmail: 'jennifer.lee@example.com',
    absentHost: true,
  },
  {
    id: 132, title: 'Sprint Planning', description: 'Planning the next development sprint.',
    status: 'completed', duration: 60, eventTypeId: 59, eventTypeSlug: 'sprint-planning',
    meetingPlatform: 'google', daysOffset: -5, hostIndex: 9, attendeeCount: 5, attendeeIndices: [0, 1, 2, 3, 4],
    metadata: { department: 'Engineering', sprint: 'Sprint 15', team: 'Frontend' },
    bookingFieldsResponses: { sprint: 'Sprint 15', focus: 'Performance Optimization', capacity: '80%' },
    rating: 4,
  },
  {
    id: 133, title: 'Client Check-in', description: 'Regular check-in with existing client.',
    status: 'rescheduled', duration: 45, eventTypeId: 60, eventTypeSlug: 'client-checkin',
    meetingPlatform: 'zoom', daysOffset: -90, hostIndex: 10, attendeeCount: 3, attendeeIndices: [1, 2, 3],
    guests: ['finance@example.com'],
    metadata: { department: 'Account Management', clientTier: 'Enterprise', relationship: 'Long-term' },
    bookingFieldsResponses: { company: 'Enterprise Solutions Inc', contract: 'Annual', renewal: 'Q2 2025' },
    reschedulingReason: 'Client requested earlier time', rescheduledByEmail: 'client.manager@example.com',
    rating: 5,
  },
  {
    id: 134, title: 'Design Review', description: 'Reviewing UI/UX designs for new feature.',
    status: 'completed', duration: 75, eventTypeId: 61, eventTypeSlug: 'design-review',
    meetingPlatform: 'cal', daysOffset: -3, hostIndex: 11, attendeeCount: 3, attendeeIndices: [0, 4, 5],
    guests: ['product.manager@example.com'],
    metadata: { department: 'Design', feature: 'User Dashboard', version: 'v2.0' },
    bookingFieldsResponses: { feature: 'User Dashboard Redesign', priority: 'High', targetUsers: 'Premium' },
    rating: 4,
  },
  {
    id: 135, title: 'Weekly 1-on-1', description: 'Regular weekly check-in with team member.',
    status: 'upcoming', duration: 30, eventTypeId: 62, eventTypeSlug: 'weekly-1on1',
    meetingPlatform: 'cal', daysOffset: 2, hostIndex: 12, attendeeCount: 1, attendeeIndices: [0],
    metadata: { department: 'Engineering', meetingType: 'Recurring', frequency: 'Weekly' },
    bookingFieldsResponses: { employee: 'John Doe', department: 'Engineering', role: 'Senior Developer' },
  },
  {
    id: 136, title: 'Monthly Team Sync', description: 'Monthly recurring team synchronization meeting.',
    status: 'recurring', duration: 60, eventTypeId: 63, eventTypeSlug: 'monthly-team-sync',
    meetingPlatform: 'google', daysOffset: 7, hostIndex: 13, attendeeCount: 3, attendeeIndices: [1, 2, 3],
    metadata: { department: 'Product', recurring: true, frequency: 'Monthly', dayOfMonth: 'First Monday' },
    bookingFieldsResponses: { team: 'Product Team', focus: 'Roadmap Review', participants: 'All Team Members' },
  },
  {
    id: 137, title: 'Q4 Retrospective', description: 'Quarterly retrospective meeting to review past quarter.',
    status: 'past', duration: 90, eventTypeId: 64, eventTypeSlug: 'quarterly-retro',
    meetingPlatform: 'zoom', daysOffset: -45, hostIndex: 14, attendeeCount: 3, attendeeIndices: [0, 1, 2],
    metadata: { department: 'Engineering', quarter: 'Q4 2024', meetingType: 'Retrospective' },
    bookingFieldsResponses: { quarter: 'Q4 2024', focus: 'Team Performance', outcomes: 'Action Items' },
    rating: 5,
  },
  {
    id: 138, title: 'New Feature Proposal', description: 'Proposing a new feature for product roadmap.',
    status: 'pending', duration: 45, eventTypeId: 65, eventTypeSlug: 'feature-proposal',
    meetingPlatform: 'cal', daysOffset: 5, hostIndex: 15, attendeeCount: 2, attendeeIndices: [4, 5],
    guests: ['product.lead@example.com'],
    metadata: { department: 'Product', priority: 'High', feature: 'New Dashboard' },
    bookingFieldsResponses: { feature: 'Advanced Analytics Dashboard', priority: 'High', timeline: 'Q2 2025' },
  },
  {
    id: 139, title: 'Budget Approval Meeting', description: 'Meeting to discuss and approve Q1 budget allocation.',
    status: 'rejected', duration: 60, eventTypeId: 66, eventTypeSlug: 'budget-approval',
    meetingPlatform: 'zoom', daysOffset: 3, hostIndex: 16, attendeeCount: 2, attendeeIndices: [0, 1],
    guests: ['cfo@example.com'],
    metadata: { department: 'Finance', budget: 'Q1 2025', amount: '$500,000' },
    bookingFieldsResponses: { quarter: 'Q1 2025', department: 'Engineering', budget: '$500,000' },
    cancellationReason: 'Budget already approved through different channel', cancelledByEmail: 'finance.director@example.com',
  },
  {
    id: 140, title: 'Partnership Discussion', description: 'Initial discussion about potential partnership opportunity.',
    status: 'unconfirmed', duration: 60, eventTypeId: 67, eventTypeSlug: 'partnership-discussion',
    meetingPlatform: 'google', daysOffset: 10, hostIndex: 17, attendeeCount: 2, attendeeIndices: [2, 3],
    guests: ['partner.rep@example.com'],
    metadata: { department: 'Business Development', partnershipType: 'Strategic', stage: 'Initial' },
    bookingFieldsResponses: { company: 'Strategic Partners Inc', partnershipType: 'Technology Integration', potential: 'High Value' },
  },
  {
    id: 141, title: 'Emergency Team Meeting', description: 'Urgent meeting to address critical production issue.',
    status: 'accepted', duration: 30, eventTypeId: 68, eventTypeSlug: 'emergency-meeting',
    meetingPlatform: 'cal', daysOffset: 0.17, hostIndex: 18, attendeeCount: 4, attendeeIndices: [0, 1, 2, 4],
    guests: ['oncall@example.com'],
    metadata: { department: 'Engineering', priority: 'Critical', issueType: 'Production Outage', severity: 'P0' },
    bookingFieldsResponses: { issue: 'Database Connection Failure', severity: 'P0', impact: 'All Users' },
    reschedulingReason: 'Original time conflicted with other critical meeting', rescheduledByEmail: 'chris.johnson@example.com',
  },
  {
    id: 142, title: 'Investor Presentation', description: 'Quarterly presentation to board of investors.',
    status: 'accepted', duration: 120, eventTypeId: 69, eventTypeSlug: 'investor-presentation',
    meetingPlatform: 'zoom', daysOffset: 14, hostIndex: 19, attendeeCount: 3, attendeeIndices: [1, 3, 4],
    guests: ['investor1@example.com', 'investor2@example.com', 'investor3@example.com'],
    metadata: { department: 'Executive', quarter: 'Q4 2024', presentationType: 'Quarterly Review', audience: 'Board of Investors' },
    bookingFieldsResponses: { quarter: 'Q4 2024', focus: 'Financial Performance', audience: 'Board Members' },
    reschedulingReason: 'Investor requested different date due to scheduling conflict', rescheduledByEmail: 'investor.relations@example.com',
  },
  {
    id: 143, title: 'Customer Success Call', description: 'Follow-up call to ensure customer satisfaction.',
    status: 'cancelled', duration: 45, eventTypeId: 70, eventTypeSlug: 'customer-success-call',
    meetingPlatform: 'cal', daysOffset: 8, hostIndex: 20, attendeeCount: 1, attendeeIndices: [2],
    metadata: { department: 'Customer Success', customerTier: 'Enterprise', churnRisk: 'High' },
    bookingFieldsResponses: { customer: 'Enterprise Corp', accountStatus: 'Cancelled', reason: 'Budget Constraints' },
    cancellationReason: 'Customer cancelled subscription, no longer needed', cancelledByEmail: 'customer@example.com',
  },
];

function generateMeetingUrl(platform: 'google' | 'zoom' | 'cal', seed: number): string {
  const baseUrls = {
    google: 'https://meet.google.com',
    zoom: 'https://zoom.us/j',
    cal: 'https://app.cal.com/video',
  };
  const suffixes = {
    google: ['abc-defg-hij', 'xyz-mnop-qrs', 'def-uvwx-yz1', 'ghi-jklm-nop', 'recurring-team-sync'],
    zoom: ['1234567890?pwd=abcdef123456', '9876543210?pwd=xyz789abc456', '5555666677?pwd=qwerty123456', '1111222333?pwd=meeting789xyz', 'budget-q1-2025', 'retro-q4-2024', 'investor-q4-presentation'],
    cal: ['team-standup-xyz', 'tech-review-456', 'training-session-789', 'design-review-ui', 'weekly-checkin', 'feature-proposal-xyz', 'emergency-urgent', 'customer-success-followup'],
  };
  const index = deterministicInt(0, suffixes[platform].length - 1, seed);
  const suffix = suffixes[platform][index];
  return `${baseUrls[platform]}/${suffix}`;
}

function createHost(hostInfo: typeof HOST_NAMES[number], hostId: number): MeetingHost {
  return {
    id: hostId,
    name: hostInfo.name,
    email: hostInfo.email,
    username: hostInfo.username,
    timeZone: hostInfo.timeZone,
  };
}

function createAttendee(attendeeInfo: typeof ATTENDEE_NAMES[number], seed: number): MeetingAttendee {
  const phoneNumber = `+1234567${String(890 + seed).padStart(3, '0')}`;
  return {
    name: attendeeInfo.name,
    email: attendeeInfo.email,
    timeZone: attendeeInfo.timeZone,
    language: 'en',
    absent: false,
    phoneNumber,
  };
}

function generateMeetingFromTemplate(template: MeetingTemplate, baseId: number): MeetingItem {
  const now = new Date();
  const startDate = addDays(now, template.daysOffset);
  const start = startDate.toISOString();
  const end = addHours(startDate, template.duration / 60).toISOString();
  
  const host = HOST_NAMES[template.hostIndex % HOST_NAMES.length];
  const attendees: MeetingAttendee[] = template.attendeeIndices
    .slice(0, template.attendeeCount)
    .map((idx, i) => createAttendee(ATTENDEE_NAMES[idx % ATTENDEE_NAMES.length], baseId + i));

  const meetingUrl = generateMeetingUrl(template.meetingPlatform, baseId);
  
  // Generate UIDs
  const uid = `booking_uid_${template.id}`;
  const rescheduledFromUid = template.reschedulingReason ? `${uid}_original` : undefined;
  const rescheduledToUid = template.reschedulingReason ? uid : undefined;
  const icsUid = `ics_uid_${template.id}`;

  // Calculate createdAt and updatedAt
  const createdAt = addDays(startDate, -Math.abs(template.daysOffset) * 0.5).toISOString();
  const updatedAt = template.reschedulingReason || template.cancellationReason
    ? addDays(startDate, -Math.abs(template.daysOffset) * 0.3).toISOString()
    : template.status === 'completed' ? end : createdAt;

  return {
    id: template.id,
    uid,
    title: template.title,
    description: template.description,
    hosts: [createHost(host, template.id)],
    status: template.status,
    cancellationReason: template.cancellationReason,
    cancelledByEmail: template.cancelledByEmail,
    reschedulingReason: template.reschedulingReason,
    rescheduledByEmail: template.rescheduledByEmail,
    rescheduledFromUid,
    rescheduledToUid,
    start,
    end,
    duration: template.duration,
    eventTypeId: template.eventTypeId,
    eventType: {
      id: template.id - 122, // Offset to start from 1
      slug: template.eventTypeSlug,
    },
    meetingUrl,
    location: meetingUrl,
    absentHost: template.absentHost ?? false,
    createdAt,
    updatedAt,
    metadata: template.metadata ?? {},
    rating: template.rating ?? 0,
    icsUid,
    attendees,
    guests: template.guests ?? [],
    bookingFieldsResponses: template.bookingFieldsResponses ?? {},
  };
}

/**
 * Generates mock meetings data for demo purposes
 * @returns Meeting object with status, data, pagination, and error fields
 */
export function generateMeetingData(): Meeting {
  const meetingsData = MEETING_TEMPLATES.map((template, index) =>
    generateMeetingFromTemplate(template, template.id)
  );

  return {
    status: "success",
    data: meetingsData,
    pagination: {
      totalItems: meetingsData.length,
      remainingItems: 0,
      returnedItems: meetingsData.length,
      itemsPerPage: meetingsData.length,
      currentPage: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    error: {},
  };
}

/**
 * Mock Meetings Data for Demo
 * @deprecated Use generateMeetingData() instead for programmatic generation
 */
export const MEETING_DATA: Meeting = generateMeetingData();