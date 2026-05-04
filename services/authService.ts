import { api } from './api'

interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  birthDate: string
}

interface LoginData {
  email: string
  password: string
}

interface ForgotPasswordData {
  email: string
}

interface VerifyCodeData {
  email: string
  code: string
}

interface ResetPasswordData {
  email: string
  newPassword: string
  confirmPassword: string
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const loginUser = async (data: LoginData) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const forgotPassword = async (data: ForgotPasswordData) => {
  const response = await api.post('/auth/forgot-password', data)
  return response.data
}

export const verifyRecoveryCode = async (data: VerifyCodeData) => {
  const response = await api.post('/auth/verify-code', data)
  return response.data
}

export const resetPassword = async (data: ResetPasswordData) => {
  const response = await api.post('/auth/reset-password', data)
  return response.data
}

export const getLoggedUser = async () => {
  const response = await api.get('/users/me')
  return response.data
}
