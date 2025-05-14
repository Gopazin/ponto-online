
import React from 'react';
import { Button } from "@/components/ui/button";
import { TimeEntry } from '@/types/timeEntry';

interface TimeEntryTableProps {
  entries: TimeEntry[];
  onApprove: (entryId: string) => void;
  onReject: (entryId: string) => void;
}

const TimeEntryTable: React.FC<TimeEntryTableProps> = ({ entries, onApprove, onReject }) => {
  
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
          {entries.length > 0 ? (
            entries.map(entry => (
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
                        onClick={() => onApprove(entry.id)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => onReject(entry.id)}
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
  );
};

export default TimeEntryTable;
