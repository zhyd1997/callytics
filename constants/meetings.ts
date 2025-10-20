import type { Meeting } from '@/lib/types/meeting';

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

function twoDatesCurrentAndPrevMonthUTC() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m0 = now.getUTCMonth();              // 当前月（0-11）
  const prevY = m0 === 0 ? y - 1 : y;
  const prevM0 = m0 === 0 ? 11 : m0 - 1;     // 上个月

  const current = deterministicUtcIsoIn(y, m0, 123);
  const previous = deterministicUtcIsoIn(prevY, prevM0, 456);
  return { current, previous };
}

// Generate deterministic dates for this month and last month
const { current: currentMonthDate, previous: lastMonthDate } = twoDatesCurrentAndPrevMonthUTC();

// Generate additional deterministic dates for current month meetings
const now = new Date();
const currentYear = now.getUTCFullYear();
const currentMonth = now.getUTCMonth();
const currentMonthDate2 = deterministicUtcIsoIn(currentYear, currentMonth, 789);
const currentMonthDate3 = deterministicUtcIsoIn(currentYear, currentMonth, 101112);

// Generate date for month before last month
const twoMonthsAgoYear = currentMonth <= 1 ? currentYear - 1 : currentYear;
const twoMonthsAgoMonth = currentMonth <= 1 ? currentMonth + 10 : currentMonth - 2;
const twoMonthsAgoDate = deterministicUtcIsoIn(twoMonthsAgoYear, twoMonthsAgoMonth, 131415);

// Generate additional deterministic dates for more meetings
const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
const lastMonthDate2 = deterministicUtcIsoIn(lastMonthYear, lastMonth, 161718);
const lastMonthDate3 = deterministicUtcIsoIn(lastMonthYear, lastMonth, 192021);

const currentMonthDate4 = deterministicUtcIsoIn(currentYear, currentMonth, 222324);
const currentMonthDate5 = deterministicUtcIsoIn(currentYear, currentMonth, 252627);
const currentMonthDate6 = deterministicUtcIsoIn(currentYear, currentMonth, 282930);

const twoMonthsAgoDate2 = deterministicUtcIsoIn(twoMonthsAgoYear, twoMonthsAgoMonth, 313233);
const twoMonthsAgoDate3 = deterministicUtcIsoIn(twoMonthsAgoYear, twoMonthsAgoMonth, 343536);

// Generate dates for month before the month before the last month (3 months ago)
const threeMonthsAgoYear = currentMonth <= 2 ? currentYear - 1 : currentYear;
const threeMonthsAgoMonth = currentMonth <= 2 ? currentMonth + 9 : currentMonth - 3;
const threeMonthsAgoDate1 = deterministicUtcIsoIn(threeMonthsAgoYear, threeMonthsAgoMonth, 373839);
const threeMonthsAgoDate2 = deterministicUtcIsoIn(threeMonthsAgoYear, threeMonthsAgoMonth, 404142);
const threeMonthsAgoDate3 = deterministicUtcIsoIn(threeMonthsAgoYear, threeMonthsAgoMonth, 434445);

/**
 * Mock Meetings Data for Demo
 */
export const MEETING_DATA: Meeting = {
  "status": "success",
  data: [
    {
      id: 123,
      uid: 'booking_uid_123',
      title: 'Consultation',
      description: 'Learn how to integrate scheduling into marketplace.',
      hosts: [
        {
          id: 1,
          name: 'Jane Doe',
          email: 'jane100@example.com',
          username: 'jane100',
          timeZone: 'America/Los_Angeles',
        },
      ],
      status: 'accepted',
      cancellationReason: 'User requested cancellation',
      cancelledByEmail: 'canceller@example.com',
      reschedulingReason: 'User rescheduled the event',
      rescheduledByEmail: 'rescheduler@example.com',
      rescheduledFromUid: 'previous_uid_123',
      rescheduledToUid: 'new_uid_456',
      start: threeMonthsAgoDate1,
      end: new Date(new Date(threeMonthsAgoDate1).getTime() + 60 * 60 * 1000).toISOString(),
      duration: 60,
      eventTypeId: 50,
      eventType: {
        id: 1,
        slug: 'some-event',
      },
      meetingUrl: 'https://example.com/recurring-meeting',
      location: 'https://example.com/meeting',
      absentHost: true,
      createdAt: threeMonthsAgoDate1,
      updatedAt: threeMonthsAgoDate1,
      metadata: {
        key: 'value',
      },
      rating: 4,
      icsUid: 'ics_uid_123',
      attendees: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567890',
        },
        {
          name: 'Alice Smith',
          email: 'alice.smith@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567891',
        },
      ],
      guests: ['guest1@example.com', 'guest2@example.com'],
      bookingFieldsResponses: {
        customField: 'customValue',
      },
    },
    {
      id: 124,
      uid: 'booking_uid_124',
      title: 'Product Demo',
      description: 'Demonstration of new features and capabilities.',
      hosts: [
        {
          id: 2,
          name: 'Alex Smith',
          email: 'alex.smith@example.com',
          username: 'alexsmith',
          timeZone: 'Europe/London',
        },
      ],
      status: 'completed',
      start: lastMonthDate,
      end: new Date(new Date(lastMonthDate).getTime() + 60 * 60 * 1000).toISOString(),
      duration: 60,
      eventTypeId: 51,
      eventType: {
        id: 2,
        slug: 'product-demo',
      },
      meetingUrl: 'https://example.com/zoom-meeting',
      location: 'https://example.com/meeting',
      absentHost: false,
      createdAt: new Date(new Date(lastMonthDate).getTime() - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(lastMonthDate).getTime() + 60 * 60 * 1000).toISOString(),
      metadata: {
        department: 'Sales',
        priority: 'high',
      },
      rating: 5,
      icsUid: 'ics_uid_124',
      attendees: [
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          timeZone: 'America/Denver',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567892',
        },
        {
          name: 'Carol Williams',
          email: 'carol.williams@example.com',
          timeZone: 'America/Los_Angeles',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567893',
        },
        {
          name: 'David Brown',
          email: 'david.brown@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567894',
        },
      ],
      guests: ['observer@example.com'],
      bookingFieldsResponses: {
        company: 'TechCorp Inc',
        role: 'CTO',
        interests: 'AI, Machine Learning',
      },
    },
    {
      id: 125,
      uid: 'booking_uid_125',
      title: 'Team Standup',
      description: 'Daily team synchronization meeting.',
      hosts: [
        {
          id: 3,
          name: 'Maria Garcia',
          email: 'maria.garcia@example.com',
          username: 'mariag',
          timeZone: 'America/New_York',
        },
      ],
      status: 'cancelled',
      cancellationReason: 'Host unavailable due to emergency',
      cancelledByEmail: 'maria.garcia@example.com',
      start: currentMonthDate2,
      end: new Date(new Date(currentMonthDate2).getTime() + 30 * 60 * 1000).toISOString(),
      duration: 30,
      eventTypeId: 52,
      eventType: {
        id: 3,
        slug: 'team-standup',
      },
      meetingUrl: 'https://example.com/team-standup',
      location: 'https://example.com/meeting',
      absentHost: true,
      createdAt: new Date(new Date(currentMonthDate2).getTime() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(currentMonthDate2).getTime() - 15 * 60 * 1000).toISOString(),
      metadata: {
        team: 'Engineering',
        recurring: true,
      },
      rating: 0,
      icsUid: 'ics_uid_125',
      attendees: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567890',
        },
        {
          name: 'Alice Smith',
          email: 'alice.smith@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567891',
        },
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          timeZone: 'America/Denver',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567892',
        },
      ],
      guests: [],
      bookingFieldsResponses: {
        team: 'Engineering',
        project: 'Mobile App',
      },
    },
    {
      id: 126,
      uid: 'booking_uid_126',
      title: 'Client Onboarding',
      description: 'Welcome session for new enterprise client.',
      hosts: [
        {
          id: 4,
          name: 'Robert Kim',
          email: 'robert.kim@example.com',
          username: 'robertk',
          timeZone: 'Asia/Tokyo',
        },
      ],
      status: 'rescheduled',
      reschedulingReason: 'Client requested different time slot',
      rescheduledByEmail: 'client.manager@example.com',
      rescheduledFromUid: 'booking_uid_126_old',
      rescheduledToUid: 'booking_uid_126',
      start: currentMonthDate3,
      end: new Date(new Date(currentMonthDate3).getTime() + 90 * 60 * 1000).toISOString(),
      duration: 90,
      eventTypeId: 53,
      eventType: {
        id: 4,
        slug: 'client-onboarding',
      },
      meetingUrl: 'https://example.com/client-onboarding',
      location: 'https://example.com/meeting',
      absentHost: false,
      createdAt: new Date(new Date(currentMonthDate3).getTime() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(currentMonthDate3).getTime() - 4 * 60 * 60 * 1000).toISOString(),
      metadata: {
        clientTier: 'Enterprise',
        region: 'APAC',
        accountManager: 'Robert Kim',
      },
      rating: 4,
      icsUid: 'ics_uid_126',
      attendees: [
        {
          name: 'Carol Williams',
          email: 'carol.williams@example.com',
          timeZone: 'America/Los_Angeles',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567893',
        },
        {
          name: 'David Brown',
          email: 'david.brown@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567894',
        },
        {
          name: 'Eve Wilson',
          email: 'eve.wilson@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567895',
        },
      ],
      guests: ['legal@example.com', 'finance@example.com'],
      bookingFieldsResponses: {
        company: 'Enterprise Solutions Ltd',
        industry: 'Financial Services',
        teamSize: '500+',
        budget: 'Enterprise',
        timeline: 'Q4 2024',
      },
    },
    {
      id: 127,
      uid: 'booking_uid_127',
      title: 'Sales Pitch',
      description: 'Presenting our solution to potential enterprise client.',
      hosts: [
        {
          id: 5,
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          username: 'sarahw',
          timeZone: 'America/New_York',
        },
      ],
      status: 'completed',
      start: lastMonthDate2,
      end: new Date(new Date(lastMonthDate2).getTime() + 45 * 60 * 1000).toISOString(),
      duration: 45,
      eventTypeId: 54,
      eventType: {
        id: 5,
        slug: 'sales-pitch',
      },
      meetingUrl: 'https://example.com/sales-pitch',
      location: 'https://example.com/meeting',
      absentHost: false,
      createdAt: new Date(new Date(lastMonthDate2).getTime() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(lastMonthDate2).getTime() + 45 * 60 * 1000).toISOString(),
      metadata: {
        department: 'Sales',
        priority: 'high',
        leadSource: 'Website',
      },
      rating: 4,
      icsUid: 'ics_uid_127',
      attendees: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567890',
        },
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          timeZone: 'America/Denver',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567892',
        },
      ],
      guests: ['decision.maker@example.com'],
      bookingFieldsResponses: {
        company: 'Global Corp',
        role: 'VP Engineering',
        budget: 'High',
        timeline: 'Q1 2025',
      },
    },
    {
      id: 128,
      uid: 'booking_uid_128',
      title: 'Technical Review',
      description: 'Deep dive into technical implementation details.',
      hosts: [
        {
          id: 6,
          name: 'David Chen',
          email: 'david.chen@example.com',
          username: 'davidc',
          timeZone: 'Asia/Shanghai',
        },
      ],
      status: 'accepted',
      start: currentMonthDate4,
      end: new Date(new Date(currentMonthDate4).getTime() + 120 * 60 * 1000).toISOString(),
      duration: 120,
      eventTypeId: 55,
      eventType: {
        id: 6,
        slug: 'technical-review',
      },
      meetingUrl: 'https://example.com/tech-review',
      location: 'https://example.com/meeting',
      absentHost: false,
      createdAt: currentMonthDate4,
      updatedAt: currentMonthDate4,
      metadata: {
        department: 'Engineering',
        complexity: 'High',
        reviewType: 'Architecture',
      },
      rating: 0,
      icsUid: 'ics_uid_128',
      attendees: [
        {
          name: 'Alice Smith',
          email: 'alice.smith@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567891',
        },
        {
          name: 'Carol Williams',
          email: 'carol.williams@example.com',
          timeZone: 'America/Los_Angeles',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567893',
        },
        {
          name: 'David Brown',
          email: 'david.brown@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567894',
        },
        {
          name: 'Eve Wilson',
          email: 'eve.wilson@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567895',
        },
      ],
      guests: [],
      bookingFieldsResponses: {
        project: 'Microservices Migration',
        urgency: 'Medium',
        teamSize: '8',
      },
    },
    {
      id: 129,
      uid: 'booking_uid_129',
      title: 'Customer Support',
      description: 'Resolving customer issues and providing assistance.',
      hosts: [
        {
          id: 7,
          name: 'Emma Davis',
          email: 'emma.davis@example.com',
          username: 'emmad',
          timeZone: 'Europe/London',
        },
      ],
      status: 'completed',
      start: threeMonthsAgoDate2,
      end: new Date(new Date(threeMonthsAgoDate2).getTime() + 30 * 60 * 1000).toISOString(),
      duration: 30,
      eventTypeId: 56,
      eventType: {
        id: 7,
        slug: 'customer-support',
      },
      meetingUrl: 'https://example.com/support-call',
      location: 'https://example.com/meeting',
      absentHost: false,
      createdAt: new Date(new Date(threeMonthsAgoDate2).getTime() - 10 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(threeMonthsAgoDate2).getTime() + 30 * 60 * 1000).toISOString(),
      metadata: {
        department: 'Support',
        priority: 'Medium',
        issueType: 'Technical',
      },
      rating: 5,
      icsUid: 'ics_uid_129',
      attendees: [
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          timeZone: 'America/Denver',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567892',
        },
        {
          name: 'Eve Wilson',
          email: 'eve.wilson@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567895',
        },
      ],
      guests: [],
      bookingFieldsResponses: {
        issue: 'Login Problems',
        severity: 'Medium',
        account: 'Premium',
      },
    },
    {
      id: 130,
      uid: 'booking_uid_130',
      title: 'Project Kickoff',
      description: 'Starting a new project with the development team.',
      hosts: [
        {
          id: 8,
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          username: 'alexj',
          timeZone: 'America/Los_Angeles',
        },
      ],
      status: 'completed',
      start: currentMonthDate5,
      end: new Date(new Date(currentMonthDate5).getTime() + 90 * 60 * 1000).toISOString(),
      duration: 90,
      eventTypeId: 57,
      eventType: {
        id: 8,
        slug: 'project-kickoff',
      },
      meetingUrl: 'https://example.com/project-kickoff',
      location: 'https://example.com/meeting',
      absentHost: false,
      createdAt: new Date(new Date(currentMonthDate5).getTime() - 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(currentMonthDate5).getTime() + 90 * 60 * 1000).toISOString(),
      metadata: {
        department: 'Product',
        projectPhase: 'Initiation',
        budget: 'Large',
      },
      rating: 4,
      icsUid: 'ics_uid_130',
      attendees: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567890',
        },
        {
          name: 'Alice Smith',
          email: 'alice.smith@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567891',
        },
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          timeZone: 'America/Denver',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567892',
        },
        {
          name: 'Carol Williams',
          email: 'carol.williams@example.com',
          timeZone: 'America/Los_Angeles',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567893',
        },
      ],
      guests: ['stakeholder@example.com'],
      bookingFieldsResponses: {
        project: 'Mobile App Redesign',
        timeline: '6 months',
        teamSize: '12',
      },
    },
    {
      id: 131,
      uid: 'booking_uid_131',
      title: 'Training Session',
      description: 'Training new team members on company processes.',
      hosts: [
        {
          id: 9,
          name: 'Jennifer Lee',
          email: 'jennifer.lee@example.com',
          username: 'jenniferl',
          timeZone: 'America/Chicago',
        },
      ],
      status: 'cancelled',
      cancellationReason: 'Trainer sick, rescheduled for next week',
      cancelledByEmail: 'jennifer.lee@example.com',
      start: lastMonthDate3,
      end: new Date(new Date(lastMonthDate3).getTime() + 180 * 60 * 1000).toISOString(),
      duration: 180,
      eventTypeId: 58,
      eventType: {
        id: 9,
        slug: 'training-session',
      },
      meetingUrl: 'https://example.com/training',
      location: 'https://example.com/meeting',
      absentHost: true,
      createdAt: new Date(new Date(lastMonthDate3).getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(lastMonthDate3).getTime() - 1 * 60 * 60 * 1000).toISOString(),
      metadata: {
        department: 'HR',
        trainingType: 'Onboarding',
        participants: 'New Hires',
      },
      rating: 0,
      icsUid: 'ics_uid_131',
      attendees: [
        {
          name: 'David Brown',
          email: 'david.brown@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567894',
        },
        {
          name: 'Eve Wilson',
          email: 'eve.wilson@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567895',
        },
      ],
      guests: [],
      bookingFieldsResponses: {
        department: 'Engineering',
        experience: 'Junior',
        startDate: '2024-12-01',
      },
    },
    {
      id: 132,
      uid: 'booking_uid_132',
      title: 'Sprint Planning',
      description: 'Planning the next development sprint.',
      hosts: [
        {
          id: 10,
          name: 'Mark Thompson',
          email: 'mark.thompson@example.com',
          username: 'markt',
          timeZone: 'Europe/Berlin',
        },
      ],
      status: 'completed',
      start: currentMonthDate6,
      end: new Date(new Date(currentMonthDate6).getTime() + 60 * 60 * 1000).toISOString(),
      duration: 60,
      eventTypeId: 59,
      eventType: {
        id: 10,
        slug: 'sprint-planning',
      },
      meetingUrl: 'https://example.com/sprint-planning',
      location: 'https://example.com/meeting',
      absentHost: false,
      createdAt: new Date(new Date(currentMonthDate6).getTime() - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(currentMonthDate6).getTime() + 60 * 60 * 1000).toISOString(),
      metadata: {
        department: 'Engineering',
        sprint: 'Sprint 15',
        team: 'Frontend',
      },
      rating: 4,
      icsUid: 'ics_uid_132',
      attendees: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567890',
        },
        {
          name: 'Alice Smith',
          email: 'alice.smith@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567891',
        },
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          timeZone: 'America/Denver',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567892',
        },
        {
          name: 'Carol Williams',
          email: 'carol.williams@example.com',
          timeZone: 'America/Los_Angeles',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567893',
        },
        {
          name: 'David Brown',
          email: 'david.brown@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567894',
        },
      ],
      guests: [],
      bookingFieldsResponses: {
        sprint: 'Sprint 15',
        focus: 'Performance Optimization',
        capacity: '80%',
      },
    },
    {
      id: 133,
      uid: 'booking_uid_133',
      title: 'Client Check-in',
      description: 'Regular check-in with existing client.',
      hosts: [
        {
          id: 11,
          name: 'Rachel Green',
          email: 'rachel.green@example.com',
          username: 'rachelg',
          timeZone: 'America/New_York',
        },
      ],
      status: 'rescheduled',
      reschedulingReason: 'Client requested earlier time',
      rescheduledByEmail: 'client.manager@example.com',
      rescheduledFromUid: 'booking_uid_133_old',
      rescheduledToUid: 'booking_uid_133',
      start: threeMonthsAgoDate3,
      end: new Date(new Date(threeMonthsAgoDate3).getTime() + 45 * 60 * 1000).toISOString(),
      duration: 45,
      eventTypeId: 60,
      eventType: {
        id: 11,
        slug: 'client-checkin',
      },
      meetingUrl: 'https://example.com/client-checkin',
      location: 'https://example.com/meeting',
      absentHost: false,
      createdAt: new Date(new Date(threeMonthsAgoDate3).getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(threeMonthsAgoDate3).getTime() - 1 * 60 * 60 * 1000).toISOString(),
      metadata: {
        department: 'Account Management',
        clientTier: 'Enterprise',
        relationship: 'Long-term',
      },
      rating: 5,
      icsUid: 'ics_uid_133',
      attendees: [
        {
          name: 'Alice Smith',
          email: 'alice.smith@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567891',
        },
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          timeZone: 'America/Denver',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567892',
        },
        {
          name: 'Carol Williams',
          email: 'carol.williams@example.com',
          timeZone: 'America/Los_Angeles',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567893',
        },
      ],
      guests: ['finance@example.com'],
      bookingFieldsResponses: {
        company: 'Enterprise Solutions Inc',
        contract: 'Annual',
        renewal: 'Q2 2025',
      },
    },
    {
      id: 134,
      uid: 'booking_uid_134',
      title: 'Design Review',
      description: 'Reviewing UI/UX designs for new feature.',
      hosts: [
        {
          id: 12,
          name: 'Oliver Kim',
          email: 'oliver.kim@example.com',
          username: 'oliverk',
          timeZone: 'Asia/Seoul',
        },
      ],
      status: 'completed',
      start: currentMonthDate,
      end: new Date(new Date(currentMonthDate).getTime() + 75 * 60 * 1000).toISOString(),
      duration: 75,
      eventTypeId: 61,
      eventType: {
        id: 12,
        slug: 'design-review',
      },
      meetingUrl: 'https://example.com/design-review',
      location: 'https://example.com/meeting',
      absentHost: false,
      createdAt: new Date(new Date(currentMonthDate).getTime() - 20 * 60 * 1000).toISOString(),
      updatedAt: new Date(new Date(currentMonthDate).getTime() + 75 * 60 * 1000).toISOString(),
      metadata: {
        department: 'Design',
        feature: 'User Dashboard',
        version: 'v2.0',
      },
      rating: 4,
      icsUid: 'ics_uid_134',
      attendees: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567890',
        },
        {
          name: 'David Brown',
          email: 'david.brown@example.com',
          timeZone: 'America/New_York',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567894',
        },
        {
          name: 'Eve Wilson',
          email: 'eve.wilson@example.com',
          timeZone: 'America/Chicago',
          language: 'en',
          absent: false,
          phoneNumber: '+1234567895',
        },
      ],
      guests: ['product.manager@example.com'],
      bookingFieldsResponses: {
        feature: 'User Dashboard Redesign',
        priority: 'High',
        targetUsers: 'Premium',
      },
    },
  ],
  "pagination": {
    "totalItems": 12,
    "remainingItems": 0,
    "returnedItems": 12,
    "itemsPerPage": 12,
    "currentPage": 0,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "error": {}
}
