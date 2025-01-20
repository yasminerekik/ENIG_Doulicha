import { motion } from 'framer-motion';

interface CityCardProps {
  name: string;
  image: string;
  href: string;
}

export const CityCard = ({ name, image, href }: CityCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <a href={href} className="group block">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Image */}
          <div className="aspect-[7/8] w-full">
            <img 
              src={image}
              alt={`${name} city`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* City Name */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xl font-bold text-white text-center">
              {name}
            </h3>
          </div>
        </div>
      </a>
    </motion.div>
  );
};