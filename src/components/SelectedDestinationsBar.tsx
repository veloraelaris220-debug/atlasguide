import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Destination } from '@/data/destinations';

interface SelectedDestinationsBarProps {
  selectedDestinations: Destination[];
  onRemove: (id: string) => void;
  onPlanClick: () => void;
}

export function SelectedDestinationsBar({ 
  selectedDestinations, 
  onRemove, 
  onPlanClick 
}: SelectedDestinationsBarProps) {
  if (selectedDestinations.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border shadow-lg"
    >
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-foreground hidden sm:inline">
                {selectedDestinations.length} selected
              </span>
              <span className="font-medium text-foreground sm:hidden">
                {selectedDestinations.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {selectedDestinations.slice(0, 4).map((dest) => (
                  <motion.div
                    key={dest.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full shrink-0"
                  >
                    <span className="text-sm font-medium text-foreground truncate max-w-24">
                      {dest.name}
                    </span>
                    <button
                      onClick={() => onRemove(dest.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {selectedDestinations.length > 4 && (
                <span className="text-sm text-muted-foreground shrink-0">
                  +{selectedDestinations.length - 4} more
                </span>
              )}
            </div>
          </div>

          <Button 
            onClick={onPlanClick}
            className="gradient-hero border-0 gap-2 shrink-0"
          >
            <span className="hidden sm:inline">Plan Journey</span>
            <span className="sm:hidden">Plan</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
