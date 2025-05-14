
// Define interfaces for time entries and related types
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'check-in' | 'check-out' | 'break-start' | 'break-end';
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface DailySummary {
  employeeId: string;
  employeeName: string;
  date: string;
  entries: TimeEntry[];
  totalHours: string;
  breakDuration: string;
  hasPendingEntries: boolean;
  totalMinutes: number; // Added for statistics calculation
}
