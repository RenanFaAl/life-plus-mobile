import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Calendar as CalendarIcon, ArrowLeft, Save } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import colors from '../theme/colors';
import { useUser } from '../hooks/useUser';

export default function EditProfileScreen({ navigation }: any) {
  const { user, loading, message, messageType, updateProfile, closeMessage } = useUser();

  const [name, setName] = useState(user?.name || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  
  const [date, setDate] = useState(user?.birthDate ? new Date(user.birthDate) : new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateLabel, setDateLabel] = useState(
    user?.birthDate 
      ? new Date(user.birthDate).toLocaleDateString('pt-BR') 
      : 'Selecionar data'
  );

  useEffect(() => {
    if (message) {
      Alert.alert(
        messageType === 'success' ? 'Sucesso' : 'Erro',
        message,
        [{ 
          text: 'OK', 
          onPress: () => {
            closeMessage();
            if (messageType === 'success') navigation.goBack();
          } 
        }]
      );
    }
  }, [message]);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);

    if (selectedDate) {
      setDate(selectedDate);
      
      // Formata para exibição visual (Brasil)
      setDateLabel(selectedDate.toLocaleDateString('pt-BR'));

      // Formata para a API (YYYY-MM-DD)
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setBirthDate(`${year}-${month}-${day}`);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !birthDate) {
      Alert.alert('Erro', 'O nome e a data de nascimento são obrigatórios.');
      return;
    }

    await updateProfile({ 
      name, 
      birthDate 
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.topGradient}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.logoIcon}>
              <User size={24} color={colors.white} />
            </View>
            <Text style={styles.logoText}>Editar Perfil</Text>
          </View>
          <Text style={styles.tagline}>Mantenha seus dados sempre atualizados</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.label}>Nome Completo</Text>
          <View style={styles.inputRow}>
            <User size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Seu nome" 
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Data de Nascimento</Text>
          <TouchableOpacity 
            style={styles.inputRow} 
            onPress={() => setShowPicker(true)}
          >
            <CalendarIcon size={16} color={colors.textMuted} style={styles.inputIcon} />
            <Text style={[styles.input, { textAlignVertical: 'center', paddingTop: 12, color: birthDate ? colors.text : colors.textMuted }]}>
              {dateLabel}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              maximumDate={new Date()} 
            />
          )}

          <TouchableOpacity 
            style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <View style={styles.btnContent}>
                <Save size={20} color={colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.submitText}>Salvar Alterações</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => navigation.goBack()} 
            disabled={loading}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
  topGradient: { padding: 32, paddingTop: 60, alignItems: 'center', position: 'relative' },
  backButton: { position: 'absolute', left: 20, top: 50, padding: 8 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  logoIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: colors.white, fontSize: 24, fontWeight: 'bold' },
  tagline: { color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center' },
  card: { backgroundColor: colors.white, margin: 16, marginTop: -20, borderRadius: 24, padding: 28, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 4 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, height: 48, backgroundColor: colors.background, marginBottom: 16 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: colors.text },
  submitBtn: { backgroundColor: colors.accent, borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: colors.accent, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginBottom: 12 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  submitText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  cancelBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
});