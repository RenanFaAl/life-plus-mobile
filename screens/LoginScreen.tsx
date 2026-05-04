import React, { useState, useEffect } from 'react'; 
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import colors from '../theme/colors';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen({ navigation }: any) {
  const { login, loading, message, messageType, closeMessage, loginSuccess } = useAuth();

  const [showPass, setShowPass] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (message) {
      const type = messageType;
      const msg = message;

      Alert.alert(
        type === 'success' ? 'Sucesso' : 'Erro',
        msg,
        [{ 
          text: 'OK', 
          onPress: () => {
            closeMessage(); 
          } 
        }]
      );      
    }
  }, [message]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    
    await login({ email, password });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.topGradient}>
          <TouchableOpacity style={styles.logoRow} onPress={() => navigation.navigate('Home')}>
            <View style={styles.logoIcon}><Text style={styles.logoIconText}>L+</Text></View>
            <Text style={styles.logoText}>Life+</Text>
          </TouchableOpacity>
          <Text style={styles.tagline}>Sua saúde sempre ao alcance das mãos</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputRow}>
            <Mail size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="voce@exemplo.com" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail} 
            />
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.label}>Senha</Text>
            <TouchableOpacity><Text style={styles.forgot}>Esqueceu a senha?</Text></TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Lock size={16} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput 
              style={[styles.input, { flex: 1 }]} 
              placeholder="••••••••" 
              secureTextEntry={!showPass} 
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword} 
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              {showPass ? <EyeOff size={16} color={colors.textMuted} /> : <Eye size={16} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.submitText}>Entrar</Text>}
          </TouchableOpacity>

        </View>
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
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgot: { fontSize: 12, color: colors.accent, fontWeight: '500' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, height: 48, backgroundColor: colors.background, marginBottom: 16 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: colors.text },
  eyeBtn: { padding: 4 },
  submitBtn: { backgroundColor: colors.accent, borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 4, shadowColor: colors.accent, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 12, color: colors.textMuted },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  socialBtn: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
  socialText: { fontSize: 14, fontWeight: '500', color: colors.text },
  bottomText: { textAlign: 'center', fontSize: 13, color: colors.textMuted },
  link: { color: colors.accent, fontWeight: '600' },
});
