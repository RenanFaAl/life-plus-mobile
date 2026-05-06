import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { FileText, Upload } from 'lucide-react-native';
import { useExam } from '../hooks/useExam'; 
import colors from '../theme/colors';

export default function ExamsScreen() {
  const navigation = useNavigation<any>();
  const { exams = [], fetchExams, loading } = useExam();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchExams();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Exames</Text>
          
          <TouchableOpacity 
            style={styles.uploadBtn}
            onPress={() => navigation.navigate('CreateExam')} 
          >
            <Upload size={16} color={colors.white} />
            <Text style={styles.uploadText}>Enviar</Text>
          </TouchableOpacity>
        </View>

        {loading && exams?.length === 0 ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 20 }} />
        ) : (
          <>
            {exams && exams.length > 0 ? (
              <View style={styles.grid}>
                {exams.map((exam, i) => (
                  <View key={exam.id || i} style={styles.card}>
                    <View style={styles.iconBox}>
                      <FileText size={22} color={colors.primary} />
                    </View>
                    <Text style={styles.examName}>{exam.name}</Text>
                    
                    <Text style={styles.examDate}>
                      {new Date(exam.date).toLocaleDateString('pt-BR')}
                    </Text>
                    
                    <TouchableOpacity 
                      style={styles.detailsBtn}
                      onPress={() => navigation.navigate('ExamDetails', { exam })} 
                    >
                      <Text style={styles.detailsText}>Ver detalhes</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : !loading && (
              <Text style={styles.emptyText}>Nenhum exame encontrado.</Text>
            )}
          </>
        )}
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
  emptyText: { textAlign: 'center', marginTop: 40, color: colors.textMuted, fontSize: 16 },
});