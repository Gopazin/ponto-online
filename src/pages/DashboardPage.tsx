
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock employees data
const mockEmployees = [
  { id: '1', name: 'John Employee', email: 'employee@example.com', role: 'employee', department: 'IT' },
  { id: '4', name: 'Alice Worker', email: 'alice@example.com', role: 'employee', department: 'Marketing' },
  { id: '5', name: 'Bob Doer', email: 'bob@example.com', role: 'employee', department: 'Finance' },
  { id: '6', name: 'Carol Expert', email: 'carol@example.com', role: 'employee', department: 'HR' }
];

// Mock time entry data
interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'check-in' | 'check-out' | 'break-start' | 'break-end';
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

const generateMockTimeEntries = (): TimeEntry[] => {
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

const DashboardPage: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  useEffect(() => {
    // Load mock time entries
    setTimeEntries(generateMockTimeEntries());
    
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
  
  // Group entries by employee and date for summary view
  const entriesByEmployeeAndDate = sortedEntries.reduce<Record<string, Record<string, TimeEntry[]>>>(
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
    const employee = mockEmployees.find(e => e.id === employeeId);
    
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
        hasPendingEntries: sortedDayEntries.some(e => e.status === 'pending')
      };
    });
  }).flat();
  
  // Calculate who has the most and least total hours
  const mostHours = { name: '', hours: 0 };
  const leastHours = { name: '', hours: Number.MAX_SAFE_INTEGER };
  
  // Group summary by employee to get total hours per employee
  const hoursByEmployee: Record<string, number> = {};
  
  dailySummaries.forEach(summary => {
    const employeeId = summary.employeeId;
    const employeeName = summary.employeeName;
    const hours = parseInt(summary.totalHours.split('h')[0]);
    const minutes = parseInt(summary.totalHours.split('h ')[1].split('m')[0]);
    const totalMinutes = hours * 60 + minutes;
    
    if (!hoursByEmployee[employeeId]) {
      hoursByEmployee[employeeId] = 0;
    }
    
    hoursByEmployee[employeeId] += totalMinutes;
  });
  
  // Find most and least hours
  Object.entries(hoursByEmployee).forEach(([employeeId, minutes]) => {
    const employee = mockEmployees.find(e => e.id === employeeId);
    const hours = minutes / 60;
    
    if (hours > mostHours.hours) {
      mostHours.name = employee?.name || 'Unknown';
      mostHours.hours = hours;
    }
    
    if (hours < leastHours.hours) {
      leastHours.name = employee?.name || 'Unknown';
      leastHours.hours = hours;
    }
  });
  
  // Format date options for filter
  const dateOptions = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    const dateLabel = date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
    
    dateOptions.push({ value: dateStr, label: dateLabel });
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-status-approved';
      case 'rejected': return 'bg-status-rejected';
      default: return 'bg-status-pending';
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'check-in': return 'Entrada';
      case 'check-out': return 'Saída';
      case 'break-start': return 'Início Intervalo';
      case 'break-end': return 'Fim Intervalo';
      default: return type;
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'check-in': return 'bg-status-check-in';
      case 'check-out': return 'bg-status-check-out';
      case 'break-start':
      case 'break-end': return 'bg-status-break';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel de Controle</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de Registros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{timeEntries.length}</div>
              <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Mais Horas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">{mostHours.name}</div>
              <p className="text-sm text-muted-foreground">
                {mostHours.hours.toFixed(1)} horas na semana
              </p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Menos Horas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">{leastHours.name}</div>
              <p className="text-sm text-muted-foreground">
                {leastHours.hours.toFixed(1)} horas na semana
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="registros">
          <TabsList className="mb-6">
            <TabsTrigger value="registros">Registros</TabsTrigger>
            <TabsTrigger value="resumo">Resumo Diário</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registros">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Funcionário</label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os funcionários" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">Todos os funcionários</SelectItem>
                          {mockEmployees.map(employee => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Data</label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as datas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="">Todas as datas</SelectItem>
                          {dateOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">Todos os status</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="approved">Aprovado</SelectItem>
                          <SelectItem value="rejected">Rejeitado</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">Todos os tipos</SelectItem>
                          <SelectItem value="check-in">Entrada</SelectItem>
                          <SelectItem value="check-out">Saída</SelectItem>
                          <SelectItem value="break-start">Início intervalo</SelectItem>
                          <SelectItem value="break-end">Fim intervalo</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Funcionário
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data & Hora
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedEntries.length > 0 ? (
                      sortedEntries.map(entry => (
                        <tr key={entry.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {entry.employeeName}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(entry.timestamp).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(entry.timestamp).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`status-badge ${getTypeColor(entry.type)}`}>
                              {getTypeLabel(entry.type)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`status-badge ${getStatusColor(entry.status)}`}>
                              {entry.status === 'pending' ? 'Pendente' : 
                               entry.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            {entry.status === 'pending' && (
                              <div className="flex justify-end space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleApprove(entry.id)}
                                >
                                  Aprovar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(entry.id)}
                                >
                                  Rejeitar
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                          Nenhum registro encontrado com os filtros selecionados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resumo">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Funcionário</label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os funcionários" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">Todos os funcionários</SelectItem>
                          {mockEmployees.map(employee => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Data</label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as datas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="">Todas as datas</SelectItem>
                          {dateOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Funcionário
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entrada
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saída
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Intervalo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Horas
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dailySummaries
                      .filter(summary => 
                        (selectedEmployee === 'all' || summary.employeeId === selectedEmployee) &&
                        (!selectedDate || summary.date === selectedDate)
                      )
                      .sort((a, b) => {
                        // Sort by date (newest first) and then by employee name
                        const dateCompare = b.date.localeCompare(a.date);
                        if (dateCompare !== 0) return dateCompare;
                        return a.employeeName.localeCompare(b.employeeName);
                      })
                      .map((summary, index) => {
                        const checkIn = summary.entries.find(e => e.type === 'check-in');
                        const checkOut = summary.entries.find(e => e.type === 'check-out');
                        
                        return (
                          <tr key={`${summary.employeeId}-${summary.date}-${index}`}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {summary.employeeName}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(summary.date).toLocaleDateString('pt-BR', {
                                  weekday: 'short',
                                  day: '2-digit',
                                  month: '2-digit'
                                })}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {checkIn ? new Date(checkIn.timestamp).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '-'}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {checkOut ? new Date(checkOut.timestamp).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '-'}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {summary.breakDuration}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {summary.totalHours}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              {summary.hasPendingEntries ? (
                                <span className="status-badge bg-status-pending">
                                  Pendente
                                </span>
                              ) : (
                                <span className="status-badge bg-status-approved">
                                  Completo
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
