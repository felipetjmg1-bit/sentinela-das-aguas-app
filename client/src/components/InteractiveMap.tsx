import { useEffect, useRef } from "react";
import { MapView } from "./Map";

interface AlertMarker {
  id: number;
  latitude: number;
  longitude: number;
  level: "low" | "medium" | "high" | "critical";
  description: string;
}

interface MonitoringPointMarker {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  type: string;
  status: string;
}

interface InteractiveMapProps {
  alerts?: AlertMarker[];
  monitoringPoints?: MonitoringPointMarker[];
  onMarkerClick?: (marker: AlertMarker | MonitoringPointMarker) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function InteractiveMap({
  alerts = [],
  monitoringPoints = [],
  onMarkerClick,
  center = { lat: -19.8, lng: -43.9 }, // Belo Horizonte, MG
  zoom = 12,
}: InteractiveMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add alert markers
    alerts.forEach((alert) => {
      const color = getAlertColor(alert.level);
      const marker = new google.maps.Marker({
        position: { lat: Number(alert.latitude), lng: Number(alert.longitude) },
        map: mapRef.current,
        title: alert.description,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: color,
          fillOpacity: 0.8,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        onMarkerClick?.(alert);
      });

      markersRef.current.push(marker);
    });

    // Add monitoring point markers
    monitoringPoints.forEach((point) => {
      const marker = new google.maps.Marker({
        position: { lat: Number(point.latitude), lng: Number(point.longitude) },
        map: mapRef.current,
        title: point.name,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#0066cc",
          fillOpacity: 0.7,
          strokeColor: "#fff",
          strokeWeight: 2,
          rotation: 0,
        },
      });

      marker.addListener("click", () => {
        onMarkerClick?.(point);
      });

      markersRef.current.push(marker);
    });
  }, [alerts, monitoringPoints, onMarkerClick]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapView
        onMapReady={(map) => {
          mapRef.current = map;
          map.setCenter(center);
          map.setZoom(zoom);
        }}
      />
    </div>
  );
}

function getAlertColor(level: string): string {
  switch (level) {
    case "critical":
      return "#dc2626"; // Red
    case "high":
      return "#ea580c"; // Orange
    case "medium":
      return "#eab308"; // Yellow
    case "low":
      return "#22c55e"; // Green
    default:
      return "#6b7280"; // Gray
  }
}
