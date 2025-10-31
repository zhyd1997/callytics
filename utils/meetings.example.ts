/**
 * Example usage of meeting utility functions
 * 
 * This file demonstrates how to use the meeting filtering utilities
 * to remove self-meetings from your data.
 */

import { removeSelfMeetings, countSelfMeetings, isSelfMeeting } from '@/lib/utils/meetings';
import { MEETING_DATA } from "@/constants/meetings";

// Example meeting data
const exampleMeetings = MEETING_DATA.data;

// Usage Example 1: Remove all self-meetings
const filteredMeetings = removeSelfMeetings(exampleMeetings);
console.log('Filtered meetings:', filteredMeetings.length); // Output: 2
// Only meetings with id 1 and 3 remain

// Usage Example 2: Count self-meetings
const selfMeetingCount = countSelfMeetings(exampleMeetings);
console.log('Number of self-meetings:', selfMeetingCount); // Output: 1

// Usage Example 3: Check if a single meeting is a self-meeting
const meeting = exampleMeetings[1];
const isSelf = isSelfMeeting(meeting);
console.log('Is self-meeting:', isSelf); // Output: true

// Usage Example 4: In React component with useMemo
/*
import { useMemo } from 'react';
import { removeSelfMeetings } from './utils/meetings';

function MyComponent({ rawMeetings }) {
  const filteredMeetings = useMemo(() => {
    return removeSelfMeetings(rawMeetings);
  }, [rawMeetings]);

  return (
    <div>
      <p>Total meetings: {rawMeetings.length}</p>
      <p>Real meetings: {filteredMeetings.length}</p>
      <p>Self meetings: {countSelfMeetings(rawMeetings)}</p>
    </div>
  );
}
*/
