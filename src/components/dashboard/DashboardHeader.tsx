
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardHeaderProps {
  totalEntries: number;
  mostHours: { name: string; hours: number };
  leastHours: { name: string; hours: number };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  totalEntries, 
  mostHours, 
  leastHours 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="dashboard-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total de Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalEntries}</div>
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
  );
};

export default DashboardHeader;
