import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Destination } from '@/data/destinations';
import { MapPin, Calendar, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored markers based on category
const createCustomIcon = (category: string) => {
  const colors: Record<string, string> = {
    beach: '#0ea5e9',
    city: '#8b5cf6',
    nature: '#22c55e',
    adventure: '#f97316',
    cultural: '#ec4899',
    romantic: '#f43f5e',
  };
  
  const color = colors[category] || '#6366f1';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
        ">📍</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Coordinates mapping for destinations
export const destinationCoordinates: Record<string, [number, number]> = {
  // Europe
  paris: [48.8566, 2.3522],
  santorini: [36.3932, 25.4615],
  rome: [41.9028, 12.4964],
  barcelona: [41.3874, 2.1686],
  amsterdam: [52.3676, 4.9041],
  iceland: [64.1466, -21.9426],
  london: [51.5074, -0.1278],
  'swiss-alps': [46.8182, 8.2275],
  // Asia
  tokyo: [35.6762, 139.6503],
  bali: [-8.3405, 115.092],
  kyoto: [35.0116, 135.7681],
  maldives: [3.2028, 73.2207],
  thailand: [13.7563, 100.5018],
  vietnam: [20.9101, 107.1839],
  singapore: [1.3521, 103.8198],
  seoul: [37.5665, 126.978],
  dubai: [25.2048, 55.2708],
  petra: [30.3285, 35.4444],
  mumbai: [19.076, 72.8777],
  jaipur: [26.9124, 75.7873],
  kerala: [10.8505, 76.2711],
  varanasi: [25.3176, 82.9739],
  agra: [27.1767, 78.0081],
  goa: [15.2993, 74.124],
  ladakh: [34.1526, 77.5771],
  shimla: [31.1048, 77.1734],
  darjeeling: [27.041, 88.2663],
  udaipur: [24.5854, 73.7125],
  rishikesh: [30.0869, 78.2676],
  // Africa
  capetown: [-33.9249, 18.4241],
  marrakech: [31.6295, -7.9811],
  serengeti: [-2.3333, 34.8333],
  cairo: [30.0444, 31.2357],
  zanzibar: [-6.1659, 39.1989],
  mauritius: [-20.3484, 57.5522],
  victoria: [-4.6191, 55.4513],
  // North America
  'new-york': [40.7128, -74.006],
  'grand-canyon': [36.1069, -112.1129],
  hawaii: [19.8968, -155.5828],
  cancun: [21.1619, -86.8515],
  'costa-rica': [9.7489, -83.7534],
  vancouver: [49.2827, -123.1207],
  miami: [25.7617, -80.1918],
  'las-vegas': [36.1699, -115.1398],
  // South America
  'machu-picchu': [-13.1631, -72.545],
  'rio-de-janeiro': [-22.9068, -43.1729],
  patagonia: [-41.8101, -68.9063],
  galapagos: [-0.9538, -90.9656],
  'buenos-aires': [-34.6037, -58.3816],
  cartagena: [10.391, -75.4794],
  // Oceania
  sydney: [-33.8688, 151.2093],
  'queenstown-nz': [-45.0312, 168.6626],
  fiji: [-17.7134, 178.065],
  'great-barrier-reef': [-18.2871, 147.6992],
  'bora-bora': [-16.5004, -151.7415],
  melbourne: [-37.8136, 144.9631],
};

interface DestinationMapProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  selectedDestinations: Destination[];
  onViewDetails: (destination: Destination) => void;
}

function MapController({ destinations }: { destinations: Destination[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (destinations.length > 0) {
      const bounds = L.latLngBounds(
        destinations
          .filter(d => destinationCoordinates[d.id])
          .map(d => destinationCoordinates[d.id])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [destinations, map]);
  
  return null;
}

export function DestinationMap({ 
  destinations, 
  onSelectDestination, 
  selectedDestinations,
  onViewDetails 
}: DestinationMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-border shadow-elevated"
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController destinations={destinations} />
        
        {destinations.map((destination) => {
          const coords = destinationCoordinates[destination.id];
          if (!coords) return null;
          
          const isSelected = selectedDestinations.some(d => d.id === destination.id);
          
          return (
            <Marker
              key={destination.id}
              position={coords}
              icon={createCustomIcon(destination.category)}
            >
              <Popup className="destination-popup">
                <div className="p-1 min-w-[200px]">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-bold text-lg">{destination.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{destination.country}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
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
                          ? 'bg-green-500 text-white' 
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {isSelected ? '✓ Added' : '+ Add'}
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
            { name: 'Beach', color: '#0ea5e9' },
            { name: 'City', color: '#8b5cf6' },
            { name: 'Nature', color: '#22c55e' },
            { name: 'Adventure', color: '#f97316' },
            { name: 'Cultural', color: '#ec4899' },
            { name: 'Romantic', color: '#f43f5e' },
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
