import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { continents, categories, Category, Continent } from '@/data/destinations';
import { cn } from '@/lib/utils';

interface DestinationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedContinent: Continent;
  onContinentChange: (continent: Continent) => void;
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categoryIcons: Record<string, string> = {
  beach: '🏖️',
  city: '🏙️',
  nature: '🌿',
  adventure: '🧗',
  cultural: '🏛️',
  romantic: '💕',
};

export function DestinationFilters({
  searchQuery,
  onSearchChange,
  selectedContinent,
  onContinentChange,
  selectedCategory,
  onCategoryChange,
}: DestinationFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 rounded-xl border-border bg-card shadow-soft focus:shadow-elevated transition-shadow"
        />
      </div>

      {/* Continent Filter */}
      <div className="flex flex-wrap gap-2">
        {continents.map((continent) => (
          <motion.button
            key={continent}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onContinentChange(continent)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              selectedContinent === continent
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-card text-muted-foreground hover:bg-secondary"
            )}
          >
            {continent}
          </motion.button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
              selectedCategory === category
                ? "bg-accent text-accent-foreground shadow-soft"
                : "bg-card text-muted-foreground hover:bg-secondary"
            )}
          >
            {category !== 'All' && <span>{categoryIcons[category]}</span>}
            <span className="capitalize">{category}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
