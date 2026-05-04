import { api } from './api'

export interface UpdatePasswordData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateEmailData {
  newEmail: string
}

export interface UpdateProfileData {
  name?: string
  birthDate?: string
}

export const getLoggedUser = async () => {
  const response = await api.get('/users/me')
  return response.data
}

export const updatePassword = async (data: UpdatePasswordData) => {
  const response = await api.post('/users/update-password', data)
  return response.data
}

export const updateEmail = async (data: UpdateEmailData) => {
  const response = await api.post('/users/update-email', data)
  return response.data
}

export const updateProfile = async (data: UpdateProfileData) => {
  const response = await api.put('/users/update-profile', data)
  return response.data
}

export const deleteAccount = async () => {
  const response = await api.delete('/users/delete-account')
  return response.data
}
