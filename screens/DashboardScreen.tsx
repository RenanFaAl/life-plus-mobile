import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Pill, CalendarDays, AlertTriangle, FileText, Plus, Upload, UserPen, Clock } from 'lucide-react-native';
import colors from '../theme/colors';

const stats = [
  { icon: Pill, label: 'Medicamentos hoje', value: '3', color: colors.primary },
  { icon: CalendarDays, label: 'Exames agendados', value: '2', color: colors.accent },
  { icon: AlertTriangle, label: 'Estoque baixo', value: '1', color: colors.destructive },
  { icon: FileText, label: 'Exames salvos', value: '12', color: colors.primary },
];

const recentActivity = [
  { text: 'Tomou Amoxicilina', time: 'Há 2 horas', icon: Pill },
  { text: 'Exame de sangue enviado', time: 'Ontem', icon: Upload },
  { text: 'Tomou Ibuprofeno', time: 'Ontem', icon: Pill },
  { text: 'Raio-X enviado', time: 'Há 3 dias', icon: FileText },
];

export default function DashboardScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Olá, João! 👋</Text>
        <Text style={styles.subtitle}>Aqui está o seu resumo de saúde</Text>

        {/* Stats grid */}
        <View style={styles.grid}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <View key={i} style={styles.statCard}>
                <Icon size={22} color={s.color} />
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Recent activity */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock size={18} color={colors.textMuted} />
            <Text style={styles.cardTitle}>Atividade Recente</Text>
          </View>
          {recentActivity.map((a, i) => {
            const Icon = a.icon;
            return (
              <View key={i} style={styles.activityRow}>
                <View style={styles.activityIcon}><Icon size={16} color={colors.accent} /></View>
                <View style={styles.activityText}>
                  <Text style={styles.activityTitle}>{a.text}</Text>
                  <Text style={styles.activityTime}>{a.time}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ações Rápidas</Text>
          <View style={styles.actionsCol}>
            <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => navigation.navigate('Medications')}>
              <Plus size={16} color={colors.white} />
              <Text style={styles.actionBtnPrimaryText}>Adicionar Medicamento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => navigation.navigate('Exams')}>
              <Upload size={16} color={colors.white} />
              <Text style={styles.actionBtnPrimaryText}>Enviar Exame</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnOutline} onPress={() => navigation.navigate('Profile')}>
              <UserPen size={16} color={colors.text} />
              <Text style={styles.actionBtnOutlineText}>Atualizar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: colors.white, borderRadius: 16, padding: 18, gap: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  activityIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: `${colors.accent}18`, alignItems: 'center', justifyContent: 'center' },
  activityText: { flex: 1 },
  activityTitle: { fontSize: 13, fontWeight: '500', color: colors.text },
  activityTime: { fontSize: 11, color: colors.textMuted },
  actionsCol: { gap: 10 },
  actionBtnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.accent, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  actionBtnPrimaryText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  actionBtnOutline: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.border, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  actionBtnOutlineText: { color: colors.text, fontWeight: '500', fontSize: 14 },
});
