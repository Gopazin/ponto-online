
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useTimeEntries } from '@/hooks/useTimeEntries';

type TimeEntryType = 'check-in' | 'break-start' | 'break-end' | 'check-out';

const getButtonColor = (type: TimeEntryType) => {
  switch (type) {
    case 'check-in': return 'bg-status-check-in';
    case 'break-start': 
    case 'break-end': return 'bg-status-break';
    case 'check-out': return 'bg-status-check-out';
    default: return 'bg-gray-400';
  }
};

const getTypeLabel = (type: TimeEntryType): string => {
  switch (type) {
    case 'check-in': return 'Entrada';
    case 'break-start': return 'Início Intervalo';
    case 'break-end': return 'Fim Intervalo';
    case 'check-out': return 'Saída';
    default: return '';
  }
};

const ClockPage: React.FC = () => {
  const { user } = useAuth();
  const { entries, createTimeEntry } = useTimeEntries(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTimeEntryType, setActiveTimeEntryType] = useState<TimeEntryType | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Clock update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Online status effect
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Determine active state based on today's entries
  useEffect(() => {
    if (entries.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      
      // Filter entries for today and sort by timestamp (newest first)
      const todayEntries = entries
        .filter(entry => entry.timestamp.startsWith(today))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      if (todayEntries.length > 0) {
        const lastEntry = todayEntries[0];
        
        switch (lastEntry.type) {
          case 'check-in': setActiveTimeEntryType('check-in'); break;
          case 'break-start': setActiveTimeEntryType('break-start'); break;
          case 'break-end': setActiveTimeEntryType('break-end'); break;
          case 'check-out': setActiveTimeEntryType(null); break;
          default: setActiveTimeEntryType(null);
        }
      } else {
        setActiveTimeEntryType(null);
      }
    }
  }, [entries]);

  // Determine which buttons should be enabled based on the current state
  const getEnabledButtons = () => {
    if (!activeTimeEntryType) {
      return { checkIn: true, breakStart: false, breakEnd: false, checkOut: false };
    }
    
    switch (activeTimeEntryType) {
      case 'check-in':
        return { checkIn: false, breakStart: true, breakEnd: false, checkOut: true };
      case 'break-start':
        return { checkIn: false, breakStart: false, breakEnd: true, checkOut: false };
      case 'break-end':
        return { checkIn: false, breakStart: true, breakEnd: false, checkOut: true };
      default:
        return { checkIn: true, breakStart: false, breakEnd: false, checkOut: false };
    }
  };

  const buttons = getEnabledButtons();

  const handleCreateTimeEntry = async (type: TimeEntryType) => {
    if (!user) return;
    
    const result = await createTimeEntry(type);
    
    if (result) {
      // Update active state
      setActiveTimeEntryType(type);
      
      // Show success message
      toast.success(`${getTypeLabel(type)} registrado com sucesso!`);
    }
  };

  // Format date for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get recent entries (last 7 days)
  const recentEntries = entries
    .filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return entryDate >= sevenDaysAgo;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Group entries by date
  const entriesByDate = recentEntries.reduce<Record<string, typeof entries>>((acc, entry) => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Clock section */}
          <div className="md:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Registro de Ponto</CardTitle>
                <CardDescription className="text-center">
                  {formatDate(currentDate)}
                  <div className="text-3xl font-bold mt-2">
                    {formatTime(currentDate)}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <button
                      onClick={() => handleCreateTimeEntry('check-in')}
                      disabled={!buttons.checkIn}
                      className={`clock-button ${getButtonColor('check-in')} ${activeTimeEntryType === 'check-in' ? 'clock-button-active' : ''}`}
                    >
                      <span className="text-lg font-bold">Entrada</span>
                      {activeTimeEntryType === 'check-in' && (
                        <span className="mt-1 text-xs">ATIVO</span>
                      )}
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => handleCreateTimeEntry('check-out')}
                      disabled={!buttons.checkOut}
                      className={`clock-button ${getButtonColor('check-out')}`}
                    >
                      <span className="text-lg font-bold">Saída</span>
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => handleCreateTimeEntry('break-start')}
                      disabled={!buttons.breakStart}
                      className={`clock-button ${getButtonColor('break-start')} ${activeTimeEntryType === 'break-start' ? 'clock-button-active' : ''}`}
                    >
                      <span className="text-lg font-bold">Início</span>
                      <span className="text-sm">Intervalo</span>
                      {activeTimeEntryType === 'break-start' && (
                        <span className="mt-1 text-xs">ATIVO</span>
                      )}
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => handleCreateTimeEntry('break-end')}
                      disabled={!buttons.breakEnd}
                      className={`clock-button ${getButtonColor('break-end')}`}
                    >
                      <span className="text-lg font-bold">Fim</span>
                      <span className="text-sm">Intervalo</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent entries section */}
          <div className="md:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>Histórico Recente</CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {Object.entries(entriesByDate).length > 0 ? (
                  Object.entries(entriesByDate).map(([date, entries]) => (
                    <div key={date} className="mb-4">
                      <h3 className="font-medium text-sm text-gray-500 mb-2">
                        {new Date(date).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </h3>
                      <div className="bg-white rounded-md border border-gray-200">
                        {entries.map(entry => (
                          <div key={entry.id} className="time-entry-row">
                            <div>
                              <span className={`status-badge ${getButtonColor(entry.type as TimeEntryType)}`}>
                                {getTypeLabel(entry.type as TimeEntryType)}
                              </span>
                            </div>
                            <div className="text-sm">
                              {formatTimestamp(entry.timestamp)}
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center text-xs ${
                                entry.status === 'approved' ? 'text-green-600' : 
                                entry.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                  entry.status === 'approved' ? 'bg-green-600' : 
                                  entry.status === 'rejected' ? 'bg-red-600' : 'bg-amber-600'
                                }`}></span>
                                {entry.status === 'approved' ? 'Aprovado' : 
                                 entry.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum registro nos últimos 7 dias
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClockPage;
