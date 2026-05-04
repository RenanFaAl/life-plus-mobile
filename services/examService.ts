import { api } from './api'

export interface AppFile {
  uri: string;
  name: string;
  type: string;
}

export interface ExamPhoto {
  id: string
  fileName: string
  mimeType: string
  createdAt: string
}

export interface Exam {
  id: string
  name: string
  description?: string
  date: string
  result?: string
  photos: ExamPhoto[]
}

export interface CreateExamData {
  name: string
  description?: string
  date: string
  result?: string
  files?: AppFile[] 
}

export interface UpdateExamData {
  name?: string
  description?: string
  date?: string
  result?: string
  files?: AppFile[] 
  removePhotos?: string[]
}

export const getExams = async (): Promise<Exam[]> => {
  const response = await api.get('/exams')
  return response.data
}

export const getExamById = async (id: string): Promise<Exam> => {
  const response = await api.get(`/exams/${id}`)
  return response.data
}

export const createExam = async (data: CreateExamData) => {
  const formData = new FormData()
  
  formData.append('name', data.name)
  if (data.description) formData.append('description', data.description)
  formData.append('date', data.date)
  if (data.result) formData.append('result', data.result)
  
  if (data.files) {
    data.files.forEach(file => {
      formData.append('files', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any)
    })
  }

  const response = await api.post('/exams', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateExam = async (id: string, data: UpdateExamData) => {
  const formData = new FormData()
  
  if (data.name) formData.append('name', data.name)
  if (data.description) formData.append('description', data.description)
  if (data.date) formData.append('date', data.date)
  if (data.result) formData.append('result', data.result)
  
  if (data.removePhotos)
    formData.append('removePhotos', JSON.stringify(data.removePhotos))
    
  if (data.files) {
    data.files.forEach(file => {
      formData.append('files', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any)
    })
  }

  const response = await api.put(`/exams/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteExam = async (id: string) => {
  const response = await api.delete(`/exams/${id}`)
  return response.data
}


export const getExamPhotoById = async (photoId: string) => {
  const response = await api.get(`/exams/photos/${photoId}`, {
    responseType: 'blob' 
  })
  return response.data
}