import { api } from './api'

export interface Medicine {
  id: string
  userId: string
  name: string
  type: 'PILL' | 'LIQUID'
  intervalHours: number
  lastTakenAt: string
  continuousUse: boolean
  treatmentFinished: boolean
  totalPills?: number
  pillsPerDose?: number
  totalMl?: number
  mlPerDose?: number
  createdAt: string
}

export interface MedicinePayload {
  name: string
  type: 'PILL' | 'LIQUID'
  intervalHours: number
  lastTakenAt: string
  continuousUse: boolean
  treatmentFinished?: boolean
  totalPills?: number
  pillsPerDose?: number
  totalMl?: number
  mlPerDose?: number
}

export interface MedicineHistory {
  id: string
  medicineId: string
  takenAt: string
  onTime: boolean
}

export const getMedicines = async () => {
  const res = await api.get<Medicine[]>('/medicines')
  return res.data
}

export const getMedicineById = async (id: string) => {
  const res = await api.get<Medicine>(`/medicines/${id}`)
  return res.data
}

export const createMedicine = async (data: MedicinePayload) => {
  const res = await api.post('/medicines', data)
  return res.data
}

export const updateMedicine = async (
  id: string,
  data: Partial<MedicinePayload>
) => {
  const res = await api.put(`/medicines/${id}`, data)
  return res.data
}

export const deleteMedicine = async (id: string) => {
  const res = await api.delete(`/medicines/${id}`)
  return res.data
}

export const createHistory = async (
  id: string,
  takenAt: string,
  onTime: boolean
) => {
  const res = await api.post(`/medicines/${id}/history`, { takenAt, onTime })
  return res.data
}

export const getHistoryByMedicine = async (id: string) => {
  const res = await api.get<MedicineHistory[]>(`/medicines/${id}/history`)
  return res.data
}

export const getHistoryById = async (historyId: string) => {
  const res = await api.get(`/medicines/history/${historyId}`)
  return res.data
}
