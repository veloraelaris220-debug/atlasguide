import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FloatingChatButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xs font-medium text-muted-foreground bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-border"
      >
        Travel Guide
      </motion.span>

      {/* Animated Circle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate('/chat')}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-ocean to-primary shadow-elevated flex items-center justify-center text-primary-foreground"
      >
        {/* Outer pulsing ring */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />

        {/* Second pulsing ring (offset) */}
        <motion.span
          className="absolute inset-0 rounded-full border border-ocean/20"
          animate={{ scale: [1, 1.55, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* Inner glow */}
        <motion.span
          className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />

        {/* Bot icon with subtle animation */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <Bot className="w-7 h-7" strokeWidth={1.8} />
        </motion.div>

        {/* Online dot */}
        <motion.div
          className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-background"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </motion.button>
    </div>
  );
};
