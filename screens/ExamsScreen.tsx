import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { FileText, Upload } from 'lucide-react-native';
import colors from '../theme/colors';

const exams = [
  { name: 'Hemograma Completo', date: '15 Jan, 2026' },
  { name: 'Raio-X do Tórax', date: '3 Dez, 2025' },
  { name: 'Perfil Lipídico', date: '20 Nov, 2025' },
  { name: 'Função Tireoidiana', date: '8 Out, 2025' },
  { name: 'Urinálise', date: '12 Set, 2025' },
  { name: 'Relatório de ECG', date: '5 Ago, 2025' },
];

export default function ExamsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Exames</Text>
          <TouchableOpacity style={styles.uploadBtn}>
            <Upload size={16} color={colors.white} />
            <Text style={styles.uploadText}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {exams.map((exam, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.iconBox}><FileText size={22} color={colors.primary} /></View>
              <Text style={styles.examName}>{exam.name}</Text>
              <Text style={styles.examDate}>{exam.date}</Text>
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
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  uploadText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  grid: { gap: 14 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: `${colors.primary}15`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  examName: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  examDate: { fontSize: 13, color: colors.textMuted, marginBottom: 14 },
  detailsBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  detailsText: { fontSize: 14, fontWeight: '500', color: colors.text },
});
