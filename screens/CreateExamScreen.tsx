import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
  ActivityIndicator,
  Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Calendar, FileText, AlignLeft, ChevronLeft, ClipboardList } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useExam } from '../hooks/useExam'; 
import colors from '../theme/colors';

export default function CreateExamScreen({ navigation }: any) {
  const { createExam, loading } = useExam();
  
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateLabel, setDateLabel] = useState(new Date().toLocaleDateString('pt-BR'));

  const [form, setForm] = useState({
    name: '',
    description: '', 
    date: new Date().toISOString().split('T')[0], 
    result: '',      
  });
  
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);

    if (selectedDate) {
      setDate(selectedDate);
      setDateLabel(selectedDate.toLocaleDateString('pt-BR'));

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const apiDate = `${year}-${month}-${day}`;
      
      setForm({ ...form, date: apiDate });
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para anexar o exame.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.name || !form.date) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o nome e a data do exame.');
      return;
    }

    try {
      const files = images.map(img => ({
        uri: img.uri,
        name: img.fileName || `exame_${Date.now()}.jpg`,
        type: img.mimeType || 'image/jpeg'
      })) as any;

      await createExam({
        ...form,
        files: files
      });

      navigation.goBack();
    } catch (error) {
      console.log("Erro ao salvar exame:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Cadastrar Exame</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Exame *</Text>
          <View style={styles.inputContainer}>
            <FileText size={20} color={colors.textMuted} />
            <TextInput 
              style={styles.input}
              placeholder="Ex: Hemograma Completo"
              value={form.name}
              onChangeText={(text) => setForm({...form, name: text})}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data da Realização *</Text>
          <TouchableOpacity 
            style={styles.inputContainer} 
            onPress={() => setShowPicker(true)}
          >
            <Calendar size={20} color={colors.textMuted} />
            <Text style={[styles.input, { textAlignVertical: 'center', paddingTop: 14, color: colors.text }]}>
              {dateLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Resultado (Opcional)</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <ClipboardList size={20} color={colors.textMuted} style={{ marginTop: 12 }} />
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Digite aqui os detalhes do resultado..."
              multiline
              numberOfLines={3}
              value={form.result}
              onChangeText={(text) => setForm({...form, result: text})}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição / Observações (Opcional)</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <AlignLeft size={20} color={colors.textMuted} style={{ marginTop: 12 }} />
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Exame feito em jejum de 12h..."
              multiline
              numberOfLines={3}
              value={form.description}
              onChangeText={(text) => setForm({...form, description: text})}
            />
          </View>
        </View>

        <Text style={styles.label}>Fotos do Exame</Text>
        <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
          <Camera size={30} color={colors.primary} />
          <Text style={styles.uploadText}>Anexar Imagens</Text>
        </TouchableOpacity>

        <View style={styles.previewContainer}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageBox}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeBtn} 
                onPress={() => removeImage(index)}
              >
                <X size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.saveBtn, loading && styles.disabledBtn]} 
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.saveBtnText}>Salvar</Text>
        )}
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
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.white, 
    borderRadius: 12, 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border
  },
  input: { flex: 1, paddingVertical: 12, marginLeft: 10, fontSize: 16 },
  textAreaContainer: { alignItems: 'flex-start' },
  textArea: { height: 100, textAlignVertical: 'top' },
  uploadArea: { 
    height: 100, 
    backgroundColor: colors.white, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.primary, 
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  uploadText: { color: colors.primary, fontWeight: '600', marginTop: 5 },
  previewContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  imageBox: { width: 80, height: 80, position: 'relative' },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  removeBtn: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    backgroundColor: 'red', 
    borderRadius: 10, 
    padding: 3 
  },
  saveBtn: { 
    backgroundColor: colors.primary, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 30 
  },
  saveBtnText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  disabledBtn: { opacity: 0.6 }
});