import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Pill, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
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

function StockBar({ value }: { value: number }) {
  const color = value <= 20 ? colors.destructive : value <= 50 ? '#f59e0b' : colors.accent;
  return (
    <View style={stockStyles.track}>
      <View style={[stockStyles.fill, { width: `${value}%` as any, backgroundColor: color }]} />
    </View>
  );
}

const stockStyles = StyleSheet.create({
  track: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});

export default function MedicationsScreen() {

  const navigation = useNavigation<any>();

  const { medicines, fetchMedicines, loading } = useMedicine();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMedicines();
    }
  );

  return unsubscribe;
}, [navigation]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Medicamentos</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('CreateMedicine')}
          >
            <Plus size={16} color={colors.white} />
            <Text style={styles.addText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {medicines.map((med, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.iconBox}><Pill size={22} color={colors.accent} /></View>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.medDosage}>
                {med.type === 'PILL'
                  ? `${med.pillsPerDose} comprimido(s)`
                  : `${med.mlPerDose} mL`}
                {' · '}
                A cada {med.intervalHours}h
              </Text>
              <View style={styles.doseRow}>
                <Text style={styles.doseLabel}>Última dose: </Text>
                <Text style={styles.doseValue}>
                  {formatDate(med.lastTakenAt)}
                </Text>
              </View>
              <View style={styles.doseRow}>
                <Text style={styles.doseLabel}>
                  Próxima dose:
                </Text>
                <Text style={styles.doseValue}>
                  {(() => {
                    const {
                      nextDose,
                      hoursLeft,
                      minutesLeft,
                    } = getNextDoseInfo(
                      med.lastTakenAt,
                      med.intervalHours
                    );

                    return ` Em ${hoursLeft}h e ${minutesLeft}m | ${formatDate(
                      nextDose.toISOString()
                    )}`;
                  })()}
                </Text>
              </View>
              <View style={styles.stockSection}>
                <View style={styles.doseRow}>
                  <Text style={styles.doseLabel}>Estoque: </Text>
                  <Text style={styles.doseValue}>
                    {med.type === 'PILL'
                      ? `${med.totalPills} comprimidos`
                      : `${med.totalMl} mL`}
                  </Text>
                </View>
                {/* <StockBar
                  value={
                    med.type === 'PILL'
                      ? Number(med.totalPills || 0)
                      : Number(med.totalMl || 0)
                  }
                /> */}
              </View>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() =>
                  navigation.navigate('MedicineDetails', {
                    medicine: med,
                  })
                }
              >
                <Text style={styles.detailsText}>
                  Ver detalhes
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.text },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  addText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  grid: { gap: 14 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: `${colors.accent}18`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  medName: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
  medDosage: { fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  doseRow: { flexDirection: 'row', marginBottom: 6 },
  doseLabel: { fontSize: 13, color: colors.textMuted },
  doseValue: { fontSize: 13, color: colors.text, fontWeight: '500' },
  stockSection: { marginTop: 8, marginBottom: 14 },
  stockHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailsBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  detailsText: { fontSize: 14, fontWeight: '500', color: colors.text },
});
