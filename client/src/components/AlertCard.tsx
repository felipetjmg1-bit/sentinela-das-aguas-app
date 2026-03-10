import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, Clock, AlertTriangle } from "lucide-react";

interface AlertCardProps {
  id: number;
  level: "low" | "medium" | "high" | "critical";
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  imageUrl?: string;
  onResolve?: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

export function AlertCard({
  id,
  level,
  description,
  location,
  latitude,
  longitude,
  createdAt,
  imageUrl,
  onResolve,
  onViewDetails,
}: AlertCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "destructive";
      case "high":
        return "secondary";
      case "medium":
        return "outline";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "critical":
        return "Crítico";
      case "high":
        return "Alto";
      case "medium":
        return "Médio";
      case "low":
        return "Baixo";
      default:
        return level;
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString("pt-BR");
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt="Alert evidence"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alerta de Enchente
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant={getLevelColor(level) as any}>
            {getLevelLabel(level)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}
        {latitude && longitude && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>
              Coordenadas: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          </div>
        )}
        {createdAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(createdAt)}</span>
          </div>
        )}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(id)}
            className="flex-1"
          >
            Ver Detalhes
          </Button>
          {level === "critical" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onResolve?.(id)}
              className="flex-1"
            >
              Resolver
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
