import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, User, Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import colors from '../theme/colors';
import { useAuth } from '../hooks/useAuth';

export default function RegisterScreen({ navigation }: any) {
  const { register, loading, message, messageType, closeMessage } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateLabel, setDateLabel] = useState('Selecionar data');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: ''
  });

  useEffect(() => {
    if (message && messageType === 'error') {
      const timer = setTimeout(() => {
        Alert.alert(
          'Erro',
          message,
          [{ text: 'OK', onPress: () => closeMessage() }],
          { cancelable: false }
        );
      }, 200);

      return () => clearTimeout(timer);
    } else if (message && messageType === 'success') {
       Alert.alert(
          'Sucesso',
          message,
          [{ text: 'OK', onPress: () => {
            closeMessage();
            navigation.navigate('Login');
          }}]
        );
    }
  }, [message]);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);

    if (selectedDate) {
      setDate(selectedDate);
      
      const visualDate = selectedDate.toLocaleDateString('pt-BR');
      setDateLabel(visualDate);

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const apiDate = `${year}-${month}-${day}`;
      
      setForm({ ...form, birthDate: apiDate });
    }
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.birthDate) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    await register(form);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={[colors.gradientEnd, colors.gradientStart]} style={styles.topGradient}>
          <TouchableOpacity style={styles.logoRow} onPress={() => navigation.navigate('Home')}>
            <View style={styles.logoIcon}><Text style={styles.logoIconText}>L+</Text></View>
            <Text style={styles.logoText}>Life+</Text>
          </TouchableOpacity>
          <Text style={styles.tagline}>Comece a cuidar da sua saúde hoje</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputRow}>
            <User size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="João Silva" 
              placeholderTextColor={colors.textMuted}
              value={form.name}
              onChangeText={(txt) => setForm({...form, name: txt})}
            />
          </View>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputRow}>
            <Mail size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="voce@exemplo.com" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              placeholderTextColor={colors.textMuted}
              value={form.email}
              onChangeText={(txt) => setForm({...form, email: txt})}
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputRow}>
            <Lock size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={[styles.input, { flex: 1 }]} 
              placeholder="••••••••" 
              secureTextEntry={!showPass} 
              placeholderTextColor={colors.textMuted}
              value={form.password}
              onChangeText={(txt) => setForm({...form, password: txt})}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              {showPass ? <EyeOff size={16} color={colors.textMuted} /> : <Eye size={16} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar senha</Text>
          <View style={styles.inputRow}>
            <Lock size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={[styles.input, { flex: 1 }]} 
              placeholder="••••••••" 
              secureTextEntry={!showConfirm} 
              placeholderTextColor={colors.textMuted}
              value={form.confirmPassword}
              onChangeText={(txt) => setForm({...form, confirmPassword: txt})}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
              {showConfirm ? <EyeOff size={16} color={colors.textMuted} /> : <Eye size={16} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Data de nascimento</Text>
          <TouchableOpacity 
            style={styles.inputRow} 
            onPress={() => setShowPicker(true)}
          >
            <CalendarIcon size={16} color={colors.textMuted} style={styles.inputIcon} />
            <Text style={[styles.input, { textAlignVertical: 'center', paddingTop: 12, color: form.birthDate ? colors.text : colors.textMuted }]}>
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
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Criar conta</Text>}
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Já tem conta?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Entrar</Text>
          </Text>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
  topGradient: { padding: 32, paddingTop: 60, alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  logoIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  logoIconText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  logoText: { color: colors.white, fontSize: 28, fontWeight: 'bold' },
  tagline: { color: 'rgba(255,255,255,0.9)', fontSize: 15, textAlign: 'center' },
  card: { backgroundColor: colors.white, margin: 16, borderRadius: 24, padding: 28, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, height: 48, backgroundColor: colors.background, marginBottom: 16 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: colors.text },
  eyeBtn: { padding: 4 },
  submitBtn: { backgroundColor: colors.accent, borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 4, shadowColor: colors.accent, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginBottom: 16 },
  submitText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  bottomText: { textAlign: 'center', fontSize: 13, color: colors.textMuted },
  link: { color: colors.accent, fontWeight: '600' },
});
