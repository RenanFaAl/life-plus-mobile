import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, FolderOpen, AlertTriangle, PlayCircle } from 'lucide-react-native';
import colors from '../theme/colors';

const healthStats = [
  { icon: Heart, label: 'Condições', value: '2', color: colors.destructive },
  { icon: FolderOpen, label: 'Pastas de Exames', value: '5', color: colors.primary },
  { icon: AlertTriangle, label: 'Meds. Acabando', value: '1', color: colors.accent },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Avatar card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>JD</Text></View>
          <Text style={styles.name}>João Silva</Text>
          <Text style={styles.email}>joao.silva@email.com</Text>
        </View>

        {/* Health stats */}
        <Text style={styles.sectionTitle}>Status de Saúde</Text>
        <View style={styles.statsRow}>
          {healthStats.map((s) => {
            const Icon = s.icon;
            return (
              <View key={s.label} style={styles.statCard}>
                <Icon size={22} color={s.color} />
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Tutorial card */}
        <View style={styles.tutorialCard}>
          <PlayCircle size={56} color={colors.accent} />
          <Text style={styles.tutorialTitle}>Precisa de ajuda?</Text>
          <Text style={styles.tutorialDesc}>Assista ao tutorial e aprenda a usar todos os recursos do Life+</Text>
          <TouchableOpacity style={styles.tutorialBtn}>
            <Text style={styles.tutorialBtnText}>Ver tutorial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, maxWidth: 500, alignSelf: 'center', width: '100%' },
  avatarCard: { backgroundColor: colors.white, borderRadius: 20, padding: 32, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: `${colors.accent}22`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: colors.accent },
  name: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  email: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 10, color: colors.textMuted, textAlign: 'center' },
  tutorialCard: { backgroundColor: colors.white, borderRadius: 20, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  tutorialTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 12, marginBottom: 8 },
  tutorialDesc: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  tutorialBtn: { backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  tutorialBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
});
