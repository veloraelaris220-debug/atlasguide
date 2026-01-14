import { motion } from 'framer-motion';
import { Plane, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Wanderlust
            </span>
          </motion.a>

          {/* Desktop nav */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#destinations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </a>
            <a href="#itinerary" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Itinerary
            </a>
            <Button variant="default" size="sm" className="gradient-hero border-0">
              Start Planning
            </Button>
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
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-3">
            <a href="#destinations" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </a>
            <a href="#itinerary" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Itinerary
            </a>
            <Button variant="default" size="sm" className="w-full gradient-hero border-0">
              Start Planning
            </Button>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
