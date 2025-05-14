
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import TimeEntryTable from '@/components/dashboard/TimeEntryTable';
import DailySummaryTable from '@/components/dashboard/DailySummaryTable';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { calculateDailySummaries, calculateWorkHourStatistics, getDateOptions } from '@/utils/timeEntryUtils';
import { Employee } from '@/types/timeEntry';

const DashboardPage: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { profile } = useAuth();
  const { entries, loading, updateEntryStatus, bulkApprove, refreshEntries } = useTimeEntries(true);
  const dateOptions = getDateOptions();
  
  // Fetch all employees data
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role, department')
        .eq('role', 'employee');
        
      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
      
      return data as Employee[];
    }
  });
  
  // Filter time entries based on selected filters
  const filteredEntries = entries.filter(entry => {
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
  
  // Calculate daily summaries for the dashboard
  const dailySummaries = calculateDailySummaries(entries, employees);
  
  // Calculate statistics for the dashboard header
  const stats = calculateWorkHourStatistics(dailySummaries, employees);
  
  // Handle approval/rejection of entries
  const handleApprove = (entryId: string) => {
    updateEntryStatus(entryId, 'approved');
  };
  
  const handleReject = (entryId: string) => {
    updateEntryStatus(entryId, 'rejected');
  };
  
  // Handle bulk approval of all pending entries
  const handleBulkApprove = () => {
    bulkApprove('all');
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel de Controle</h1>
        
        <DashboardHeader 
          totalEntries={entries.length}
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
                  employees={employees}
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
                onBulkApprove={profile?.role === 'admin' || profile?.role === 'supervisor' ? handleBulkApprove : undefined}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="resumo">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <DashboardFilters
                  employees={employees}
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
