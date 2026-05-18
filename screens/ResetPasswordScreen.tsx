import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  Mail,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react-native';

import colors from '../theme/colors';

import * as authService from '../services/authService';

export default function ResetPasswordScreen({
  navigation,
}: any) {
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [email, setEmail] = useState('');

  const [code, setCode] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert(
        'Erro',
        'Informe seu e-mail.'
      );

      return;
    }

    try {
      setLoading(true);

      await authService.forgotPassword({
        email,
      });

      Alert.alert(
        'Sucesso',
        'Código enviado para seu e-mail.'
      );

      setStep(2);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.response?.data?.details ||
          'Não foi possível enviar o código.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const codeString = code.join('');

    if (codeString.length !== 6) {
      Alert.alert(
        'Erro',
        'Digite o código completo.'
      );

      return;
    }

    try {
      setLoading(true);

      await authService.verifyRecoveryCode({
        email,
        code: codeString,
      });

      Alert.alert(
        'Sucesso',
        'Código validado com sucesso.'
      );

      setStep(3);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.response?.data?.details ||
          'Código inválido.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (
      !newPassword ||
      !confirmPassword
    ) {
      Alert.alert(
        'Erro',
        'Preencha todos os campos.'
      );

      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      Alert.alert(
        'Erro',
        'As senhas não coincidem.'
      );

      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (
      !passwordRegex.test(newPassword)
    ) {
      Alert.alert(
        'Senha inválida',
        'A senha deve ter 8 caracteres, letras maiúsculas, minúsculas, números e símbolos.'
      );

      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        email,
        newPassword,
        confirmPassword,
      });

      Alert.alert(
        'Sucesso',
        'Senha redefinida com sucesso.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.response?.data?.details ||
          'Não foi possível redefinir a senha.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (
    value: string,
    index: number
  ) => {
    if (/^\d?$/.test(value)) {
      const updatedCode = [...code];

      updatedCode[index] = value;

      setCode(updatedCode);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scroll
        }
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[
            colors.gradientStart,
            colors.gradientEnd,
          ]}
          style={styles.topGradient}
        >

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoRow}
            onPress={() =>
              navigation.navigate('Home')
            }
          >
            <View style={styles.logoIcon}>
              <Text
                style={
                  styles.logoIconText
                }
              >
                L+
              </Text>
            </View>

            <Text style={styles.logoText}>
              Life+
            </Text>
          </TouchableOpacity>

          <Text style={styles.tagline}>
            Recupere o acesso da sua conta
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>
            Redefinir Senha
          </Text>

          <Text style={styles.subtitle}>
            {step === 1 &&
              'Informe seu e-mail'}
            {step === 2 &&
              'Digite o código recebido'}
            {step === 3 &&
              'Crie sua nova senha'}
          </Text>

          {step === 1 && (
            <>
              <Text style={styles.label}>
                E-mail
              </Text>

              <View style={styles.inputRow}>
                <Mail
                  size={16}
                  color={
                    colors.textMuted
                  }
                  style={
                    styles.inputIcon
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="voce@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={
                    colors.textMuted
                  }
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity
                style={
                  styles.submitBtn
                }
                onPress={
                  handleSendCode
                }
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text
                    style={
                      styles.submitText
                    }
                  >
                    Enviar Código
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>
                Código de Verificação
              </Text>

              <View
                style={
                  styles.codeContainer
                }
              >
                {code.map(
                  (
                    digit,
                    index
                  ) => (
                    <TextInput
                      key={index}
                      style={
                        styles.codeInput
                      }
                      keyboardType="numeric"
                      maxLength={1}
                      value={digit}
                      onChangeText={(
                        value
                      ) =>
                        handleCodeChange(
                          value,
                          index
                        )
                      }
                    />
                  )
                )}
              </View>

              <TouchableOpacity
                style={
                  styles.submitBtn
                }
                onPress={
                  handleVerifyCode
                }
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text
                    style={
                      styles.submitText
                    }
                  >
                    Verificar Código
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.label}>
                Nova Senha
              </Text>

              <View style={styles.inputRow}>
                <Lock
                  size={16}
                  color={
                    colors.textMuted
                  }
                  style={
                    styles.inputIcon
                  }
                />

                <TextInput
                  style={[
                    styles.input,
                    { flex: 1 },
                  ]}
                  placeholder="••••••••"
                  secureTextEntry={
                    !showPassword
                  }
                  placeholderTextColor={
                    colors.textMuted
                  }
                  value={newPassword}
                  onChangeText={
                    setNewPassword
                  }
                />

                <TouchableOpacity
                  onPress={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={16}
                      color={
                        colors.textMuted
                      }
                    />
                  ) : (
                    <Eye
                      size={16}
                      color={
                        colors.textMuted
                      }
                    />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>
                Confirmar Senha
              </Text>

              <View style={styles.inputRow}>
                <ShieldCheck
                  size={16}
                  color={
                    colors.textMuted
                  }
                  style={
                    styles.inputIcon
                  }
                />

                <TextInput
                  style={[
                    styles.input,
                    { flex: 1 },
                  ]}
                  placeholder="••••••••"
                  secureTextEntry={
                    !showConfirmPassword
                  }
                  placeholderTextColor={
                    colors.textMuted
                  }
                  value={
                    confirmPassword
                  }
                  onChangeText={
                    setConfirmPassword
                  }
                />

                <TouchableOpacity
                  onPress={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={16}
                      color={
                        colors.textMuted
                      }
                    />
                  ) : (
                    <Eye
                      size={16}
                      color={
                        colors.textMuted
                      }
                    />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={
                  styles.submitBtn
                }
                onPress={
                  handleResetPassword
                }
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text
                    style={
                      styles.submitText
                    }
                  >
                    Redefinir Senha
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Login')
            }
          >
            <Text style={styles.backText}>
              Voltar para login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
  },
  topGradient: { padding: 32, paddingTop: 60, alignItems: 'center', position: 'relative' },
  backButton: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  tagline: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: colors.background,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  submitText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  backText: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    backgroundColor: colors.background,
  },
});