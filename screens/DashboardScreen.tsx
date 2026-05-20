import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import {
  Pill,
  CalendarDays,
  AlertTriangle,
  FileText,
  Plus,
  Upload,
  Clock
} from 'lucide-react-native';

import colors from '../theme/colors';

import { useUser } from '../hooks/useUser';
import * as dashboardService from '../services/dashboardService';

export default function DashboardScreen({ navigation }: any) {

  const {
    user,
    loading,
    fetchUser
  } = useUser();

  const [dashboard, setDashboard] = useState<any>(null);

  const [dashboardLoading, setDashboardLoading] =
    useState(true);


  const loadDashboard = async () => {

    try {

      setDashboardLoading(true);

      const data =
        await dashboardService.getDashboard();

      setDashboard(data);

    } catch (error) {

      console.log(
        'Erro ao carregar dashboard:',
        error
      );

    } finally {

      setDashboardLoading(false);

    }

  };


  useFocusEffect(
    useCallback(() => {

      fetchUser();

      loadDashboard();

    }, [])
  );


  const formatRelativeDate = (
    dateString: string
  ) => {

    const date =
      new Date(dateString);

    const now =
      new Date();

    const diff =
      now.getTime()
      -
      date.getTime();

    const hours =
      Math.floor(
        diff / (1000 * 60 * 60)
      );

    const days =
      Math.floor(hours / 24);

    if (hours < 1) {
      return 'Agora';
    }

    if (hours < 24) {

      return `Há ${hours} hora${hours > 1 ? 's' : ''
        }`;

    }

    if (days === 1) {
      return 'Ontem';
    }

    return `Há ${days} dias`;

  };


  const firstName =
    user?.name?.split(' ')[0]
    ||
    'Usuário';


  if (
    (loading && !user)
    ||
    dashboardLoading
  ) {

    return (

      <View
        style={[
          styles.container,
          {
            justifyContent: 'center'
          }
        ]}
      >

        <ActivityIndicator
          size='large'
          color={colors.accent}
        />

      </View>

    )

  }


  const stats = [

    {
      icon: Pill,
      label: 'Medicamentos hoje',
      value:
        dashboard?.medicationsToday || 0,
      color: colors.primary
    },

    {
      icon: CalendarDays,
      label: 'Exames agendados',
      value:
        dashboard?.scheduledExams || 0,
      color: colors.accent
    },

    {
      icon: AlertTriangle,
      label: 'Estoque baixo',
      value:
        dashboard?.lowStock || 0,
      color: colors.destructive
    },

    {
      icon: FileText,
      label: 'Exames salvos',
      value:
        dashboard?.savedExams || 0,
      color: colors.primary
    }

  ];


  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.content}>
        <Text style={styles.title}>
          Olá, {firstName}! 👋
        </Text>

        <Text style={styles.subtitle}>
          Aqui está seu resumo de saúde
        </Text>


        <View style={styles.grid}>

          {stats.map((s, i) => {

            const Icon = s.icon;

            return (

              <View
                key={i}
                style={styles.statCard}
              >

                <Icon
                  size={22}
                  color={s.color}
                />

                <Text
                  style={styles.statValue}
                >

                  {s.value}

                </Text>

                <Text
                  style={styles.statLabel}
                >

                  {s.label}

                </Text>

              </View>
            )
          })}
        </View>



        <View style={styles.card}>

          <View style={styles.cardHeader}>
            <Clock
              size={18}
              color={colors.textMuted}
            />

            <Text style={styles.cardTitle}>
              Atividade Recente
            </Text>
          </View>


          {
            dashboard?.recentActivity?.length ? (

              dashboard.recentActivity.map(
                (a: any, i: number) => {
                  const Icon =
                    a.type === "medication"
                      ? Pill
                      : FileText;


                  return (

                    <View
                      key={i}
                      style={styles.activityRow}
                    >

                      <View
                        style={styles.activityIcon}
                      >

                        <Icon
                          size={16}
                          color={colors.accent}
                        />

                      </View>


                      <View
                        style={styles.activityText}
                      >

                        <Text
                          style={styles.activityTitle}
                        >

                          {a.text}

                        </Text>

                        <Text
                          style={styles.activityTime}
                        >

                          {
                            formatRelativeDate(
                              a.time
                            )
                          }

                        </Text>

                      </View>

                    </View>

                  )

                })

            )

              :

              (

                <Text
                  style={styles.activityTime}
                >

                  Nenhuma atividade recente

                </Text>

              )

          }

        </View>


        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Ações rápidas
          </Text>

          <View style={styles.actionsCol}>
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() =>
                navigation.navigate(
                  'Medications'
                )
              }
            >

              <Plus
                size={16}
                color={colors.white}
              />

              <Text
                style={
                  styles.actionBtnPrimaryText
                }
              >
                Adicionar Medicamento
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() =>
                navigation.navigate(
                  'Exams'
                )
              }
            >

              <Upload
                size={16}
                color={colors.white}
              />

              <Text
                style={
                  styles.actionBtnPrimaryText
                }
              >
                Enviar Exame
              </Text>

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
  actionBtnPrimaryText: { color: colors.white, fontWeight: '600', fontSize: 14 }
});