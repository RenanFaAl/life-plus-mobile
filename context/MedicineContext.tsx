import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as medicineService from '../services/medicineService'

interface MedicineContextType {
  medicines: medicineService.Medicine[]
  history: medicineService.MedicineHistory[]
  loading: boolean
  message: string | null
  messageType: 'success' | 'error' | null

  fetchMedicines: () => Promise<void>
  fetchMedicineHistory: (id: string) => Promise<void>
  createMedicine: (data: medicineService.MedicinePayload) => Promise<any>
  updateMedicine: (
    id: string,
    data: Partial<medicineService.MedicinePayload>
  ) => Promise<any>
  deleteMedicine: (id: string) => Promise<void>
  createHistory: (id: string, takenAt: string, onTime: boolean) => Promise<void>
  getHistoryById: (
    historyId: string
  ) => Promise<medicineService.MedicineHistory>
  closeMessage: () => void
}

export const MedicineContext = createContext<MedicineContextType>(
  {} as MedicineContextType
)

export const MedicineProvider = ({ children }: { children: React.ReactNode }) => {
  const [medicines, setMedicines] = useState<medicineService.Medicine[]>([])
  const [history, setHistory] = useState<medicineService.MedicineHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)

  const fetchMedicines = async () => {
    try {
      setLoading(true)
      const data = await medicineService.getMedicines()
      setMedicines(data)
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao carregar remédios')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const createMedicine = async (data: medicineService.MedicinePayload) => {
    try {
      setLoading(true)
      const res = await medicineService.createMedicine(data)
      setMessage('Medicamento cadastrado com sucesso!')
      setMessageType('success')
      await fetchMedicines()
      return res
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao criar medicamento')
      setMessageType('error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateMedicine = async (
    id: string,
    data: Partial<medicineService.MedicinePayload>
  ) => {
    try {
      setLoading(true)
      const res = await medicineService.updateMedicine(id, data)
      setMessage('Medicamento atualizado com sucesso!')
      setMessageType('success')
      await fetchMedicines()
      return res
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao atualizar medicamento')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const deleteMedicine = async (id: string) => {
    try {
      setLoading(true)
      const res = await medicineService.deleteMedicine(id)
      setMessage(res.mensagem || 'Medicamento excluído com sucesso!')
      setMessageType('success')
      await fetchMedicines()
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao excluir medicamento')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const createHistory = async (
    id: string,
    takenAt: string,
    onTime: boolean
  ) => {
    try {
      setLoading(true)
      await medicineService.createHistory(id, takenAt, onTime)
      setMessage('Dose registrada com sucesso!')
      setMessageType('success')
      await fetchMedicines() 
      await fetchMedicineHistory(id)
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao registrar dose')
      setMessageType('error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchMedicineHistory = async (id: string) => {
    try {
      setLoading(true)
      const data = await medicineService.getHistoryByMedicine(id)
      setHistory(data)
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao carregar histórico')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const getHistoryById = async (historyId: string) => {
    try {
      const data = await medicineService.getHistoryById(historyId)
      return data
    } catch (error: any) {
      setMessage(error?.response?.data?.erro || 'Erro ao carregar histórico')
      setMessageType('error')
      throw error
    }
  }

  const closeMessage = () => {
    setMessage(null)
    setMessageType(null)
  }

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token')
      if (token) {
        await fetchMedicines()
      }
    }
    init()
  }, [])

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        history,
        loading,
        message,
        messageType,
        fetchMedicines,
        fetchMedicineHistory,
        createMedicine,
        updateMedicine,
        deleteMedicine,
        createHistory,
        getHistoryById,
        closeMessage
      }}
    >
      {children}
    </MedicineContext.Provider>
  )
}