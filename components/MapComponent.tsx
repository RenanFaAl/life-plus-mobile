import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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

  useEffect(() => {
    let subscription: any;

    async function startWatching() {
      const { granted } = await requestForegroundPermissionsAsync();

      if (!granted) return;

      subscription = await watchPositionAsync(
        {
          accuracy: LocationAccuracy.Highest,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (response) => setLocation(response)
      );
    }

    startWatching();

    return () => {
      subscription?.remove();
    };
  }, []);

  // Procura de Farmácias
  useEffect(() => {
    if (!location) return;

    const carregarFarmacias = async () => {
      try {
        const data = await buscarFarmacias(
          location.coords.latitude,
          location.coords.longitude
        );
        
        console.log("Resposta da API do Google:", data);
        
        if (data) {
          setFarmacias(data);
        }
      } catch (err) {
        console.error("Erro real na requisição das farmácias:", err);
      }
    };

    carregarFarmacias();
  }, [location]);

  if (!location) return null;

  return (
    <MapView
      style={{ flex: 1 }} 
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      initialRegion={{
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
      {farmacias
        .filter(
          (f) =>
            f.geometry?.location?.lat &&
            f.geometry?.location?.lng
        )
        .map((f) => (
          <Marker
            key={f.place_id}
            coordinate={{
              latitude: Number(f.geometry.location.lat),
              longitude: Number(f.geometry.location.lng),
            }}
            title={f.name}
            pinColor="red"
          />
      ))}
    </MapView>
  );
}