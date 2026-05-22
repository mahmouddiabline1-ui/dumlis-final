/**
 * Committees, Classrooms, and Rooms Service
 * ==========================================
 * Replaces hardcoded data with dynamic API calls.
 * Fetches committees, classrooms, and labs from the FastAPI backend.
 */

import { committeesApi, roomsApi, Room } from '../api';

export interface SeatingArrangement {
  rows: number;
  seatsPerRow: number;
  totalSeats: number;
  layout: 'standard' | 'theater' | 'lab';
}

export interface StudentCommitteeAssignment {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  committeeId: number;
  committeeName: string;
  roomCode: string;
  seatNumber: string;
  row?: number;
  column?: number;
  examDate?: string;
  examTime?: string;
}

/**
 * Fetch all classrooms (exam halls) from the backend
 */
export async function getClassrooms() {
  try {
    const rooms = await roomsApi.list({ room_type: 'محاضرات' });
    return rooms.sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error('Failed to fetch classrooms:', error);
    return [];
  }
}

/**
 * Fetch all labs from the backend
 */
export async function getLabs() {
  try {
    const rooms = await roomsApi.list({ room_type: 'معامل' });
    return rooms.sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error('Failed to fetch labs:', error);
    return [];
  }
}

/**
 * Fetch all rooms (classrooms + labs)
 */
export async function getAllRooms() {
  try {
    const rooms = await roomsApi.list();
    return rooms.sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error('Failed to fetch all rooms:', error);
    return [];
  }
}

/**
 * Fetch committees with optional filtering
 */
export async function getCommittees(params?: { status?: string; semester?: string }) {
  try {
    const committees = await committeesApi.list(params);
    return committees.map(c => ({
      ...c,
      seatingArrangement: c.seating_layout
        ? parseSeatingLayout(c.seating_layout, c.capacity)
        : undefined
    }));
  } catch (error) {
    console.error('Failed to fetch committees:', error);
    return [];
  }
}

/**
 * Fetch assignments for a specific committee
 */
export async function getCommitteeAssignments(committeeId: number) {
  try {
    return await committeesApi.listStudents(committeeId);
  } catch (error) {
    console.error(`Failed to fetch assignments for committee ${committeeId}:`, error);
    return [];
  }
}

/**
 * Get a room by ID (for committee room lookups)
 */
export async function getRoomById(roomId: string) {
  try {
    return await roomsApi.get(roomId);
  } catch (error) {
    console.error(`Failed to fetch room ${roomId}:`, error);
    return null;
  }
}

/**
 * Generate seating arrangement based on room capacity
 */
export function generateSeatingArrangement(capacity: number, layout: 'standard' | 'theater' | 'lab' = 'standard'): SeatingArrangement {
  if (layout === 'lab') {
    const rows = Math.ceil(capacity / 2);
    return {
      rows,
      seatsPerRow: 2,
      totalSeats: rows * 2,
      layout: 'lab'
    };
  } else if (layout === 'theater') {
    const seatsPerRow = Math.ceil(Math.sqrt(capacity * 1.5));
    const rows = Math.ceil(capacity / seatsPerRow);
    return {
      rows,
      seatsPerRow,
      totalSeats: rows * seatsPerRow,
      layout: 'theater'
    };
  } else {
    const seatsPerRow = Math.ceil(Math.sqrt(capacity));
    const rows = Math.ceil(capacity / seatsPerRow);
    return {
      rows,
      seatsPerRow,
      totalSeats: rows * seatsPerRow,
      layout: 'standard'
    };
  }
}

/**
 * Generate seat numbers from seating arrangement
 */
export function generateSeatNumbers(arrangement: SeatingArrangement | undefined): string[] {
  if (!arrangement) return [];
  const seatNumbers: string[] = [];
  for (let row = 1; row <= arrangement.rows; row++) {
    for (let col = 1; col <= arrangement.seatsPerRow; col++) {
      seatNumbers.push(`${row}-${col}`);
    }
  }
  return seatNumbers;
}

/**
 * Helper: Parse seating layout string from database
 */
function parseSeatingLayout(layout: string, capacity: number): SeatingArrangement | undefined {
  try {
    const parsed = JSON.parse(layout);
    return parsed as SeatingArrangement;
  } catch {
    return generateSeatingArrangement(capacity, 'standard');
  }
}

