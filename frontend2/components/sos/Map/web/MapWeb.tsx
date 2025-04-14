import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapView = ({ position }: { position: { latitude: number; longitude: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      console.log("📍 Перемещение карты к:", position.latitude, position.longitude);
      map.setView([position.latitude, position.longitude], 17, { animate: true });
    }
  }, [position]);

  return null;
};

export default MapView;
