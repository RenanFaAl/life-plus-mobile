import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as examService from '../services/examService'

interface ExamContextType {
  exams: examService.Exam[]
  loading: boolean
  message: string | null
  messageType: 'success' | 'error' | null

  fetchExams: () => Promise<void>
  createExam: (data: examService.CreateExamData) => Promise<void>
  updateExam: (id: string, data: examService.UpdateExamData) => Promise<void>
  deleteExam: (id: string) => Promise<void>
  getExamPhoto: (photoId: string) => Promise<any>
  downloadExamPhoto: (photoId: string, fileName: string) => Promise<void>
  closeMessage: () => void
}

export const ExamContext = createContext<ExamContextType>({} as ExamContextType)

export const ExamProvider = ({ children }: { children: React.ReactNode }) => {
  const [exams, setExams] = useState<examService.Exam[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)

  const fetchExams = async () => {
    try {
      setLoading(true)
      const data = await examService.getExams()
      setExams(data)
    } catch (error: any) {
      setMessage(error?.response?.data?.error || 'Erro ao obter exames')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const createExam = async (data: examService.CreateExamData) => {
    try {
      setLoading(true)
      const res = await examService.createExam(data)
      setMessage(res.message || 'Exame criado com sucesso!')
      setMessageType('success')
      await fetchExams()
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao criar exame')
      setMessageType('error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateExam = async (id: string, data: examService.UpdateExamData) => {
    try {
      setLoading(true)
      const res = await examService.updateExam(id, data)
      setMessage(res.message || 'Exame atualizado com sucesso!')
      setMessageType('success')
      await fetchExams()
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao atualizar exame')
      setMessageType('error')
      throw error;
    } finally {
      setLoading(false)
    }
  }

  const deleteExam = async (id: string) => {
    try {
      setLoading(true)
      const res = await examService.deleteExam(id)
      setMessage(res.mensagem || res.message || 'Exame excluído!')
      setMessageType('success')
      await fetchExams()
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao excluir exame')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const getExamPhoto = async (photoId: string): Promise<any> => {
    try {
      const data = await examService.getExamPhotoById(photoId)
      return data 
    } catch (err: any) {
      setMessage(err?.response?.data?.erro || 'Erro ao buscar foto')
      setMessageType('error')
      throw err
    }
  }

  const downloadExamPhoto = async (photoId: string, fileName: string) => {
    try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        
        const fileUri = ((FileSystem as any).documentDirectory || '') + fileName;

        const downloadRes = await FileSystem.downloadAsync(
        `${process.env.EXPO_PUBLIC_API_URL}/exams/photos/${photoId}`,
        fileUri,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
        } else {
        setMessage("Compartilhamento não disponível neste dispositivo");
        setMessageType('error');
        }

    } catch (err) {
        console.error(err);
        setMessage('Erro ao baixar o arquivo');
        setMessageType('error');
    } finally {
        setLoading(false);
    }
    };  

  const closeMessage = () => {
    setMessage(null)
    setMessageType(null)
  }

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token')
      if (token) fetchExams()
    }
    init()
  }, [])

  return (
    <ExamContext.Provider
      value={{
        exams,
        loading,
        message,
        messageType,
        fetchExams,
        createExam,
        updateExam,
        deleteExam,
        getExamPhoto,
        downloadExamPhoto,
        closeMessage
      }}
    >
      {children}
    </ExamContext.Provider>
  )
}