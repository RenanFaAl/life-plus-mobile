import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';

import {
  ChevronLeft,
  Pill,
  Clock3,
  Droplets,
  Package,
} from 'lucide-react-native';

import { useRoute, useNavigation } from '@react-navigation/native';

import { useMedicine } from '../hooks/useMedicine';

import colors from '../theme/colors';

export default function EditMedicineScreen() {
  const route = useRoute<any>();

  const navigation = useNavigation<any>();

  const { medicine } = route.params;

  const { updateMedicine, loading } = useMedicine();

  const [form, setForm] = useState({
    name: medicine.name,
    type: medicine.type,
    intervalHours: String(medicine.intervalHours),
    continuousUse: medicine.continuousUse,

    totalPills: String(medicine.totalPills || ''),
    pillsPerDose: String(medicine.pillsPerDose || ''),

    totalMl: String(medicine.totalMl || ''),
    mlPerDose: String(medicine.mlPerDose || ''),
  });

  const handleUpdate = async () => {
    try {
      const payload: any = {
        name: form.name,
        type: form.type,
        intervalHours: Number(form.intervalHours),
        continuousUse: form.continuousUse,
      };

      if (form.type === 'PILL') {
        payload.totalPills = Number(form.totalPills || 0);
        payload.pillsPerDose = Number(form.pillsPerDose || 0);
      }

      if (form.type === 'LIQUID') {
        payload.totalMl = Number(form.totalMl || 0);
        payload.mlPerDose = Number(form.mlPerDose || 0);
      }

      await updateMedicine(medicine.id, payload);

      Alert.alert("Sucesso", "Medicamento atualizado!", [
        { text: "OK", onPress: () => navigation.navigate('MedicinesList') }
      ]);
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível atualizar.'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Editar Medicamento
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Nome
          </Text>

          <View style={styles.inputContainer}>
            <Pill
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) =>
                setForm({
                  ...form,
                  name: text,
                })
              }
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Intervalo em horas
          </Text>

          <View style={styles.inputContainer}>
            <Clock3
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.intervalHours}
              onChangeText={(text) =>
                setForm({
                  ...form,
                  intervalHours: text,
                })
              }
            />
          </View>
        </View>

        {form.type === 'PILL' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Total de comprimidos
              </Text>

              <View style={styles.inputContainer}>
                <Package
                  size={20}
                  color={colors.textMuted}
                />

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.totalPills}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      totalPills: text,
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Comprimidos por dose
              </Text>

              <View style={styles.inputContainer}>
                <Pill
                  size={20}
                  color={colors.textMuted}
                />

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.pillsPerDose}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      pillsPerDose: text,
                    })
                  }
                />
              </View>
            </View>
          </>
        )}

        {form.type === 'LIQUID' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Total em mL
              </Text>

              <View style={styles.inputContainer}>
                <Droplets
                  size={20}
                  color={colors.textMuted}
                />

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.totalMl}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      totalMl: text,
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                mL por dose
              </Text>

              <View style={styles.inputContainer}>
                <Droplets
                  size={20}
                  color={colors.textMuted}
                />

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.mlPerDose}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      mlPerDose: text,
                    })
                  }
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.switchContainer}>
          <Text style={styles.label}>
            Uso contínuo
          </Text>

          <Switch
            value={form.continuousUse}
            onValueChange={(value) =>
              setForm({
                ...form,
                continuousUse: value,
              })
            }
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.saveBtnText}>
            Salvar Alterações
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },

  backBtn: {
    padding: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },

  form: {
    gap: 15,
  },

  inputGroup: {
    gap: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  saveBtn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },

  saveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});