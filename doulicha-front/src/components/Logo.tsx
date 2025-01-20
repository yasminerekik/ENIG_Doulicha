import { MapPin, Compass, Map } from "lucide-react";

export const Logo = () => (
  <div className="flex flex-col items-center space-y-2">
    <div className="relative w-16 h-16">
      <Map className="w-16 h-16 text-purple-600 absolute animate-pulse" />
      <MapPin className="w-12 h-12 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <Compass className="w-8 h-8 text-purple-600/80 absolute bottom-0 right-0 animate-spin-slow" />
    </div>
    <div className="text-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 text-transparent bg-clip-text">
        Doulicha
      </h1>
      <span className="text-sm text-gray-900 font-bold">YOUR LEISURE SPACE</span>
    </div>
  </div>
);