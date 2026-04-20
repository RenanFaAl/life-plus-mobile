import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, LayoutAnimation,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pill, FileText, Bell, MapPin, Shield, Clock, Smartphone, ChevronRight, ChevronDown } from 'lucide-react-native';
import colors from '../theme/colors';

const features = [
  { icon: Pill, title: 'Gestão de Medicamentos', desc: 'Controle todos os seus medicamentos e dosagens em um só lugar.' },
  { icon: FileText, title: 'Armazenamento de Exames', desc: 'Guarde e acesse seus exames com segurança a qualquer momento.' },
  { icon: Bell, title: 'Lembretes', desc: 'Nunca esqueça de tomar seus medicamentos com notificações automáticas.' },
  { icon: MapPin, title: 'Farmácias Próximas', desc: 'Encontre farmácias perto de você rapidamente.' },
];

const benefits = [
  { icon: Shield, title: 'Seguro', desc: 'Seus dados de saúde protegidos com criptografia de ponta.' },
  { icon: Clock, title: 'Economize Tempo', desc: 'Tenha tudo organizado e acessível em segundos.' },
  { icon: Smartphone, title: 'Acessível', desc: 'Disponível no seu celular onde e quando precisar.' },
];

const faqs = [
  { q: 'O Life+ é gratuito?', a: 'Sim, o plano básico é totalmente gratuito com recursos essenciais.' },
  { q: 'Meus dados estão seguros?', a: 'Utilizamos criptografia de ponta a ponta para proteger suas informações.' },
  { q: 'Posso compartilhar com meu médico?', a: 'Sim, é possível compartilhar relatórios com profissionais de saúde.' },
  { q: 'Funciona offline?', a: 'Os dados ficam salvos localmente e sincronizam quando há conexão.' },
  { q: 'Como faço para cadastrar medicamentos?', a: 'Basta acessar a seção Medicamentos e tocar em Adicionar.' },
];

export default function HomeScreen({ navigation }: any) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.hero}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}><Text style={styles.logoIconText}>L+</Text></View>
          <Text style={styles.logoText}>Life+</Text>
        </View>
        <Text style={styles.heroTitle}>Sua saúde,{'\n'}<Text style={styles.heroTitleAccent}>sempre em mãos</Text></Text>
        <Text style={styles.heroSub}>Gerencie medicamentos, exames e lembretes de saúde com facilidade.</Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.btnPrimaryText}>Começar agora</Text>
            <ChevronRight size={16} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}>
            <Text style={styles.btnOutlineText}>Saiba mais</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Funcionalidades</Text>
        <Text style={styles.sectionSub}>Tudo que você precisa para cuidar da sua saúde.</Text>
        <View style={styles.grid}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <View key={i} style={styles.featureCard}>
                <View style={styles.iconBox}><Icon size={22} color={colors.primary} /></View>
                <Text style={styles.cardTitle}>{f.title}</Text>
                <Text style={styles.cardDesc}>{f.desc}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Benefits */}
      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <Text style={styles.sectionTitle}>Benefícios</Text>
        <Text style={styles.sectionSub}>Por que usar o Life+?</Text>
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.benefitIcon}><Icon size={24} color={colors.primary} /></View>
              <View style={styles.benefitText}>
                <Text style={styles.cardTitle}>{b.title}</Text>
                <Text style={styles.cardDesc}>{b.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
        {faqs.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqItem}
            onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setOpenFaq(openFaq === i ? null : i); }}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <ChevronDown size={18} color={colors.textMuted} style={{ transform: [{ rotate: openFaq === i ? '180deg' : '0deg' }] }} />
            </View>
            {openFaq === i && <Text style={styles.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.cta}>
        <Text style={styles.ctaTitle}>Pronto para começar?</Text>
        <Text style={styles.ctaSub}>Crie sua conta gratuitamente e comece a cuidar da sua saúde hoje.</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.ctaBtnText}>Criar conta grátis</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: { padding: 32, paddingTop: 60, alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 32 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  logoIconText: { color: colors.white, fontWeight: 'bold', fontSize: 14 },
  logoText: { color: colors.white, fontSize: 24, fontWeight: 'bold' },
  heroTitle: { fontSize: 36, fontWeight: '800', color: colors.white, textAlign: 'center', lineHeight: 44, marginBottom: 16 },
  heroTitleAccent: { color: 'rgba(255,255,255,0.85)' },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  heroButtons: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  btnPrimaryText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  btnOutline: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  btnOutlineText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  section: { padding: 24, backgroundColor: colors.white },
  sectionTitle: { fontSize: 26, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 8 },
  sectionSub: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 24 },
  grid: { gap: 16 },
  featureCard: { backgroundColor: colors.background, borderRadius: 16, padding: 20 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: `${colors.primary}18`, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 20 },
  benefitIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: `${colors.primary}15`, alignItems: 'center', justifyContent: 'center' },
  benefitText: { flex: 1 },
  faqItem: { backgroundColor: colors.background, borderRadius: 16, padding: 18, marginBottom: 10 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, marginRight: 8 },
  faqA: { fontSize: 13, color: colors.textMuted, marginTop: 10, lineHeight: 20 },
  cta: { margin: 24, borderRadius: 24, padding: 32, alignItems: 'center' },
  ctaTitle: { fontSize: 24, fontWeight: 'bold', color: colors.white, textAlign: 'center', marginBottom: 8 },
  ctaSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  ctaBtn: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  ctaBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
});
