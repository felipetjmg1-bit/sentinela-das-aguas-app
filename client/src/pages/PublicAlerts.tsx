import { useState } from "react";
import { InteractiveMap } from "@/components/InteractiveMap";
import { AlertCard } from "@/components/AlertCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, MapPin, Bell, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PublicAlerts() {
  const [radiusKm, setRadiusKm] = useState(5);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch active alerts
  const { data: alerts = [] } = trpc.alerts.getActive.useQuery();

  // Get user location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  // Filter alerts by proximity if user location is available
  const nearbyAlerts = userLocation
    ? alerts.filter((alert) => {
        if (!alert.latitude || !alert.longitude) return false;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          Number(alert.latitude),
          Number(alert.longitude)
        );
        return distance <= radiusKm;
      })
    : alerts;

  const alertMarkers = nearbyAlerts.map((alert) => ({
    id: alert.id,
    latitude: alert.latitude ? Number(alert.latitude) : 0,
    longitude: alert.longitude ? Number(alert.longitude) : 0,
    level: alert.alertLevel as "low" | "medium" | "high" | "critical",
    description: alert.description || "Alerta sem descrição",
  }));

  // Count critical alerts
  const criticalCount = nearbyAlerts.filter((a) => a.alertLevel === "critical").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sentinela das Águas</h1>
                <p className="text-sm text-gray-600">Alertas de Enchentes em Tempo Real</p>
              </div>
            </div>
            <Button onClick={handleGetLocation} variant="outline" className="gap-2">
              <MapPin className="w-4 h-4" />
              Minha Localização
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Critical Alert Banner */}
        {criticalCount > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">
                {criticalCount} Alerta(s) Crítico(s) Detectado(s)
              </h3>
              <p className="text-sm text-red-800 mt-1">
                Há enchentes críticas na sua região. Evite áreas de risco e siga as orientações da Defesa Civil.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Alertas</CardTitle>
                <CardDescription>
                  Visualize os alertas de enchente na sua região
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 rounded-lg overflow-hidden border">
                  <InteractiveMap
                    alerts={alertMarkers}
                    center={userLocation || { lat: -19.8, lng: -43.9 }}
                    zoom={userLocation ? 14 : 12}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Radius Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Raio de Busca</label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="range"
                      min="1"
                      max="50"
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">{radiusKm} km</span>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <Bell className="w-4 h-4" />
                  Receber Notificações
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Alertas Críticos</span>
                  <span className="font-bold text-red-600">{nearbyAlerts.filter((a) => a.alertLevel === "critical").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Alertas Altos</span>
                  <span className="font-bold text-orange-600">{nearbyAlerts.filter((a) => a.alertLevel === "high").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total de Alertas</span>
                  <span className="font-bold text-blue-600">{nearbyAlerts.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alerts List */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Próximos a Você</CardTitle>
              <CardDescription>
                {nearbyAlerts.length} alerta(s) encontrado(s) em um raio de {radiusKm} km
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nearbyAlerts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum alerta na sua região no momento</p>
                  <p className="text-sm mt-1">Você está seguro!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nearbyAlerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      id={alert.id}
                      level={alert.alertLevel as any}
                      description={alert.description || ""}
                      latitude={alert.latitude ? Number(alert.latitude) : undefined}
                      longitude={alert.longitude ? Number(alert.longitude) : undefined}
                      createdAt={alert.createdAt?.toISOString()}
                      imageUrl={alert.imageUrl || undefined}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
