import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, FileText, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Sample data for charts
const alertsByLevelData = [
  { name: "Crítico", value: 12, fill: "#dc2626" },
  { name: "Alto", value: 28, fill: "#ea580c" },
  { name: "Médio", value: 45, fill: "#eab308" },
  { name: "Baixo", value: 89, fill: "#22c55e" },
];

const alertsTrendData = [
  { date: "01/03", alerts: 5, resolved: 3 },
  { date: "02/03", alerts: 8, resolved: 6 },
  { date: "03/03", alerts: 12, resolved: 9 },
  { date: "04/03", alerts: 15, resolved: 12 },
  { date: "05/03", alerts: 18, resolved: 14 },
  { date: "06/03", alerts: 22, resolved: 18 },
  { date: "07/03", alerts: 28, resolved: 24 },
];

const alertsByRegionData = [
  { region: "Centro", alerts: 35 },
  { region: "Zona Sul", alerts: 28 },
  { region: "Zona Norte", alerts: 42 },
  { region: "Zona Leste", alerts: 31 },
  { region: "Zona Oeste", alerts: 25 },
];

const responseTimeData = [
  { hour: "00:00", avgTime: 15 },
  { hour: "04:00", avgTime: 12 },
  { hour: "08:00", avgTime: 18 },
  { hour: "12:00", avgTime: 22 },
  { hour: "16:00", avgTime: 25 },
  { hour: "20:00", avgTime: 20 },
];

export default function Reports() {
  const [period, setPeriod] = useState<"24h" | "7d" | "30d">("7d");
  const [region, setRegion] = useState("all");

  // Fetch statistics
  const { data: stats } = trpc.reports.getStatistics.useQuery({ period, region: region !== "all" ? region : undefined });

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert("Exportar para PDF - Implementar com ReportLab/WeasyPrint");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Relatórios e Análises</h1>
            <p className="text-gray-500 mt-1">Visualize estatísticas e tendências de alertas</p>
          </div>
          <Button onClick={handleExportPDF} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>

          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as regiões</SelectItem>
              <SelectItem value="centro">Centro</SelectItem>
              <SelectItem value="sul">Zona Sul</SelectItem>
              <SelectItem value="norte">Zona Norte</SelectItem>
              <SelectItem value="leste">Zona Leste</SelectItem>
              <SelectItem value="oeste">Zona Oeste</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">174</div>
              <p className="text-xs text-gray-500 mt-1">+12% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">12</div>
              <p className="text-xs text-gray-500 mt-1">Requerem ação imediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">89%</div>
              <p className="text-xs text-gray-500 mt-1">Alertas resolvidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18 min</div>
              <p className="text-xs text-gray-500 mt-1">Para alertas críticos</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="trend" className="w-full">
          <TabsList>
            <TabsTrigger value="trend">Tendência</TabsTrigger>
            <TabsTrigger value="level">Por Nível</TabsTrigger>
            <TabsTrigger value="region">Por Região</TabsTrigger>
            <TabsTrigger value="response">Tempo de Resposta</TabsTrigger>
          </TabsList>

          {/* Trend Chart */}
          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Alertas</CardTitle>
                <CardDescription>
                  Alertas detectados vs. resolvidos ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={alertsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="alerts" stroke="#ef4444" name="Detectados" />
                    <Line type="monotone" dataKey="resolved" stroke="#22c55e" name="Resolvidos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Level Chart */}
          <TabsContent value="level">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Nível de Severidade</CardTitle>
                <CardDescription>
                  Proporção de alertas por nível
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-8">
                  <ResponsiveContainer width="50%" height={300}>
                    <PieChart>
                      <Pie
                        data={alertsByLevelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {alertsByLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {alertsByLevelData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm">{item.name}: {item.value} alertas</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Region Chart */}
          <TabsContent value="region">
            <Card>
              <CardHeader>
                <CardTitle>Alertas por Região</CardTitle>
                <CardDescription>
                  Distribuição geográfica dos alertas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={alertsByRegionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="alerts" fill="#3b82f6" name="Alertas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Response Time Chart */}
          <TabsContent value="response">
            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Resposta</CardTitle>
                <CardDescription>
                  Tempo de resposta por hora do dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis label={{ value: "Minutos", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => `${value} min`} />
                    <Line
                      type="monotone"
                      dataKey="avgTime"
                      stroke="#f59e0b"
                      name="Tempo Médio"
                      dot={{ fill: "#f59e0b" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Gerar Relatório
            </CardTitle>
            <CardDescription>
              Exporte relatórios técnicos em PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="w-5 h-5 mb-2" />
                <span className="text-sm">Relatório Diário</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="w-5 h-5 mb-2" />
                <span className="text-sm">Relatório Semanal</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="w-5 h-5 mb-2" />
                <span className="text-sm">Relatório Mensal</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
