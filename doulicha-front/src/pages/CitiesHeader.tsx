import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export const CitiesHeader = () => {
  return (
    <motion.div 
      className="text-center mb-16 pt-24"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="inline-block mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Compass className="w-12 h-12 text-purple-600" />
      </motion.div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
        Discover Tunisia's Beautiful Cities
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Explore the unique charm and culture of each destination. From ancient medinas to modern metropolises, 
        find your perfect Tunisian adventure.
      </p>
    </motion.div>
  );
};