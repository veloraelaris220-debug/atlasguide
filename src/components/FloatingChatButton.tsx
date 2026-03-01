import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FloatingChatButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/chat')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-primary to-ocean text-primary-foreground pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
    >
      {/* Animated pulsing ring */}
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-primary/40"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      />

      <motion.div
        className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>

      <span className="font-medium text-sm">Travel Guide</span>

      <motion.div
        className="absolute -top-1 -right-1 w-3 h-3 bg-sunset rounded-full"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
    </motion.button>
  );
};
