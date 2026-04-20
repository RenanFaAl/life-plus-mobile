import { useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { buscarFarmacias } from '../services/placesService';

export default function MapScreen() {
  const [farmacias, setFarmacias] = useState([]);

  useEffect(() => {
    buscarFarmacias(-23.5505, -46.6333)
      .then(setFarmacias);
  }, []);

  return <MapComponent farmacias={farmacias} />;
}