import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Gift, Users } from 'lucide-react';

interface AnalyticsProps {
  coupleId: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ coupleId }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-3xl font-bold">Relatórios</h2>
        <p className="text-muted-foreground">Acompanhe o progresso da sua lista</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="wedding-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Arrecadado</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">Em breve</p>
          </CardContent>
        </Card>

        <Card className="wedding-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presentes Ganhos</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Em breve</p>
          </CardContent>
        </Card>

        <Card className="wedding-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contribuições</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Em breve</p>
          </CardContent>
        </Card>

        <Card className="wedding-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Em breve</p>
          </CardContent>
        </Card>
      </div>

      <Card className="wedding-card">
        <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
          <CardDescription>
            Em breve você terá acesso a relatórios completos sobre sua lista de presentes
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Relatórios detalhados em desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;