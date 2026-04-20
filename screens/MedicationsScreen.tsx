import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Pill, Plus } from 'lucide-react-native';
import colors from '../theme/colors';

const medications = [
  { name: 'Amoxicilina', dosage: '500mg · A cada 8h', lastDose: 'Há 2 horas', nextDose: 'Em 6 horas', stock: 75 },
  { name: 'Ibuprofeno', dosage: '200mg · A cada 6h', lastDose: 'Há 5 horas', nextDose: 'Em 1 hora', stock: 40 },
  { name: 'Omeprazol', dosage: '20mg · 1x ao dia', lastDose: 'Hoje 8h', nextDose: 'Amanhã 8h', stock: 90 },
  { name: 'Metformina', dosage: '850mg · 2x ao dia', lastDose: 'Há 6 horas', nextDose: 'Em 6 horas', stock: 15 },
  { name: 'Lisinopril', dosage: '10mg · 1x ao dia', lastDose: 'Hoje 7h', nextDose: 'Amanhã 7h', stock: 60 },
];

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
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Medicamentos</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={16} color={colors.white} />
            <Text style={styles.addText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {medications.map((med, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.iconBox}><Pill size={22} color={colors.accent} /></View>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.medDosage}>{med.dosage}</Text>
              <View style={styles.doseRow}>
                <Text style={styles.doseLabel}>Última dose: </Text>
                <Text style={styles.doseValue}>{med.lastDose}</Text>
              </View>
              <View style={styles.doseRow}>
                <Text style={styles.doseLabel}>Próxima dose: </Text>
                <Text style={styles.doseValue}>{med.nextDose}</Text>
              </View>
              <View style={styles.stockSection}>
                <View style={styles.stockHeader}>
                  <Text style={styles.doseLabel}>Estoque</Text>
                  <Text style={styles.doseValue}>{med.stock}%</Text>
                </View>
                <StockBar value={med.stock} />
              </View>
              <TouchableOpacity style={styles.detailsBtn}>
                <Text style={styles.detailsText}>Ver detalhes</Text>
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
  doseRow: { flexDirection: 'row', marginBottom: 4 },
  doseLabel: { fontSize: 13, color: colors.textMuted },
  doseValue: { fontSize: 13, color: colors.text, fontWeight: '500' },
  stockSection: { marginTop: 8, marginBottom: 14 },
  stockHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailsBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  detailsText: { fontSize: 14, fontWeight: '500', color: colors.text },
});
