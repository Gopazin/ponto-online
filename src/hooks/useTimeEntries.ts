
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { TimeEntry } from '@/types/timeEntry';

export const useTimeEntries = (refresh = false) => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  
  // Function to fetch time entries
  const fetchTimeEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let query = supabase.from('time_entries').select('*');
      
      // For employees, only show their own entries
      if (profile?.role === 'employee') {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching time entries:', error);
        toast({
          title: 'Erro ao carregar registros',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }
      
      // Map the Supabase data to our TimeEntry interface
      const timeEntries: TimeEntry[] = data.map(entry => ({
        id: entry.id,
        employeeId: entry.user_id,
        employeeName: entry.user_id, // Will be replaced with real name later
        type: entry.type,
        timestamp: entry.timestamp,
        status: entry.status,
        notes: entry.notes
      }));
      
      // Get unique employee IDs to fetch their names
      const employeeIds = [...new Set(timeEntries.map(entry => entry.employeeId))];
      
      // Fetch employee names
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', employeeIds);
      
      if (profilesError) {
        console.error('Error fetching employee names:', profilesError);
      } else {
        // Create a map of employee ID to name
        const employeeNames = Object.fromEntries(
          profilesData.map(profile => [profile.id, profile.name])
        );
        
        // Update time entries with employee names
        for (const entry of timeEntries) {
          entry.employeeName = employeeNames[entry.employeeId] || 'Unknown';
        }
      }
      
      setEntries(timeEntries);
    } catch (error) {
      console.error('Error in fetchTimeEntries:', error);
      toast({
        title: 'Erro ao carregar registros',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new time entry
  const createTimeEntry = async (type: 'check-in' | 'check-out' | 'break-start' | 'break-end', notes?: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          user_id: user.id,
          type,
          timestamp: new Date().toISOString(),
          notes,
        })
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating time entry:', error);
        toast({
          title: 'Erro ao registrar ponto',
          description: error.message,
          variant: 'destructive'
        });
        return null;
      }
      
      // Add the new entry to local state
      const newEntry: TimeEntry = {
        id: data.id,
        employeeId: data.user_id,
        employeeName: profile?.name || 'Unknown',
        type: data.type,
        timestamp: data.timestamp,
        status: data.status,
        notes: data.notes
      };
      
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (error) {
      console.error('Error in createTimeEntry:', error);
      toast({
        title: 'Erro ao registrar ponto',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Approve or reject a time entry
  const updateEntryStatus = async (entryId: string, status: 'approved' | 'rejected') => {
    if (!user || !['admin', 'supervisor'].includes(profile?.role || '')) {
      toast({
        title: 'Permissão negada',
        description: 'Você não tem permissão para esta ação',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('time_entries')
        .update({
          status,
          approved_by: user.id
        })
        .eq('id', entryId);
      
      if (error) {
        console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} time entry:`, error);
        toast({
          title: `Erro ao ${status === 'approved' ? 'aprovar' : 'rejeitar'} registro`,
          description: error.message,
          variant: 'destructive'
        });
        return;
      }
      
      // Update local state
      setEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, status } 
            : entry
        )
      );
      
      toast({
        title: `Registro ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`
      });
    } catch (error) {
      console.error(`Error in ${status === 'approved' ? 'approve' : 'reject'} entry:`, error);
      toast({
        title: `Erro ao ${status === 'approved' ? 'aprovar' : 'rejeitar'} registro`,
        variant: 'destructive'
      });
    }
  };

  // Approve multiple entries at once
  const bulkApprove = async (entryIds: string[] | 'all', status: 'approved' | 'rejected' = 'approved') => {
    if (!user || !['admin', 'supervisor'].includes(profile?.role || '')) {
      toast({
        title: 'Permissão negada',
        description: 'Você não tem permissão para esta ação',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      let query = supabase
        .from('time_entries')
        .update({
          status,
          approved_by: user.id
        });
      
      if (entryIds === 'all') {
        // Approve all pending entries
        query = query.eq('status', 'pending');
      } else {
        // Approve specified entries
        query = query.in('id', entryIds);
      }
      
      const { error } = await query;
      
      if (error) {
        console.error(`Error bulk ${status === 'approved' ? 'approving' : 'rejecting'} entries:`, error);
        toast({
          title: `Erro ao ${status === 'approved' ? 'aprovar' : 'rejeitar'} registros em lote`,
          description: error.message,
          variant: 'destructive'
        });
        return;
      }
      
      // Refresh the entries list
      fetchTimeEntries();
      
      toast({
        title: `Registros ${status === 'approved' ? 'aprovados' : 'rejeitados'} com sucesso`
      });
    } catch (error) {
      console.error(`Error in bulk ${status === 'approved' ? 'approve' : 'reject'}:`, error);
      toast({
        title: `Erro ao ${status === 'approved' ? 'aprovar' : 'rejeitar'} registros em lote`,
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchTimeEntries();
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [user, refresh]);
  
  return {
    entries,
    loading,
    createTimeEntry,
    updateEntryStatus,
    bulkApprove,
    refreshEntries: fetchTimeEntries
  };
};
