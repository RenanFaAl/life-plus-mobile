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
  Platform
} from 'react-native';

import DateTimePicker, {
  DateTimePickerEvent
} from '@react-native-community/datetimepicker';

import {
  ChevronLeft,
  Pill,
  Clock3,
  Droplets,
  Package
} from 'lucide-react-native';

import { useMedicine } from '../hooks/useMedicine';
import colors from '../theme/colors';

export default function CreateMedicineScreen({ navigation }: any) {
  const { createMedicine, loading } = useMedicine();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [lastTakenAt, setLastTakenAt] = useState(new Date());

  const [form, setForm] = useState({
    name: '',
    type: 'PILL' as 'PILL' | 'LIQUID',
    intervalHours: '',
    lastTakenAt: new Date().toISOString(),
    continuousUse: false,
    totalPills: '',
    pillsPerDose: '',
    totalMl: '',
    mlPerDose: ''
  });

  const handleSave = async () => {
    if (!form.name || !form.intervalHours) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha nome e intervalo.'
      );
      return;
    }

    try {
      const payload: any = {
        name: form.name,
        type: form.type,
        intervalHours: Number(form.intervalHours),
        lastTakenAt: form.lastTakenAt,
        continuousUse: form.continuousUse
      };

      if (form.type === 'PILL') {
        payload.totalPills = Number(form.totalPills || 0);
        payload.pillsPerDose = Number(form.pillsPerDose || 0);
      }

      if (form.type === 'LIQUID') {
        payload.totalMl = Number(form.totalMl || 0);
        payload.mlPerDose = Number(form.mlPerDose || 0);
      }

      await createMedicine(payload);

      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Erro',
        'Não foi possível cadastrar o medicamento.'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>
          Cadastrar Medicamento
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Nome do Medicamento *
          </Text>

          <View style={styles.inputContainer}>
            <Pill size={20} color={colors.textMuted} />

            <TextInput
              style={styles.input}
              placeholder="Ex: Dipirona"
              value={form.name}
              onChangeText={(text) =>
                setForm({ ...form, name: text })
              }
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo</Text>

          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                form.type === 'PILL' &&
                  styles.typeButtonActive
              ]}
              onPress={() =>
                setForm({ ...form, type: 'PILL' })
              }
            >
              <Text
                style={[
                  styles.typeText,
                  form.type === 'PILL' &&
                    styles.typeTextActive
                ]}
              >
                Comprimido
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                form.type === 'LIQUID' &&
                  styles.typeButtonActive
              ]}
              onPress={() =>
                setForm({ ...form, type: 'LIQUID' })
              }
            >
              <Text
                style={[
                  styles.typeText,
                  form.type === 'LIQUID' &&
                    styles.typeTextActive
                ]}
              >
                Líquido
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Intervalo em Horas *
          </Text>

          <View style={styles.inputContainer}>
            <Clock3 size={20} color={colors.textMuted} />

            <TextInput
              style={styles.input}
              placeholder="Ex: 8"
              keyboardType="numeric"
              value={form.intervalHours}
              onChangeText={(text) =>
                setForm({
                  ...form,
                  intervalHours: text
                })
              }
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Última Dose
          </Text>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Clock3 size={20} color={colors.textMuted} />

            <Text
              style={[
                styles.input,
                {
                  paddingTop: 14,
                  color: colors.text
                }
              ]}
            >
              {lastTakenAt.toLocaleString('pt-BR')}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={lastTakenAt}
            mode="date"
            display="default"
            onChange={(
              event: DateTimePickerEvent,
              selectedDate?: Date
            ) => {
              setShowDatePicker(false);

              if (selectedDate) {
                const updatedDate = new Date(
                  lastTakenAt
                );

                updatedDate.setFullYear(
                  selectedDate.getFullYear()
                );

                updatedDate.setMonth(
                  selectedDate.getMonth()
                );

                updatedDate.setDate(
                  selectedDate.getDate()
                );

                setLastTakenAt(updatedDate);

                setTimeout(() => {
                  setShowTimePicker(true);
                }, 100);
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={lastTakenAt}
            mode="time"
            display="default"
            onChange={(
              event: DateTimePickerEvent,
              selectedTime?: Date
            ) => {
              setShowTimePicker(false);

              if (selectedTime) {
                const updatedDate = new Date(
                  lastTakenAt
                );

                updatedDate.setHours(
                  selectedTime.getHours()
                );

                updatedDate.setMinutes(
                  selectedTime.getMinutes()
                );

                setLastTakenAt(updatedDate);

                setForm({
                  ...form,
                  lastTakenAt:
                    updatedDate.toISOString()
                });
              }
            }}
          />
        )}

        {form.type === 'PILL' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Total de Comprimidos
              </Text>

              <View style={styles.inputContainer}>
                <Package
                  size={20}
                  color={colors.textMuted}
                />

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Ex: 30"
                  value={form.totalPills}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      totalPills: text
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Comprimidos por Dose
              </Text>

              <View style={styles.inputContainer}>
                <Pill size={20} color={colors.textMuted} />

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Ex: 1"
                  value={form.pillsPerDose}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      pillsPerDose: text
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
                  placeholder="Ex: 120"
                  value={form.totalMl}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      totalMl: text
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                mL por Dose
              </Text>

              <View style={styles.inputContainer}>
                <Droplets
                  size={20}
                  color={colors.textMuted}
                />

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Ex: 5"
                  value={form.mlPerDose}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      mlPerDose: text
                    })
                  }
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.switchContainer}>
          <Text style={styles.label}>
            Uso Contínuo
          </Text>

          <Switch
            value={form.continuousUse}
            onValueChange={(value) =>
              setForm({
                ...form,
                continuousUse: value
              })
            }
            trackColor={{
              false: '#d1d5db',
              true: colors.primary
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.saveBtn,
          loading && styles.disabledBtn
        ]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.saveBtnText}>
            Salvar
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
    paddingTop: 20
  },

  content: {
    padding: 20,
    paddingBottom: 40
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10
  },

  backBtn: {
    padding: 5
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text
  },

  form: {
    gap: 15
  },

  inputGroup: {
    gap: 8
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16
  },

  saveBtn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30
  },

  saveBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16
  },

  disabledBtn: {
    opacity: 0.6
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },

  typeContainer: {
    flexDirection: 'row',
    gap: 10
  },

  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.white
  },

  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },

  typeText: {
    color: colors.text,
    fontWeight: '600'
  },

  typeTextActive: {
    color: colors.white
  }
});