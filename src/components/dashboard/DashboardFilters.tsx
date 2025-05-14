
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

interface DashboardFiltersProps {
  employees: { id: string; name: string }[];
  dateOptions: FilterOption[];
  selectedEmployee: string;
  setSelectedEmployee: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  selectedStatus?: string;
  setSelectedStatus?: (value: string) => void;
  selectedType?: string;
  setSelectedType?: (value: string) => void;
  showTypeAndStatus?: boolean;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  employees,
  dateOptions,
  selectedEmployee,
  setSelectedEmployee,
  selectedDate,
  setSelectedDate,
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  showTypeAndStatus = false
}) => {
  return (
    <div className={`grid grid-cols-1 ${showTypeAndStatus ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-4`}>
      <div>
        <label className="text-sm font-medium mb-1 block">Funcionário</label>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os funcionários" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todos os funcionários</SelectItem>
              {employees.map(employee => (
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
              <SelectItem value="none">Todas as datas</SelectItem>
              {dateOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {showTypeAndStatus && setSelectedStatus && (
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
      )}
      
      {showTypeAndStatus && setSelectedType && (
        <div>
          <label className="text-sm font-medium mb-1 block">Tipo</label>
          <Select value={selectedType || "all"} onValueChange={setSelectedType}>
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
      )}
    </div>
  );
};

export default DashboardFilters;
