import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { InteractiveMap } from "@/components/InteractiveMap";
import { AlertCard } from "@/components/AlertCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, MapPin, TrendingUp, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  // Fetch alerts
  const { data: alerts = [] } = trpc.alerts.getActive.useQuery();
  const { data: monitoringPoints = [] } = trpc.monitoring.getPoints.useQuery();

  // Transform data for map
  const alertMarkers = alerts.map((alert) => ({
    id: alert.id,
    latitude: alert.latitude ? Number(alert.latitude) : 0,
    longitude: alert.longitude ? Number(alert.longitude) : 0,
    level: alert.alertLevel as "low" | "medium" | "high" | "critical",
    description: alert.description || "Alerta sem descrição",
  }));

  const pointMarkers = monitoringPoints.map((point) => ({
    id: point.id,
    latitude: Number(point.latitude),
    longitude: Number(point.longitude),
    name: point.name,
    type: point.type,
    status: point.status,
  }));

  // Count alerts by level
  const alertStats = {
    critical: alerts.filter((a) => a.alertLevel === "critical").length,
    high: alerts.filter((a) => a.alertLevel === "high").length,
    medium: alerts.filter((a) => a.alertLevel === "medium").length,
    low: alerts.filter((a) => a.alertLevel === "low").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Monitoramento</h1>
            <p className="text-gray-500 mt-1">Sentinela das Águas - Sistema Anti-Enchentes</p>
          </div>
          <Button size="lg" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            Novo Alerta Manual
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{alertStats.critical}</div>
              <p className="text-xs text-gray-500 mt-1">Requerem ação imediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Alertas Altos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{alertStats.high}</div>
              <p className="text-xs text-gray-500 mt-1">Monitoramento próximo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pontos Monitorados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{monitoringPoints.length}</div>
              <p className="text-xs text-gray-500 mt-1">Bueiros e drenagens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList>
            <TabsTrigger value="map">Mapa Interativo</TabsTrigger>
            <TabsTrigger value="alerts">Alertas Ativos</TabsTrigger>
            <TabsTrigger value="monitoring">Pontos de Monitoramento</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Risco em Tempo Real</CardTitle>
                <CardDescription>
                  Visualize alertas e pontos de monitoramento no mapa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 rounded-lg overflow-hidden border">
                  <InteractiveMap
                    alerts={alertMarkers}
                    monitoringPoints={pointMarkers}
                    onMarkerClick={(marker) => {
                      if ("level" in marker) {
                        setSelectedAlert(marker.id);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alertas Ativos</CardTitle>
                <CardDescription>
                  {alerts.length} alerta(s) ativo(s) no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum alerta ativo no momento</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        id={alert.id}
                        level={alert.alertLevel as any}
                        description={alert.description || ""}
                        latitude={alert.latitude ? Number(alert.latitude) : undefined}
                        longitude={alert.longitude ? Number(alert.longitude) : undefined}
                        createdAt={alert.createdAt?.toISOString()}
                        imageUrl={alert.imageUrl || undefined}
                        onViewDetails={(id) => setSelectedAlert(id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pontos de Monitoramento</CardTitle>
                <CardDescription>
                  {monitoringPoints.length} ponto(s) cadastrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {monitoringPoints.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum ponto de monitoramento cadastrado</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {monitoringPoints.map((point) => (
                      <div
                        key={point.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{point.name}</h3>
                            <p className="text-sm text-gray-600">
                              Tipo: {point.type} | Status: {point.status}
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {point.riskLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
