import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {
  ArrowLeft,
  Clock3,
  CalendarDays,
} from 'lucide-react-native';

import {
  useRoute,
  useNavigation,
} from '@react-navigation/native';

import { useMedicine } from '../hooks/useMedicine';

import colors from '../theme/colors';


export default function RegisterMedicineDoseScreen() {
  const route = useRoute<any>();

  const navigation = useNavigation<any>();

  const { medicine } = route.params;

  const { updateMedicine, createHistory } =
  useMedicine();

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      let updatedData: any = {
        lastTakenAt: date.toISOString(),
      };

      if (medicine.type === 'PILL') {
        const newTotal =
          (medicine.totalPills || 0) -
          (medicine.pillsPerDose || 0);

        if (newTotal < 0) {
          Alert.alert(
            'Estoque insuficiente',
            'Não há comprimidos suficientes.'
          );

          return;
        }

        updatedData.totalPills = newTotal;
      }

      if (medicine.type === 'LIQUID') {
        const newTotal =
          (medicine.totalMl || 0) -
          (medicine.mlPerDose || 0);

        if (newTotal < 0) {
          Alert.alert(
            'Estoque insuficiente',
            'Não há medicamento suficiente.'
          );

          return;
        }

        updatedData.totalMl = newTotal;
      }

      await updateMedicine(
        medicine.id,
        updatedData
      );

      await createHistory(
        medicine.id,
        date.toISOString(),
        true
      );

      Alert.alert(
        'Sucesso',
        'Nova dose registrada!',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('MedicinesList'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível registrar.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(false);

    if (event.type === 'dismissed') {
      return;
    }

    if (selectedDate) {
      const updatedDate = new Date(date);

      updatedDate.setFullYear(
        selectedDate.getFullYear()
      );

      updatedDate.setMonth(
        selectedDate.getMonth()
      );

      updatedDate.setDate(
        selectedDate.getDate()
      );

      setDate(updatedDate);

      setTimeout(() => {
        setShowTimePicker(true);
      }, 150);
    }
  };

  const onChangeTime = (
    event: DateTimePickerEvent,
    selectedTime?: Date
  ) => {
    setShowTimePicker(false);

    if (event.type === 'dismissed') {
      return;
    }

    if (selectedTime) {
      const updatedDate = new Date(date);

      updatedDate.setHours(
        selectedTime.getHours()
      );

      updatedDate.setMinutes(
        selectedTime.getMinutes()
      );

      setDate(updatedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Registrar Dose
        </Text>
      </View>

      <View style={styles.card}>
        <Clock3
          size={40}
          color={colors.primary}
        />

        <Text style={styles.medName}>
          {medicine.name}
        </Text>

        <Text style={styles.label}>
          Horário da dose tomada
        </Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() =>
            setShowDatePicker(true)
          }
        >
          <CalendarDays
            size={20}
            color={colors.primary}
          />

          <Text style={styles.dateText}>
            {date.toLocaleString('pt-BR')}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={
              Platform.OS === 'ios'
                ? 'spinner'
                : 'default'
            }
            onChange={onChangeDate}
            maximumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={
              Platform.OS === 'ios'
                ? 'spinner'
                : 'default'
            }
            onChange={onChangeTime}
          />
        )}

        <TouchableOpacity
          style={[
            styles.saveBtn,
            loading && { opacity: 0.7 },
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>
            {loading
              ? 'Registrando...'
              : 'Registrar Dose'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    gap: 20,
  },

  medName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },

  label: {
    fontSize: 15,
    color: colors.textMuted,
  },

  dateButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  dateText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },

  saveBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  saveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});