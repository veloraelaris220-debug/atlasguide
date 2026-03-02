import { motion } from 'framer-motion';
import { MapPin, Calendar, Thermometer, Plus, Check, Eye, Heart } from 'lucide-react';
import { Destination } from '@/data/destinations';
import { cn } from '@/lib/utils';

interface DestinationCardProps {
  destination: Destination;
  isSelected: boolean;
  onSelect: (destination: Destination) => void;
  onViewDetails: (destination: Destination) => void;
  index: number;
  isWishlisted?: boolean;
  onToggleWishlist?: (destinationId: string) => void;
}

const categoryColors: Record<string, string> = {
  beach: 'bg-ocean-light text-ocean',
  city: 'bg-secondary text-foreground',
  nature: 'bg-forest-light text-forest',
  adventure: 'bg-sunset-light text-sunset',
  cultural: 'bg-primary/10 text-primary',
  romantic: 'bg-pink-100 text-pink-600',
};

export function DestinationCard({ destination, isSelected, onSelect, onViewDetails, index, isWishlisted, onToggleWishlist }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card cursor-pointer transition-all duration-300",
        isSelected ? "ring-2 ring-primary shadow-card-hover" : "shadow-soft hover:shadow-elevated"
      )}
      onClick={() => onViewDetails(destination)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <span className={cn(
          "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium capitalize",
          categoryColors[destination.category]
        )}>
          {destination.category}
        </span>

        {/* Wishlist heart button */}
        {onToggleWishlist && (
          <button
            className={cn(
              "absolute top-3 right-12 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/40"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(destination.id);
            }}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </button>
        )}

        {/* Selection indicator */}
        <button
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/40"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(destination);
          }}
        >
          {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>

        {/* View Details Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-foreground font-medium text-sm shadow-lg">
            <Eye className="w-4 h-4" />
            View Details
          </div>
        </div>

        {/* Location overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-xl font-semibold text-white mb-1">
            {destination.name}
          </h3>
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <MapPin className="w-3 h-3" />
            <span>{destination.country}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {destination.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{destination.bestTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            <span>{destination.avgTemp}</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-3 flex flex-wrap gap-1">
          {destination.highlights.slice(0, 2).map((highlight) => (
            <span
              key={highlight}
              className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground"
            >
              {highlight}
            </span>
          ))}
          {destination.highlights.length > 2 && (
            <span className="px-2 py-0.5 text-xs text-muted-foreground">
              +{destination.highlights.length - 2} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
