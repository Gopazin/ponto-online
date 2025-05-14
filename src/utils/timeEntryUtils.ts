
import { TimeEntry, DailySummary, Employee } from '@/types/timeEntry';

// Generate mock time entries for demonstration
export const generateMockTimeEntries = (mockEmployees: Employee[]): TimeEntry[] => {
  const entries: TimeEntry[] = [];
  const employeeIds = mockEmployees.map(e => e.id);
  
  // Generate entries for the past 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    employeeIds.forEach(empId => {
      const employee = mockEmployees.find(e => e.id === empId);
      if (!employee) return;
      
      // Check-in entry (around 9 AM)
      const checkInHour = 8 + Math.floor(Math.random() * 2); // 8-9 AM
      const checkInMinute = Math.floor(Math.random() * 30); // 0-29 minutes
      const checkInTime = new Date(date);
      checkInTime.setHours(checkInHour, checkInMinute, 0, 0);
      
      entries.push({
        id: `in-${empId}-${date.toISOString().slice(0, 10)}`,
        employeeId: empId,
        employeeName: employee.name,
        type: 'check-in',
        timestamp: checkInTime.toISOString(),
        status: Math.random() > 0.9 ? 'pending' : 'approved'
      });
      
      // Break-start entry (around 12 PM)
      const breakStartHour = 12;
      const breakStartMinute = Math.floor(Math.random() * 15); // 0-14 minutes
      const breakStartTime = new Date(date);
      breakStartTime.setHours(breakStartHour, breakStartMinute, 0, 0);
      
      entries.push({
        id: `break-start-${empId}-${date.toISOString().slice(0, 10)}`,
        employeeId: empId,
        employeeName: employee.name,
        type: 'break-start',
        timestamp: breakStartTime.toISOString(),
        status: Math.random() > 0.9 ? 'pending' : 'approved'
      });
      
      // Break-end entry (around 1 PM)
      const breakEndHour = 13;
      const breakEndMinute = Math.floor(Math.random() * 15); // 0-14 minutes
      const breakEndTime = new Date(date);
      breakEndTime.setHours(breakEndHour, breakEndMinute, 0, 0);
      
      entries.push({
        id: `break-end-${empId}-${date.toISOString().slice(0, 10)}`,
        employeeId: empId,
        employeeName: employee.name,
        type: 'break-end',
        timestamp: breakEndTime.toISOString(),
        status: Math.random() > 0.9 ? 'pending' : 'approved'
      });
      
      // Check-out entry (around 6 PM)
      const checkOutHour = 17 + Math.floor(Math.random() * 2); // 5-6 PM
      const checkOutMinute = 30 + Math.floor(Math.random() * 30); // 30-59 minutes
      const checkOutTime = new Date(date);
      checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);
      
      entries.push({
        id: `out-${empId}-${date.toISOString().slice(0, 10)}`,
        employeeId: empId,
        employeeName: employee.name,
        type: 'check-out',
        timestamp: checkOutTime.toISOString(),
        status: Math.random() > 0.9 ? 'pending' : 'approved'
      });
    });
  }
  
  return entries;
};

// Format date options for filters
export const getDateOptions = () => {
  const options = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    const dateLabel = date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
    
    options.push({ value: dateStr, label: dateLabel });
  }
  return options;
};

// Calculate daily summaries from time entries
export const calculateDailySummaries = (
  timeEntries: TimeEntry[],
  employees: Employee[]
): DailySummary[] => {
  // Group entries by employee and date
  const entriesByEmployeeAndDate = timeEntries.reduce<Record<string, Record<string, TimeEntry[]>>>(
    (acc, entry) => {
      const employeeId = entry.employeeId;
      const date = entry.timestamp.slice(0, 10);
      
      if (!acc[employeeId]) {
        acc[employeeId] = {};
      }
      
      if (!acc[employeeId][date]) {
        acc[employeeId][date] = [];
      }
      
      acc[employeeId][date].push(entry);
      return acc;
    }, 
    {}
  );
  
  // Calculate daily summary for each employee
  const dailySummaries = Object.entries(entriesByEmployeeAndDate).map(([employeeId, dateEntries]) => {
    const employee = employees.find(e => e.id === employeeId);
    
    return Object.entries(dateEntries).map(([date, entries]) => {
      // Sort entries chronologically for each day
      const sortedDayEntries = [...entries].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      // Find check-in and check-out times
      const checkIn = sortedDayEntries.find(e => e.type === 'check-in');
      const checkOut = sortedDayEntries.find(e => e.type === 'check-out');
      
      // Find break times
      const breakStart = sortedDayEntries.find(e => e.type === 'break-start');
      const breakEnd = sortedDayEntries.find(e => e.type === 'break-end');
      
      // Calculate total hours and break duration
      let totalMinutes = 0;
      let breakMinutes = 0;
      
      if (checkIn && checkOut) {
        const checkInTime = new Date(checkIn.timestamp).getTime();
        const checkOutTime = new Date(checkOut.timestamp).getTime();
        totalMinutes = Math.round((checkOutTime - checkInTime) / (1000 * 60));
      }
      
      if (breakStart && breakEnd) {
        const breakStartTime = new Date(breakStart.timestamp).getTime();
        const breakEndTime = new Date(breakEnd.timestamp).getTime();
        breakMinutes = Math.round((breakEndTime - breakStartTime) / (1000 * 60));
        totalMinutes -= breakMinutes;
      }
      
      // Calculate hours and minutes
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      const breakHours = Math.floor(breakMinutes / 60);
      const breakMins = breakMinutes % 60;
      
      return {
        employeeId,
        employeeName: employee?.name || 'Unknown',
        date,
        entries: sortedDayEntries,
        totalHours: `${hours}h ${minutes}m`,
        breakDuration: breakMinutes > 0 ? `${breakHours}h ${breakMins}m` : 'N/A',
        hasPendingEntries: sortedDayEntries.some(e => e.status === 'pending'),
        totalMinutes
      };
    });
  }).flat();
  
  return dailySummaries;
};

// Calculate work hour statistics
export const calculateWorkHourStatistics = (
  dailySummaries: DailySummary[],
  employees: Employee[]
) => {
  // Group summary by employee to get total hours per employee
  const hoursByEmployee: Record<string, number> = {};
  
  dailySummaries.forEach(summary => {
    const employeeId = summary.employeeId;
    
    if (!hoursByEmployee[employeeId]) {
      hoursByEmployee[employeeId] = 0;
    }
    
    hoursByEmployee[employeeId] += summary.totalMinutes;
  });
  
  // Find most and least hours
  const mostHours = { name: '', hours: 0 };
  const leastHours = { name: '', hours: Number.MAX_SAFE_INTEGER };
  
  Object.entries(hoursByEmployee).forEach(([employeeId, minutes]) => {
    const employee = employees.find(e => e.id === employeeId);
    const hours = minutes / 60;
    
    if (hours > mostHours.hours) {
      mostHours.name = employee?.name || 'Unknown';
      mostHours.hours = hours;
    }
    
    if (hours < leastHours.hours && hours > 0) {
      leastHours.name = employee?.name || 'Unknown';
      leastHours.hours = hours;
    }
  });
  
  return { mostHours, leastHours };
};
