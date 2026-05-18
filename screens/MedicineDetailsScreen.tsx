import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  ArrowLeft,
  Pill,
  Clock3,
  Package,
  Droplets,
  Repeat,
  Trash2,
  Edit3,
} from 'lucide-react-native';

import { useRoute, useNavigation } from '@react-navigation/native';

import { useMedicine } from '../hooks/useMedicine';

import colors from '../theme/colors';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );
};

const getNextDoseInfo = (
  lastTakenAt: string,
  intervalHours: number
) => {
  const lastDose = new Date(lastTakenAt);

  const nextDose = new Date(lastDose);

  nextDose.setHours(
    nextDose.getHours() + intervalHours
  );

  const now = new Date();

  const diff =
    nextDose.getTime() - now.getTime();

  const hoursLeft = Math.max(
    0,
    Math.floor(diff / (1000 * 60 * 60))
  );

  const minutesLeft = Math.max(
    0,
    Math.floor(
      (diff % (1000 * 60 * 60)) /
        (1000 * 60)
    )
  );

  return {
    nextDose,
    hoursLeft,
    minutesLeft,
  };
};

export default function MedicineDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { medicine } = route.params;

  const { deleteMedicine } = useMedicine();

  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Excluir medicamento',
      'Deseja realmente excluir este medicamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoadingDelete(true);

              await deleteMedicine(medicine.id);

              navigation.goBack();
            } catch (error) {
              Alert.alert(
                'Erro',
                'Não foi possível excluir o medicamento.'
              );
            } finally {
              setLoadingDelete(false);
            }
          },
        },
      ]
    );
  };

  const nextDose = new Date(medicine.lastTakenAt);

  nextDose.setHours(
    nextDose.getHours() + medicine.intervalHours
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RegisterMedicineDose', {
                medicine,
              })
            }
          >
            <Clock3 size={22} color={colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditMedicine', {
                medicine,
              })
            }
          >
            <Edit3 size={22} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            disabled={loadingDelete}
          >
            {loadingDelete ? (
              <ActivityIndicator color="#ef4444" />
            ) : (
              <Trash2 size={22} color="#ef4444" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <View style={styles.iconBadge}>
          <Pill size={30} color={colors.primary} />
        </View>

        <Text style={styles.title}>
          {medicine.name}
        </Text>

        <Text style={styles.subtitle}>
          {medicine.type === 'PILL'
            ? 'Comprimido'
            : 'Medicamento Líquido'}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Clock3 size={20} color={colors.primary} />

          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>
              Intervalo
            </Text>

            <Text style={styles.value}>
              A cada {medicine.intervalHours} horas
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Clock3 size={20} color={colors.primary} />

          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>
              Última Dose
            </Text>

            <Text style={styles.value}>
              {formatDate(medicine.lastTakenAt)}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Clock3 size={20} color={colors.primary} />

          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>
              Próxima Dose
            </Text>

            <Text style={styles.value}>
              {formatDate(nextDose.toISOString())}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Repeat size={20} color={colors.primary} />

          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>
              Uso Contínuo
            </Text>

            <Text style={styles.value}>
              {medicine.continuousUse
                ? 'Sim'
                : 'Não'}
            </Text>
          </View>
        </View>

        {medicine.type === 'PILL' && (
          <>
            <View style={styles.infoRow}>
              <Package
                size={20}
                color={colors.primary}
              />

              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>
                  Estoque
                </Text>

                <Text style={styles.value}>
                  {medicine.totalPills} comprimidos
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Pill
                size={20}
                color={colors.primary}
              />

              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>
                  Dose
                </Text>

                <Text style={styles.value}>
                  {medicine.pillsPerDose}{' '}
                  comprimido(s)
                </Text>
              </View>
            </View>
          </>
        )}

        {medicine.type === 'LIQUID' && (
          <>
            <View style={styles.infoRow}>
              <Droplets
                size={20}
                color={colors.primary}
              />

              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>
                  Estoque
                </Text>

                <Text style={styles.value}>
                  {medicine.totalMl} mL
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Droplets
                size={20}
                color={colors.primary}
              />

              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>
                  Dose
                </Text>

                <Text style={styles.value}>
                  {medicine.mlPerDose} mL
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  backBtn: {
    padding: 4,
  },

  actions: {
    flexDirection: 'row',
    gap: 20,
  },

  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  iconBadge: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    gap: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  infoTextContainer: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});