import MapView, { Marker } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { buscarFarmacias } from '../services/placesService';

type Farmacia = {
  place_id: string;
  name: string;
  geometry: { location: { lat: number; lng: number } };
};

export default function MapComponent() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const hasFetched = useRef(false);

  // Permissão + localização inicial
  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (!granted) {
      console.log("Permissão negada");
      return;
    }

    const currentPosition = await getCurrentPositionAsync();
    setLocation(currentPosition);
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Atualização contínua da localização
  useEffect(() => {
    const subscription = watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (response) => setLocation(response)
    );

    return () => {
      subscription.then((sub) => sub.remove());
    };
  }, []);

  // Procura de Farmácias
  useEffect(() => {
    if (location && !hasFetched.current) {
      hasFetched.current = true;

      buscarFarmacias(
        location.coords.latitude,
        location.coords.longitude
      )
        .then((data) => {
          console.log("Farmácias:", data);

          // Ajuste caso sua API retorne "results"
          setFarmacias(data.results || data);
        })
        .catch((err) => console.error("Erro ao buscar farmácias:", err));
    }
  }, [location]);

  if (!location) return null;

  return (
    <MapView
      style={{ flex: 1 }}
      region={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/*  Localização */}
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        title="Você está aqui"
        pinColor="blue"
      />

      {/* Farmácias */}
      {farmacias.map((f) => (
        <Marker
          key={f.place_id}
          coordinate={{
            latitude: f.geometry.location.lat,
            longitude: f.geometry.location.lng,
          }}
          title={f.name}
          pinColor="red"
        />
      ))}
    </MapView>
  );
}