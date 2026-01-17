import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Thermometer, Star, Clock, Camera, ChevronLeft, ChevronRight, Plus, Check, UtensilsCrossed } from 'lucide-react';
import { Destination } from '@/data/destinations';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface DestinationModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  isSelected: boolean;
  onSelect: (destination: Destination) => void;
}

const categoryColors: Record<string, string> = {
  beach: 'bg-ocean-light text-ocean',
  city: 'bg-secondary text-foreground',
  nature: 'bg-forest-light text-forest',
  adventure: 'bg-sunset-light text-sunset',
  cultural: 'bg-primary/10 text-primary',
  romantic: 'bg-pink-100 text-pink-600',
};

// Generate gallery images based on destination
const generateGalleryImages = (destination: Destination): string[] => {
  // Use the main image and add variations with different Unsplash queries
  const baseImages = [
    destination.image,
    `https://images.unsplash.com/photo-${getRandomPhotoId(destination.name)}?w=800&q=80`,
    `https://images.unsplash.com/photo-${getRandomPhotoId(destination.country)}?w=800&q=80`,
    `https://images.unsplash.com/photo-${getRandomPhotoId(destination.category)}?w=800&q=80`,
  ];
  return baseImages;
};

// Simple hash function to get consistent "random" photo IDs
const getRandomPhotoId = (seed: string): string => {
  const photoIds = [
    '1506905925346-21bda4d32df4',
    '1469854523086-cc02fe5d8800',
    '1476514525535-07fb3b4ae5f1',
    '1530789253388-582c481c54b0',
    '1488085061387-422e29b40080',
    '1507525428034-b723cf961d3e',
    '1519904981063-b0cf448d479e',
    '1501785888041-af3ef285b470',
    '1493976040374-85c8e12f0c0e',
    '1528127269322-539801943592',
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return photoIds[Math.abs(hash) % photoIds.length];
};

export function DestinationModal({ destination, isOpen, onClose, isSelected, onSelect }: DestinationModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!destination) return null;

  const galleryImages = generateGalleryImages(destination);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <VisuallyHidden>
          <DialogTitle>{destination.name}</DialogTitle>
        </VisuallyHidden>
        
        {/* Hero Image Gallery */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={galleryImages[currentImageIndex]}
              alt={`${destination.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Gallery Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                )}
              />
            ))}
          </div>

          {/* Category Badge */}
          <span className={cn(
            "absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-medium capitalize",
            categoryColors[destination.category]
          )}>
            {destination.category}
          </span>

          {/* Gallery Icon */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
            <Camera className="w-4 h-4" />
            <span>{currentImageIndex + 1}/{galleryImages.length}</span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              {destination.name}
            </h2>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span>{destination.country}</span>
              <span className="text-white/50">•</span>
              <span>{destination.continent}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Best Time</p>
                <p className="text-sm font-medium">{destination.bestTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-sunset-light flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-sunset" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Temp</p>
                <p className="text-sm font-medium">{destination.avgTemp}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-forest-light flex items-center justify-center">
                <Clock className="w-5 h-5 text-forest" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">3-7 Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-ocean-light flex items-center justify-center">
                <Star className="w-5 h-5 text-ocean" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="text-sm font-medium">4.8/5</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-display text-xl font-semibold mb-3">About</h3>
            <p className="text-muted-foreground leading-relaxed">
              {destination.description}
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Discover the beauty and charm of {destination.name}, located in the heart of {destination.country}. 
              This {destination.category} destination offers travelers a unique blend of experiences, 
              from stunning natural landscapes to rich cultural heritage. Whether you're seeking adventure, 
              relaxation, or cultural immersion, {destination.name} has something special for every type of traveler.
            </p>
          </div>

          {/* Highlights */}
          <div className="mb-8">
            <h3 className="font-display text-xl font-semibold mb-4">Top Attractions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {destination.highlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-transparent border border-border/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Best Foods to Try */}
          {destination.foods && destination.foods.length > 0 && (
            <div className="mb-8">
              <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-sunset" />
                Best Foods to Try
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {destination.foods.map((food, index) => (
                  <motion.div
                    key={food}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-sunset-light/50 to-transparent border border-sunset/10"
                  >
                    <span className="text-lg">🍽️</span>
                    <span className="text-sm font-medium">{food}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Tips */}
          <div className="mb-8">
            <h3 className="font-display text-xl font-semibold mb-4">Travel Tips</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm">
                  <span className="font-semibold text-primary">Best Season:</span>{' '}
                  <span className="text-muted-foreground">
                    Visit during {destination.bestTime} for the most pleasant weather and experiences.
                  </span>
                </p>
              </div>
              <div className="p-4 rounded-xl bg-forest-light/50 border border-forest/10">
                <p className="text-sm">
                  <span className="font-semibold text-forest">Local Culture:</span>{' '}
                  <span className="text-muted-foreground">
                    Respect local customs and traditions. Learn a few basic phrases in the local language.
                  </span>
                </p>
              </div>
              <div className="p-4 rounded-xl bg-sunset-light/50 border border-sunset/10">
                <p className="text-sm">
                  <span className="font-semibold text-sunset">Packing Tip:</span>{' '}
                  <span className="text-muted-foreground">
                    Pack layers as temperatures can vary. Average temperature is around {destination.avgTemp}.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onSelect(destination)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {isSelected ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Itinerary
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add to Itinerary
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-semibold border border-border hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}