import { motion } from 'framer-motion';

export const AIBotAnimation = () => {
  const containerVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const rotateVariants = {
    animate: {
      rotateZ: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const eyeVariants = {
    blink: {
      scaleY: [1, 0, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1],
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(59, 130, 246, 0.3)',
        '0 0 40px rgba(59, 130, 246, 0.6)',
        '0 0 20px rgba(59, 130, 246, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      animate="animate"
      className="flex justify-center py-8"
    >
      <motion.div
        variants={rotateVariants}
        animate="animate"
        className="relative w-32 h-32"
      >
        {/* Bot Head */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center"
        >
          {/* Face Container */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden flex items-center justify-center">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 opacity-90" />

            {/* Eyes Container */}
            <div className="absolute inset-0 flex items-center justify-center gap-4">
              {/* Left Eye */}
              <motion.div
                variants={eyeVariants}
                animate="blink"
                className="w-4 h-4 bg-white rounded-full"
              />
              {/* Right Eye */}
              <motion.div
                variants={eyeVariants}
                animate="blink"
                className="w-4 h-4 bg-white rounded-full"
              />
            </div>

            {/* Shine Effect */}
            <motion.div
              className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full opacity-40"
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Left Ear */}
        <motion.div
          animate={{
            rotateZ: [-10, 10, -10],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -left-4 top-4 w-6 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full origin-right"
        />

        {/* Right Ear */}
        <motion.div
          animate={{
            rotateZ: [10, -10, 10],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -right-4 top-4 w-6 h-10 bg-gradient-to-bl from-blue-400 to-blue-600 rounded-full origin-left"
        />

        {/* Bottom Body */}
        <motion.div
          animate={{
            scaleY: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-16 bg-gradient-to-b from-blue-400 to-blue-500 rounded-b-2xl"
        />

        {/* Floating Particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            animate={{
              y: [-40, 60],
              x: [-20 + i * 20, -20 + i * 20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: '50%',
              bottom: '-20px',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
