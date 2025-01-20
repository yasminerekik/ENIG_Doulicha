import { 
    Wifi, Car, Wind, Tv, Coffee, Utensils, 
    Waves, DumbbellIcon, PawPrint, Shirt 
  } from 'lucide-react';
  
  // Crée un mapping des icônes disponibles
  const featureIconMap = {
    'Free WiFi': Wifi,
    'Parking': Car,
    'Air Conditioning': Wind,
    'TV': Tv,
    'Coffee Machine': Coffee,
    'Kitchen': Utensils,
    'Pool': Waves,
    'Gym': DumbbellIcon,
    'Pet Friendly': PawPrint,
    'Laundry': Shirt
  } as const;  // Utilise `as const` pour fixer les clés et valeurs
  
  export const getFeatureIcon = (featureName: string) => {
    if (featureName in featureIconMap) {
      const IconComponent = featureIconMap[featureName as keyof typeof featureIconMap];
      return <IconComponent size={16} className="text-purple-500" />;
    }
    return null;
  };
  