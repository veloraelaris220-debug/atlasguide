import { motion } from 'framer-motion';
import { Compass, Menu, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isExplore = location.pathname === '/explore';

  const handleStartPlanning = () => {
    if (isExplore) {
      // Scroll to itinerary section when already on explore
      document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isHome 
        ? "bg-transparent" 
        : "bg-background/80 backdrop-blur-lg border-b border-border"
    )}>
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                Wanderlust
              </span>
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-8"
          >
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === '/' 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === '/explore' 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Explore
            </Link>
            {isHome && (
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
            )}
            {isExplore ? (
              <Button 
                variant="default" 
                size="sm" 
                className="gradient-hero border-0 gap-2"
                onClick={handleStartPlanning}
              >
                <MapPin className="w-4 h-4" />
                Plan Itinerary
              </Button>
            ) : (
              <Link to="/explore">
                <Button variant="default" size="sm" className="gradient-hero border-0">
                  Start Planning
                </Button>
              </Link>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile nav */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden bg-background/95 backdrop-blur-lg rounded-b-xl"
        >
          <div className="py-4 space-y-3 px-2">
            <Link 
              to="/" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Explore
            </Link>
            {isHome && (
              <a 
                href="#features" 
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
            )}
            {isExplore ? (
              <Button 
                variant="default" 
                size="sm" 
                className="w-full gradient-hero border-0 gap-2"
                onClick={() => {
                  handleStartPlanning();
                  setIsOpen(false);
                }}
              >
                <MapPin className="w-4 h-4" />
                Plan Itinerary
              </Button>
            ) : (
              <Link to="/explore" onClick={() => setIsOpen(false)}>
                <Button variant="default" size="sm" className="w-full gradient-hero border-0">
                  Start Planning
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
