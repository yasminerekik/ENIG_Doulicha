import { CityCard } from './CityCard';

const cities = [
  { name: 'Gabes', image: '/images/gabes.jpg', href: 'gabes' },
  { name: 'Sfax', image: '/images/sfax.jpg', href: 'sfax' },
  { name: 'Sousse', image: '/images/sousse.jpg', href: 'sousse' },
  { name: 'Monastir', image: '/images/monastir.jpg', href: 'monastir' },
  { name: 'Tunis', image: '/images/tunis.jpg', href: 'tunis' },
  { name: 'Hammamet', image: '/images/hammamet.jpg', href: 'hammamet' },
  { name: 'Djerba', image: '/images/djerba.jpg', href: 'djerba' },
  { name: 'Mahdia', image: '/images/mahdia.jpg', href: 'mahdia' },
  { name: 'Beja', image: '/images/beja.jpg', href: 'beja' },
  { name: 'Bizerte', image: '/images/bizerte.jpg', href: 'bizerte' },
  { name: 'Kairouan', image: '/images/kairouan.jpg', href: 'kairouan' },
  { name: 'Nabeul', image: '/images/nabeul.jpg', href: 'nabeul' },
  { name: 'Tabarka', image: '/images/tabarka.jpg', href: 'tabarka' },
  { name: 'Tataouein', image: '/images/tataouein.jpg', href: 'tataouein' },
  { name: 'Tozeur', image: '/images/tozeur.jpg', href: 'tozeur' },
  { name: 'Zaghouan', image: '/images/zaghouan.jpg', href: 'zaghouan' },
];

export const CitiesGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cities.map((city, index) => (
        <CityCard key={city.name} {...city} />
      ))}
    </div>
  );
};