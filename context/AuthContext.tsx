import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as authService from '../services/authService'

interface AuthContextType {
  user: any | null
  token: string | null 
  loading: boolean
  message: string | null
  messageType: 'success' | 'error' | null
  loginSuccess: boolean

  login: (data: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  register: (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
    birthDate: string
  }) => Promise<void>

  fetchLoggedUser: () => Promise<void>
  closeMessage: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null) // Novo estado
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token')
        if (storedToken) {
          setToken(storedToken)
          await fetchLoggedUser()
        }
      } catch (error) {
        console.error('Erro ao carregar dados locais', error)
      } finally {
        setLoading(false)
      }
    }

    loadStorageData()
  }, [])

  const fetchLoggedUser = async () => {
    try {
      const data = await authService.getLoggedUser()
      setUser(data)
    } catch (error) {
      setUser(null)
      setToken(null)
      await AsyncStorage.removeItem('token')
    }
  }

  const login = async (data: { email: string; password: string }) => {
    try {
      setLoading(true)
      const res = await authService.loginUser(data)
      
      await AsyncStorage.setItem('token', res.token)
      setToken(res.token) 

      setMessage('Login realizado com sucesso!')
      setMessageType('success')
      setLoginSuccess(true)

      await fetchLoggedUser()
    } catch (error: any) {
      const msg = error?.response?.data?.details || 'Erro ao fazer login.'
      setMessage(msg)
      setMessageType('error')
      setLoginSuccess(false)
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      setUser(null)
      setToken(null) 
      setLoginSuccess(false)
      setMessage(null)
      setMessageType(null)
    } catch (error) {
      console.error('Erro ao limpar storage no logout', error)
    }
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
    birthDate: string
  }) => {
    try {
      setLoading(true)
      await authService.registerUser(data)

      setMessage('Cadastro realizado com sucesso!')
      setMessageType('success')
    } catch (error: any) {
      const errorDetail = error?.response?.data?.details;
      const errorMessage = error?.response?.data?.error;
      
      const msg = errorDetail || errorMessage || 'Erro ao registrar usuário.';
      
      setMessage(msg)
      setMessageType('error')
      
      console.log("Erro capturado no Mobile:", error?.response?.data);
    } finally {
      setLoading(false)
    }
  }

  const closeMessage = () => {
    setMessage(null)
    setMessageType(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        message,
        messageType,
        login,
        logout,
        register,
        closeMessage,
        loginSuccess,
        fetchLoggedUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}