import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, User, Calendar } from 'lucide-react-native';
import colors from '../theme/colors';

export default function RegisterScreen({ navigation }: any) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dob, setDob] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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

          {/* Nome */}
          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputRow}>
            <User size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="João Silva" placeholderTextColor={colors.textMuted} />
          </View>

          {/* Email */}
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputRow}>
            <Mail size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="voce@exemplo.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.textMuted} />
          </View>

          {/* Senha */}
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputRow}>
            <Lock size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="••••••••" secureTextEntry={!showPass} placeholderTextColor={colors.textMuted} />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              {showPass ? <EyeOff size={16} color={colors.textMuted} /> : <Eye size={16} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>

          {/* Confirmar senha */}
          <Text style={styles.label}>Confirmar senha</Text>
          <View style={styles.inputRow}>
            <Lock size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="••••••••" secureTextEntry={!showConfirm} placeholderTextColor={colors.textMuted} />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
              {showConfirm ? <EyeOff size={16} color={colors.textMuted} /> : <Eye size={16} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>

          {/* Data de nascimento */}
          <Text style={styles.label}>Data de nascimento</Text>
          <View style={styles.inputRow}>
            <Calendar size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.textMuted}
              value={dob}
              onChangeText={setDob}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.navigate('App')}>
            <Text style={styles.submitText}>Criar conta</Text>
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
