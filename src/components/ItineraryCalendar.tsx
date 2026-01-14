import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, differenceInDays, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, Trash2, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Destination } from '@/data/destinations';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface ItineraryItem {
  destination: Destination;
  startDate: Date;
  endDate: Date;
  notes?: string;
}

interface ItineraryCalendarProps {
  selectedDestinations: Destination[];
  onRemoveDestination: (id: string) => void;
}

export function ItineraryCalendar({ selectedDestinations, onRemoveDestination }: ItineraryCalendarProps) {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const addToItinerary = (destination: Destination) => {
    const lastItem = itinerary[itinerary.length - 1];
    const startDate = lastItem ? addDays(lastItem.endDate, 1) : new Date();
    const endDate = addDays(startDate, 3);

    setItinerary([...itinerary, { destination, startDate, endDate }]);
  };

  const updateDates = (index: number, range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return;
    
    const newItinerary = [...itinerary];
    newItinerary[index] = {
      ...newItinerary[index],
      startDate: range.from,
      endDate: range.to,
    };
    setItinerary(newItinerary);
    setEditingIndex(null);
  };

  const removeFromItinerary = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const getDaysCount = (start: Date, end: Date) => {
    return differenceInDays(end, start) + 1;
  };

  const unscheduledDestinations = selectedDestinations.filter(
    dest => !itinerary.some(item => item.destination.id === dest.id)
  );

  const totalDays = itinerary.reduce((acc, item) => acc + getDaysCount(item.startDate, item.endDate), 0);

  return (
    <div className="bg-card rounded-2xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Your Itinerary</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {itinerary.length} destination{itinerary.length !== 1 ? 's' : ''} • {totalDays} day{totalDays !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* Unscheduled destinations */}
      {unscheduledDestinations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Add to itinerary</h3>
          <div className="flex flex-wrap gap-2">
            {unscheduledDestinations.map((dest) => (
              <motion.button
                key={dest.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToItinerary(dest)}
                className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                <MapPin className="w-3 h-3" />
                {dest.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Itinerary Timeline */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {itinerary.map((item, index) => (
            <motion.div
              key={item.destination.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {/* Timeline connector */}
              {index > 0 && (
                <div className="absolute left-6 -top-4 w-0.5 h-4 bg-border" />
              )}

              <div className="flex gap-4 p-4 bg-secondary/50 rounded-xl group hover:bg-secondary transition-colors">
                {/* Drag handle */}
                <div className="flex items-center">
                  <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                </div>

                {/* Day indicator */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center">
                  <span className="text-xs font-medium">Day</span>
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>

                {/* Destination info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display font-semibold text-foreground">
                        {item.destination.name}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.destination.country}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Date picker */}
                      <Popover open={editingIndex === index} onOpenChange={(open) => setEditingIndex(open ? index : null)}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                          >
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {format(item.startDate, 'MMM d')} - {format(item.endDate, 'MMM d')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="range"
                            selected={{ from: item.startDate, to: item.endDate }}
                            onSelect={(range) => updateDates(index, range)}
                            numberOfMonths={2}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          removeFromItinerary(index);
                          onRemoveDestination(item.destination.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-ocean-light text-ocean text-xs font-medium">
                      {getDaysCount(item.startDate, item.endDate)} day{getDaysCount(item.startDate, item.endDate) !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.destination.bestTime}
                    </span>
                  </div>
                </div>

                {/* Destination image */}
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={item.destination.image}
                    alt={item.destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {itinerary.length === 0 && selectedDestinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">
              Click on a destination above to add it to your itinerary
            </p>
          </motion.div>
        )}

        {selectedDestinations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">
              Select destinations from the list to start planning your trip
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
