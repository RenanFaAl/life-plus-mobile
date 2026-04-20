import { Platform } from 'react-native';

// MOBILE
import MapView, { Marker } from 'react-native-maps';

// WEB
import { GoogleMap, LoadScript, Marker as WebMarker } from '@react-google-maps/api';

const center = {
  lat: -23.5505,
  lng: -46.6333
};

type Farmacia = {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

type Props = {
  farmacias: Farmacia[];
};
export default function MapComponent({ farmacias }: Props) {
  
  // 🌐 WEB
  if (Platform.OS === 'web') {
    return (
      <LoadScript googleMapsApiKey="SUA_API_KEY">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={center}
          zoom={14}
        >
          {farmacias.map((f) => (
            <WebMarker
              key={f.place_id}
              position={{
                lat: f.geometry.location.lat,
                lng: f.geometry.location.lng
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    );
  }

  // 📱 MOBILE
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {farmacias.map((f) => (
        <Marker
          key={f.place_id}
          coordinate={{
            latitude: f.geometry.location.lat,
            longitude: f.geometry.location.lng,
          }}
        />
      ))}
    </MapView>
  );
}