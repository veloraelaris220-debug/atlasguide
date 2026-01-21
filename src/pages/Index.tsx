import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Map, Grid3X3 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { DestinationCard } from '@/components/DestinationCard';
import { DestinationFilters } from '@/components/DestinationFilters';
import { ItineraryCalendar } from '@/components/ItineraryCalendar';
import { DestinationModal } from '@/components/DestinationModal';
import { DestinationMap } from '@/components/DestinationMap';
import { destinations, Destination, Category, Continent } from '@/data/destinations';

type ViewMode = 'grid' | 'map';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<Continent>('All');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [viewingDestination, setViewingDestination] = useState<Destination | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesSearch = 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesContinent = 
        selectedContinent === 'All' || dest.continent === selectedContinent;
      
      const matchesCategory = 
        selectedCategory === 'All' || dest.category === selectedCategory;

      return matchesSearch && matchesContinent && matchesCategory;
    });
  }, [searchQuery, selectedContinent, selectedCategory]);

  const handleSelectDestination = (destination: Destination) => {
    setSelectedDestinations((prev) => {
      const isSelected = prev.some((d) => d.id === destination.id);
      if (isSelected) {
        return prev.filter((d) => d.id !== destination.id);
      }
      return [...prev, destination];
    });
  };

  const handleRemoveDestination = (id: string) => {
    setSelectedDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  const handleViewDetails = (destination: Destination) => {
    setViewingDestination(destination);
  };

  const handleCloseModal = () => {
    setViewingDestination(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      <main className="container pb-20">
        {/* Destinations Section */}
        <section id="destinations" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Explore Destinations
              </h2>
              <p className="text-muted-foreground">
                {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} available
                {selectedDestinations.length > 0 && (
                  <span className="text-primary"> • {selectedDestinations.length} selected</span>
                )}
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'map' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
            </div>
          </motion.div>

          <DestinationFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedContinent={selectedContinent}
            onContinentChange={setSelectedContinent}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="mt-8">
              <DestinationMap
                destinations={filteredDestinations}
                onSelectDestination={handleSelectDestination}
                selectedDestinations={selectedDestinations}
                onViewDetails={handleViewDetails}
              />
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isSelected={selectedDestinations.some((d) => d.id === destination.id)}
                  onSelect={handleSelectDestination}
                  onViewDetails={handleViewDetails}
                  index={index}
                />
              ))}
            </div>
          )}

          {filteredDestinations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                No destinations found matching your criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedContinent('All');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-primary hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </section>

        {/* Itinerary Section */}
        <section id="itinerary">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Plan Your Journey
            </h2>
            <p className="text-muted-foreground">
              Build your personalized travel itinerary with dates and schedules
            </p>
          </motion.div>

          <ItineraryCalendar
            selectedDestinations={selectedDestinations}
            onRemoveDestination={handleRemoveDestination}
          />
        </section>
      </main>

      {/* Destination Detail Modal */}
      <DestinationModal
        destination={viewingDestination}
        isOpen={!!viewingDestination}
        onClose={handleCloseModal}
        isSelected={viewingDestination ? selectedDestinations.some((d) => d.id === viewingDestination.id) : false}
        onSelect={handleSelectDestination}
      />

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Wanderlust. Crafted with ❤️ for travelers worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
