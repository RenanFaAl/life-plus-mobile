import { Image } from 'react-native';
import { useAuth } from '../hooks/useAuth'; 

interface PhotoViewerProps {
  photoId: string;
}

const PhotoViewer = ({ photoId }: PhotoViewerProps) => {
  const { token } = useAuth(); 

  return (
    <Image
      source={{
        uri: `${process.env.EXPO_PUBLIC_API_URL}/exams/photos/${photoId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }}
      style={{ width: '100%', height: 300 }}
      resizeMode="contain"
    />
  );
};