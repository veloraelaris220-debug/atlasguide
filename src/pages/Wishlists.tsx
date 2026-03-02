import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { DestinationCard } from '@/components/DestinationCard';
import { DestinationModal } from '@/components/DestinationModal';
import { FloatingChatButton } from '@/components/FloatingChatButton';
import { useWishlist } from '@/hooks/useWishlist';
import { destinations, Destination } from '@/data/destinations';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Wishlists = () => {
  const { wishlistedIds, isWishlisted, toggleWishlist, loading, isLoggedIn } = useWishlist();
  const [viewingDestination, setViewingDestination] = useState<Destination | null>(null);

  const savedDestinations = useMemo(() => {
    return destinations.filter((d) => wishlistedIds.has(d.id));
  }, [wishlistedIds]);

  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">Sign in to save destinations</h1>
            <p className="text-muted-foreground mb-6">Create an account to build your personal wishlist of dream destinations.</p>
            <Link to="/auth">
              <Button className="gradient-hero border-0">Sign In</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                My Wishlist
              </h1>
              <p className="text-muted-foreground mt-1">
                {savedDestinations.length} saved destination{savedDestinations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="container pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : savedDestinations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Compass className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">No saved destinations yet</h2>
            <p className="text-muted-foreground mb-6">
              Explore destinations and tap the heart icon to save your favorites.
            </p>
            <Link to="/explore">
              <Button className="gradient-hero border-0 gap-2">
                <Compass className="w-4 h-4" />
                Explore Destinations
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {savedDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                isSelected={false}
                onSelect={() => {}}
                onViewDetails={setViewingDestination}
                index={index}
                isWishlisted={true}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </main>

      <DestinationModal
        destination={viewingDestination}
        isOpen={!!viewingDestination}
        onClose={() => setViewingDestination(null)}
        isSelected={false}
        onSelect={() => {}}
      />

      <FloatingChatButton />

      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Wanderlust. Crafted with ❤️ for travelers worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default Wishlists;
