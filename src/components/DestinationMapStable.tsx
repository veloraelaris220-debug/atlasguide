import { useEffect, useMemo } from "react";
import { MapPin, Calendar, Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import * as L from "leaflet";

import type { Destination } from "@/data/destinations";
import { destinationCoordinates } from "@/components/DestinationMap";

interface DestinationMapStableProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  selectedDestinations: Destination[];
  onViewDetails: (destination: Destination) => void;
}

function useLeafletDefaultIcons() {
  useEffect(() => {
    // Fix default marker icons (Vite doesn't bundle Leaflet's default image assets by default)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);
}

function MapController({ destinations }: { destinations: Destination[] }) {
  const map = useMap();

  useEffect(() => {
    const validCoords = destinations
      .filter((d) => destinationCoordinates[d.id])
      .map((d) => destinationCoordinates[d.id]);

    if (validCoords.length === 0) return;

    const bounds = L.latLngBounds(validCoords as any);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [destinations, map]);

  return null;
}

function categoryBg(category: string) {
  // Use theme tokens only (HSL CSS variables)
  switch (category) {
    case "beach":
      return "hsl(var(--ocean))";
    case "nature":
      return "hsl(var(--forest))";
    case "adventure":
      return "hsl(var(--sunset))";
    case "cultural":
      return "hsl(var(--accent))";
    case "romantic":
      return "hsl(var(--accent))";
    case "city":
    default:
      return "hsl(var(--primary))";
  }
}

export function DestinationMapStable({
  destinations,
  onSelectDestination,
  selectedDestinations,
  onViewDetails,
}: DestinationMapStableProps) {
  useLeafletDefaultIcons();

  const iconsByCategory = useMemo(() => {
    const cache = new Map<string, L.DivIcon>();
    const get = (category: string) => {
      const key = category || "default";
      const cached = cache.get(key);
      if (cached) return cached;

      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background: ${categoryBg(key)};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid hsl(var(--background));
            box-shadow: 0 2px 8px hsl(var(--foreground) / 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              color: hsl(var(--primary-foreground));
              font-size: 14px;
              line-height: 1;
            ">📍</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      cache.set(key, icon);
      return icon;
    };

    return { get };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-border shadow-elevated"
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        className="z-0 rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController destinations={destinations} />

        {destinations.map((destination) => {
          const coords = destinationCoordinates[destination.id];
          if (!coords) return null;

          const isSelected = selectedDestinations.some(
            (d) => d.id === destination.id,
          );

          return (
            <Marker
              key={destination.id}
              position={coords as any}
              icon={iconsByCategory.get(destination.category)}
            >
              <Popup className="destination-popup">
                <div className="p-1 min-w-[200px]">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    loading="lazy"
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-bold text-lg">{destination.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{destination.country}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {destination.bestTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      {destination.avgTemp}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewDetails(destination)}
                      className="flex-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onSelectDestination(destination)}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        isSelected
                          ? "bg-forest text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {isSelected ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border z-[1000]">
        <h4 className="text-xs font-semibold mb-2">Categories</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            { name: "Beach", color: "hsl(var(--ocean))" },
            { name: "City", color: "hsl(var(--primary))" },
            { name: "Nature", color: "hsl(var(--forest))" },
            { name: "Adventure", color: "hsl(var(--sunset))" },
            { name: "Cultural", color: "hsl(var(--accent))" },
            { name: "Romantic", color: "hsl(var(--accent))" },
          ].map((cat) => (
            <div key={cat.name} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
