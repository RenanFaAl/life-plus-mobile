import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FileText, Calendar, AlignLeft, ClipboardList, Download, Trash2, ArrowLeft, X, Image as ImageIcon } from 'lucide-react-native';
import { useExam } from '../hooks/useExam';
import { useAuth } from '../hooks/useAuth'; 
import colors from '../theme/colors';

export default function ExamDetailsScreen() {
const route = useRoute<any>();
  const navigation = useNavigation();
  const { exam } = route.params;
  const { token } = useAuth(); 
  const { deleteExam, downloadExamPhoto } = useExam();
  
  const [photoUris, setPhotoUris] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  useEffect(() => {
  const loadImages = async () => {
    if (exam.photos && token) {
      const uris: Record<string, string> = {};
      
      for (const photo of exam.photos) {
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/exams/photos/${photo.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              setPhotoUris(prev => ({ ...prev, [photo.id]: reader.result as string }));
            };
            reader.readAsDataURL(blob);
          } else {
            handleImageError(photo.id);
          }
        } catch (error) {
          console.error("Erro ao carregar foto:", error);
          handleImageError(photo.id);
        }
      }
    }
  };

  loadImages();
}, [exam.photos, token]);

  const handleImageError = (photoId: string) => {
    setImgError(prev => ({ ...prev, [photoId]: true }));
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir Exame",
      "Tem certeza que deseja remover este exame permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            setIsDeleting(true);
            await deleteExam(exam.id);
            setIsDeleting(false);
            navigation.goBack();
          } 
        }
      ]
    );
  };

  if (!token) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
          {isDeleting ? <ActivityIndicator color="red" /> : <Trash2 size={22} color="#ef4444" />}
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <View style={styles.iconBadge}>
          <FileText size={30} color={colors.primary} />
        </View>
        <Text style={styles.title}>{exam.name}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Calendar size={20} color={colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Data do Exame</Text>
            <Text style={styles.value}>{new Date(exam.date).toLocaleDateString('pt-BR')}</Text>
          </View>
        </View>

        {exam.description && (
          <View style={styles.infoRow}>
            <AlignLeft size={20} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Descrição</Text>
              <Text style={styles.value}>{exam.description}</Text>
            </View>
          </View>
        )}

        {exam.result && (
          <View style={styles.infoRow}>
            <ClipboardList size={20} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Resultado/Conclusão</Text>
              <Text style={styles.value}>{exam.result}</Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Arquivos e Anexos ({exam.photos?.length || 0})</Text>
      
      {exam.photos && exam.photos.map((photo: any) => (
        <TouchableOpacity 
          key={photo.id} 
          style={styles.fileCard}
          onPress={() => setSelectedPhoto(photo)}
        >
          <View style={styles.fileInfo}>
            {photoUris[photo.id] ? (
              <Image 
                source={{ uri: photoUris[photo.id] }}
                style={styles.miniPreview}
              />
            ) : (
              <View style={[styles.miniPreview, styles.errorPreview]}>
                {imgError[photo.id] ? <ImageIcon size={20} color={colors.textMuted} /> : <ActivityIndicator size="small" />}
              </View>
            )}
            
            <View style={{ flex: 1 }}>
              <Text style={styles.fileName} numberOfLines={1}>{photo.fileName}</Text>
              <Text style={styles.tapToView}>Toque para ampliar</Text>
            </View>
          </View>
          <Download size={20} color={colors.primary} />
        </TouchableOpacity>
      ))}

      <Modal visible={!!selectedPhoto} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>{selectedPhoto?.fileName}</Text>
              <TouchableOpacity onPress={() => setSelectedPhoto(null)}>
                <X size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedPhoto && photoUris[selectedPhoto.id] && (
              <Image
                source={{ uri: photoUris[selectedPhoto.id] }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}

            <TouchableOpacity 
              style={styles.bigDownloadBtn}
              onPress={() => downloadExamPhoto(selectedPhoto.id, selectedPhoto.fileName)}
            >
              <Download size={20} color="#FFF" />
              <Text style={styles.bigDownloadText}>Baixar Arquivo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { padding: 4 },
  titleContainer: { alignItems: 'center', marginBottom: 30 },
  iconBadge: { width: 70, height: 70, borderRadius: 20, backgroundColor: `${colors.primary}15`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
  infoCard: { backgroundColor: colors.white, borderRadius: 20, padding: 20, gap: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoTextContainer: { flex: 1 },
  label: { fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 2 },
  value: { fontSize: 16, color: colors.text, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 30, marginBottom: 15 },
  fileCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: colors.white, 
    padding: 12, 
    borderRadius: 15, 
    marginBottom: 10,
    elevation: 1
  },
  fileInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  miniPreview: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#f0f0f0' },
  errorPreview: { justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  fileName: { fontSize: 14, color: colors.text, fontWeight: '600' },
  tapToView: { fontSize: 12, color: colors.primary },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '90%', 
    height: '80%', 
    backgroundColor: colors.white, 
    borderRadius: 25, 
    padding: 20, 
    alignItems: 'center' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    alignItems: 'center',
    marginBottom: 15
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, flex: 1 },
  fullImage: { width: '100%', flex: 1, borderRadius: 10 },
  bigDownloadBtn: { 
    flexDirection: 'row', 
    backgroundColor: colors.primary, 
    width: '100%', 
    padding: 15, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10, 
    marginTop: 20 
  },
  bigDownloadText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  emptyFiles: { color: colors.textMuted, fontStyle: 'italic', textAlign: 'center' }
});