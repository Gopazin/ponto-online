
import React from 'react';
import { DailySummary } from '@/types/timeEntry';

interface DailySummaryTableProps {
  summaries: DailySummary[];
  selectedEmployee: string;
  selectedDate: string;
}

const DailySummaryTable: React.FC<DailySummaryTableProps> = ({ 
  summaries,
  selectedEmployee,
  selectedDate
}) => {
  const filteredSummaries = summaries
    .filter(summary => 
      (selectedEmployee === 'all' || summary.employeeId === selectedEmployee) &&
      (!selectedDate || summary.date === selectedDate)
    )
    .sort((a, b) => {
      // Sort by date (newest first) and then by employee name
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.employeeName.localeCompare(b.employeeName);
    });

  return (
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
          {filteredSummaries.map((summary, index) => {
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
  );
};

export default DailySummaryTable;
