import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import colors from '../theme/colors';
import { useUser } from '../hooks/useUser';

export default function ChangePasswordScreen({ navigation }: any) {
  const { loading, message, messageType, updatePassword, closeMessage } = useUser();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Senha Fraca', 
        'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
      );
      return;
    }

    await updatePassword({ 
      oldPassword: currentPassword, 
      newPassword, 
      confirmPassword 
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
              <Lock size={24} color={colors.white} />
            </View>
            <Text style={styles.logoText}>Alterar Senha</Text>
          </View>
          <Text style={styles.tagline}>Mantenha sua conta segura e protegida</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.label}>Senha Atual</Text>
          <View style={styles.inputRow}>
            <Lock size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Digite sua senha atual" 
              secureTextEntry={!showCurrentPass}
              placeholderTextColor={colors.textMuted}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrentPass(!showCurrentPass)}>
              {showCurrentPass ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nova Senha</Text>
          <View style={styles.inputRow}>
            <ShieldCheck size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Digita sua nova senha" 
              secureTextEntry={!showNewPass}
              placeholderTextColor={colors.textMuted}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
              {showNewPass ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <View style={styles.inputRow}>
            <Lock size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Repita a nova senha" 
              secureTextEntry={!showConfirmPass} 
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
              {showConfirmPass ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>
          

          <TouchableOpacity 
            style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>Atualizar Senha</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()} disabled={loading}>
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
  submitText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  cancelBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
});