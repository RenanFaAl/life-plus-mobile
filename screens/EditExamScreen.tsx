import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, ScrollView, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator, Platform, Image 
} from 'react-native';
import { 
  FileText, Calendar, AlignLeft, ClipboardList, 
  ChevronLeft, Trash2, Plus 
} from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; 

import { useExam } from '../hooks/useExam'; 
import { useAuth } from '../hooks/useAuth'; 
import { UpdateExamData } from '../services/examService'; 
import colors from '../theme/colors';

export default function EditExamScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { exam } = route.params;
  const { token } = useAuth();
  const { updateExam, loading } = useExam();
  
  const [date, setDate] = useState(new Date(exam.date));
  const [showPicker, setShowPicker] = useState(false);
  const [dateLabel, setDateLabel] = useState(new Date(exam.date).toLocaleDateString('pt-BR'));

  const [form, setForm] = useState({
    name: exam.name,
    description: exam.description || '',
    date: exam.date.split('T')[0], 
    result: exam.result || '',
  });

  const [existingPhotos, setExistingPhotos] = useState<any[]>(exam.photos || []);
  const [existingPhotosUris, setExistingPhotosUris] = useState<Record<string, string>>({});
  const [newPhotos, setNewPhotos] = useState<any[]>([]);

  useEffect(() => {
    const loadExistingImages = async () => {
      if (exam.photos && token) {
        for (const photo of exam.photos) {
          try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/exams/photos/${photo.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
              const blob = await response.blob();
              const reader = new FileReader();
              reader.onloadend = () => {
                setExistingPhotosUris(prev => ({ ...prev, [photo.id]: reader.result as string }));
              };
              reader.readAsDataURL(blob);
            }
          } catch (error) {
            console.error("Erro ao carregar prévia existente:", error);
          }
        }
      }
    };
    loadExistingImages();
  }, [exam.photos, token]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewPhotos(prev => [...prev, ...result.assets]);
    }
  };

  const removeExistingPhoto = (id: string) => {
    setExistingPhotos(prev => prev.filter((p: any) => p.id !== id));
  };

  const removeNewPhoto = (uri: string) => {
    setNewPhotos(prev => prev.filter((p) => p.uri !== uri));
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setDateLabel(selectedDate.toLocaleDateString('pt-BR'));
      setForm({ ...form, date: selectedDate.toISOString().split('T')[0] });
    }
  };

  const handleUpdate = async () => {
    if (!form.name || !form.date) {
      Alert.alert('Erro', 'Nome e data são obrigatórios.');
      return;
    }

    const originalPhotoIds: string[] = exam.photos.map((p: any) => String(p.id));
    const currentPhotoIds: string[] = existingPhotos.map((p: any) => String(p.id));
    const photosToRemove = originalPhotoIds.filter(id => !currentPhotoIds.includes(id));

    try {
      const dataToSend: UpdateExamData = {
        name: form.name,
        description: form.description,
        date: form.date,
        result: form.result,
        removePhotos: photosToRemove, 
        files: newPhotos.map(photo => ({
          uri: photo.uri,
          type: photo.type === 'image' ? 'image/jpeg' : (photo.mimeType || 'image/jpeg'),
          name: photo.fileName || `upload_${Date.now()}.jpg`
        }))
      };

      await updateExam(exam.id, dataToSend);

      Alert.alert("Sucesso", "Exame atualizado!", [
        { text: "OK", onPress: () => navigation.navigate('ExamsList') }
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Falha ao atualizar exame.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Exame</Text>
      </View>

      <View style={styles.form}>
        {/* Nome */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Exame</Text>
          <View style={styles.inputContainer}>
            <FileText size={20} color={colors.textMuted} />
            <TextInput 
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({...form, name: text})}
            />
          </View>
        </View>

        {/* Data */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data da Realização</Text>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowPicker(true)}>
            <Calendar size={20} color={colors.textMuted} />
            <Text style={[styles.input, { paddingTop: 14, color: colors.text }]}>{dateLabel}</Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
            maximumDate={new Date()}
          />
        )}

        {/* Resultado */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Resultado (Opcional)</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <ClipboardList size={20} color={colors.textMuted} style={{ marginTop: 12 }} />
            <TextInput 
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              value={form.result}
              onChangeText={(text) => setForm({...form, result: text})}
            />
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição / Observações (Opcional)</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <AlignLeft size={20} color={colors.textMuted} style={{ marginTop: 12 }} />
            <TextInput 
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              value={form.description}
              onChangeText={(text) => setForm({...form, description: text})}
            />
          </View>
        </View>

        {/* Seção de Fotos */}
        <Text style={styles.sectionTitle}>Arquivos e Anexos ({existingPhotos.length + newPhotos.length})</Text>
        
        {/* Fotos Já Existentes */}
        {existingPhotos.map((photo: any) => (
          <View key={photo.id} style={styles.fileItem}>
            <View style={styles.fileInfo}>
              {existingPhotosUris[photo.id] ? (
                <Image source={{ uri: existingPhotosUris[photo.id] }} style={styles.miniPreview} />
              ) : (
                <View style={[styles.miniPreview, styles.emptyPreview]}>
                   <ActivityIndicator size="small" color={colors.primary} />
                </View>
              )}
              <Text style={styles.fileName} numberOfLines={1}>{photo.fileName}</Text>
            </View>
            <TouchableOpacity onPress={() => removeExistingPhoto(photo.id)}>
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Novas Fotos Selecionadas */}
        {newPhotos.map((photo, index) => (
          <View key={index} style={[styles.fileItem, styles.newFileItem]}>
            <View style={styles.fileInfo}>
              <Image source={{ uri: photo.uri }} style={styles.miniPreview} />
              <Text style={styles.fileName} numberOfLines={1}>Novo arquivo ({index + 1})</Text>
            </View>
            <TouchableOpacity onPress={() => removeNewPhoto(photo.uri)}>
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addFileBtn} onPress={pickImage}>
          <Plus size={20} color={colors.primary} />
          <Text style={styles.addFileText}>Adicionar mais fotos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.saveBtn, loading && styles.disabledBtn]} 
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Salvar Alterações</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 20 },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 10 },
  backBtn: { padding: 5 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  form: { gap: 15 },
  inputGroup: { gap: 8 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, 
    borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: colors.border 
  },
  input: { flex: 1, paddingVertical: 12, marginLeft: 10, fontSize: 16 },
  textAreaContainer: { alignItems: 'flex-start' },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  disabledBtn: { opacity: 0.6 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 20, marginBottom: 10 },
  fileItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: colors.white, 
    padding: 10, 
    borderRadius: 12, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  newFileItem: { borderColor: colors.primary, borderStyle: 'dashed', backgroundColor: `${colors.primary}05` },
  fileName: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' },
  miniPreview: { width: 45, height: 45, borderRadius: 8, backgroundColor: '#f0f0f0' },
  emptyPreview: { justifyContent: 'center', alignItems: 'center' },
  addFileBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 15, 
    borderWidth: 1, 
    borderColor: colors.primary, 
    borderRadius: 12, 
    borderStyle: 'dashed',
    marginTop: 10,
    gap: 8
  },
  addFileText: { color: colors.primary, fontWeight: '600' }
});