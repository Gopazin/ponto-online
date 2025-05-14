
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import TimeEntryTable from '@/components/dashboard/TimeEntryTable';
import DailySummaryTable from '@/components/dashboard/DailySummaryTable';
import { 
  generateMockTimeEntries, 
  getDateOptions,
  calculateDailySummaries,
  calculateWorkHourStatistics
} from '@/utils/timeEntryUtils';
import { TimeEntry, Employee, DailySummary } from '@/types/timeEntry';

// Mock employees data
const mockEmployees: Employee[] = [
  { id: '1', name: 'John Employee', email: 'employee@example.com', role: 'employee', department: 'IT' },
  { id: '4', name: 'Alice Worker', email: 'alice@example.com', role: 'employee', department: 'Marketing' },
  { id: '5', name: 'Bob Doer', email: 'bob@example.com', role: 'employee', department: 'Finance' },
  { id: '6', name: 'Carol Expert', email: 'carol@example.com', role: 'employee', department: 'HR' }
];

const DashboardPage: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [stats, setStats] = useState({ mostHours: { name: '', hours: 0 }, leastHours: { name: '', hours: 0 } });
  const dateOptions = getDateOptions();
  
  useEffect(() => {
    // Load mock time entries
    const entries = generateMockTimeEntries(mockEmployees);
    setTimeEntries(entries);
    
    // Calculate daily summaries
    const summaries = calculateDailySummaries(entries, mockEmployees);
    setDailySummaries(summaries);
    
    // Calculate statistics
    const statistics = calculateWorkHourStatistics(summaries, mockEmployees);
    setStats(statistics);
    
    // Set default date to today
    setSelectedDate(new Date().toISOString().slice(0, 10));
  }, []);
  
  // Filter time entries based on selected filters
  const filteredEntries = timeEntries.filter(entry => {
    const matchesEmployee = selectedEmployee === 'all' || entry.employeeId === selectedEmployee;
    
    const entryDate = entry.timestamp.slice(0, 10);
    const matchesDate = !selectedDate || entryDate === selectedDate;
    
    const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus;
    
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    
    return matchesEmployee && matchesDate && matchesStatus && matchesType;
  });
  
  // Sort entries by timestamp (newest first)
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const handleApprove = (entryId: string) => {
    setTimeEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === entryId 
          ? { ...entry, status: 'approved' } 
          : entry
      )
    );
    toast.success('Registro aprovado com sucesso!');
  };
  
  const handleReject = (entryId: string) => {
    setTimeEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === entryId 
          ? { ...entry, status: 'rejected' } 
          : entry
      )
    );
    toast.success('Registro rejeitado com sucesso!');
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel de Controle</h1>
        
        <DashboardHeader 
          totalEntries={timeEntries.length}
          mostHours={stats.mostHours}
          leastHours={stats.leastHours}
        />
        
        <Tabs defaultValue="registros">
          <TabsList className="mb-6">
            <TabsTrigger value="registros">Registros</TabsTrigger>
            <TabsTrigger value="resumo">Resumo Diário</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registros">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <DashboardFilters
                  employees={mockEmployees}
                  dateOptions={dateOptions}
                  selectedEmployee={selectedEmployee}
                  setSelectedEmployee={setSelectedEmployee}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  showTypeAndStatus={true}
                />
              </div>
              
              <TimeEntryTable 
                entries={sortedEntries}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="resumo">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <DashboardFilters
                  employees={mockEmployees}
                  dateOptions={dateOptions}
                  selectedEmployee={selectedEmployee}
                  setSelectedEmployee={setSelectedEmployee}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
              
              <DailySummaryTable
                summaries={dailySummaries}
                selectedEmployee={selectedEmployee}
                selectedDate={selectedDate}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
