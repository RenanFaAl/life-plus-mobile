import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { UserPen, Mail, Lock, Accessibility, Trash2 } from 'lucide-react-native';
import colors from '../theme/colors';

const settings = [
  { icon: UserPen, title: 'Editar Perfil', desc: 'Atualize suas informações pessoais', action: 'Editar', destructive: false },
  { icon: Mail, title: 'Alterar E-mail', desc: 'Mude o e-mail da sua conta', action: 'Alterar', destructive: false },
  { icon: Lock, title: 'Alterar Senha', desc: 'Atualize sua senha de acesso', action: 'Alterar', destructive: false },
  { icon: Accessibility, title: 'Acessibilidade', desc: 'Configure opções de acessibilidade', action: 'Configurar', destructive: false },
  { icon: Trash2, title: 'Excluir Conta', desc: 'Exclui permanentemente sua conta', action: 'Excluir', destructive: true },
];

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Configurações</Text>
        <View style={styles.list}>
          {settings.map((s, i) => {
            const Icon = s.icon;
            return (
              <View key={i} style={styles.item}>
                <View style={[styles.iconBox, s.destructive && styles.iconBoxDestructive]}>
                  <Icon size={20} color={s.destructive ? colors.destructive : colors.accent} />
                </View>
                <View style={styles.itemText}>
                  <Text style={styles.itemTitle}>{s.title}</Text>
                  <Text style={styles.itemDesc}>{s.desc}</Text>
                </View>
                <TouchableOpacity style={[styles.actionBtn, s.destructive && styles.actionBtnDestructive]}>
                  <Text style={[styles.actionText, s.destructive && styles.actionTextDestructive]}>{s.action}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, maxWidth: 560, alignSelf: 'center', width: '100%' },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  list: { gap: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, borderRadius: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  iconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: `${colors.accent}18`, alignItems: 'center', justifyContent: 'center' },
  iconBoxDestructive: { backgroundColor: `${colors.destructive}12` },
  itemText: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  itemDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  actionBtn: { borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  actionBtnDestructive: { borderColor: `${colors.destructive}40`, backgroundColor: `${colors.destructive}08` },
  actionText: { fontSize: 13, fontWeight: '500', color: colors.text },
  actionTextDestructive: { color: colors.destructive },
});
