import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import colors from '../theme/colors';
import { useUser } from '../hooks/useUser'; 

export default function ChangeEmailScreen({ navigation }: any) {
  const { user, loading, message, messageType, updateEmail, closeMessage } = useUser();

  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        Alert.alert(
          messageType === 'success' ? 'Sucesso' : 'Erro',
          message,
          [{ 
            text: 'OK', 
            onPress: () => {
              closeMessage();
              if (messageType === 'success') {
                navigation.goBack();
              }
            } 
          }],
          { cancelable: false }
        );
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChangeEmail = async () => {
    if (typeof updateEmail !== 'function') {
      Alert.alert('Erro', 'Serviço de usuário não disponível.');
      return;
    }

    if (!newEmail || !confirmEmail) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (newEmail !== confirmEmail) {
      Alert.alert('Erro', 'Os e-mails informados não coincidem.');
      return;
    }

    if (newEmail === user?.email) {
      Alert.alert('Erro', 'O novo e-mail deve ser diferente do atual.');
      return;
    }

    await updateEmail({ newEmail });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.topGradient}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.logoIcon}>
              <Mail size={24} color={colors.white} />
            </View>
            <Text style={styles.logoText}>Alterar E-mail</Text>
          </View>
          <Text style={styles.tagline}>Mantenha seus dados de acesso atualizados</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>Novo endereço de e-mail</Text>
          <Text style={styles.subtitle}>
            Seu e-mail atual é: <Text style={{fontWeight: 'bold'}}>{user?.email || 'Carregando...'}</Text>
          </Text>

          <Text style={styles.label}>Novo E-mail</Text>
          <View style={styles.inputRow}>
            <Mail size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="novo.email@exemplo.com" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              placeholderTextColor={colors.textMuted}
              value={newEmail}
              onChangeText={setNewEmail}
            />
          </View>

          <Text style={styles.label}>Confirmar Novo E-mail</Text>
          <View style={styles.inputRow}>
            <Mail size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Repita o novo e-mail" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              placeholderTextColor={colors.textMuted}
              value={confirmEmail}
              onChangeText={setConfirmEmail}
            />
          </View>

          <View style={styles.infoBox}>
            <CheckCircle size={14} color={colors.accent} />
            <Text style={styles.infoText}>
              Você precisará usar este novo e-mail no seu próximo login.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
            onPress={handleChangeEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitText}>Salvar Alterações</Text>
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
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, height: 48, backgroundColor: colors.background, marginBottom: 16 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: colors.text },
  infoBox: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(8, 145, 178, 0.05)', padding: 12, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
  infoText: { fontSize: 12, color: colors.text, flex: 1 },
  submitBtn: { backgroundColor: colors.accent, borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center', shadowColor: colors.accent, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginBottom: 12 },
  submitText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  cancelBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
});