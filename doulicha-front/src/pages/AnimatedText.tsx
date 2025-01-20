import { motion } from 'framer-motion';

export const AnimatedText = () => {
  const words = ["Tap here to explore breathtaking locations."];
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center space-y-2"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={child}
          className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg"
        >
          {word}
        </motion.span>
      ))}
      <br></br>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="mt-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30 hover:bg-white/30 transition-colors cursor-pointer"
        >
          <span className="text-white text-lg">Discover Now →</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};