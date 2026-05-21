export const buscarFarmacias = async (lat: number, lng: number) => {
  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY; 

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=pharmacy&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.results;
};