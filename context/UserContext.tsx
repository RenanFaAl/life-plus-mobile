import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as userService from '../services/userService'
import { useAuth } from '../hooks/useAuth'

interface UserContextType {
  user: any | null
  loading: boolean
  message: string | null
  messageType: 'success' | 'error' | null

  fetchUser: () => Promise<void>
  updatePassword: (data: userService.UpdatePasswordData) => Promise<void>
  updateEmail: (data: userService.UpdateEmailData) => Promise<void>
  updateProfile: (data: userService.UpdateProfileData) => Promise<void>
  deleteAccount: () => Promise<void>
  closeMessage: () => void
}

export const UserContext = createContext<UserContextType>({} as UserContextType)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)
  
  const { logout } = useAuth()

  const fetchUser = async () => {
    try {
      setLoading(true)
      const data = await userService.getLoggedUser()
      setUser(data)
    } catch (error: any) {
      setUser(null)
      setMessage(error?.response?.data?.error || 'Erro ao obter usuário')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (data: userService.UpdatePasswordData) => {
    try {
      setLoading(true)
      const res = await userService.updatePassword(data)
      setMessage(res.message || 'Senha atualizada com sucesso!')
      setMessageType('success')
    } catch (error: any) {
      setMessage(error?.response?.data?.error || 'Erro ao atualizar senha')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const updateEmail = async (data: userService.UpdateEmailData) => {
    try {
      setLoading(true)
      const res = await userService.updateEmail(data)
      const updatedUser = await userService.getLoggedUser()
      setUser(updatedUser)
      setMessage(res.message || 'E-mail atualizado com sucesso!')
      setMessageType('success')
    } catch (error: any) {
      setMessage(error?.response?.data?.error || 'Erro ao atualizar email')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: userService.UpdateProfileData) => {
    try {
      setLoading(true)
      const res = await userService.updateProfile(data)
      setUser(res.user) 
      setMessage(res.message || 'Perfil atualizado com sucesso!')
      setMessageType('success')
    } catch (error: any) {
      setMessage(error?.response?.data?.error || 'Erro ao atualizar perfil')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    try {
      setLoading(true)
      const res = await userService.deleteAccount()
      setUser(null)
      await logout() 
      setMessage(res.message || 'Conta excluída com sucesso')
      setMessageType('success')
    } catch (error: any) {
      setMessage(error?.response?.data?.error || 'Erro ao excluir conta')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const closeMessage = () => {
    setMessage(null)
    setMessageType(null)
  }

  useEffect(() => {
    const initUser = async () => {
      const token = await AsyncStorage.getItem('token')
      if (token) {
        await fetchUser()
      }
    }
    initUser()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        message,
        messageType,
        fetchUser,
        updatePassword,
        updateEmail,
        updateProfile,
        deleteAccount,
        closeMessage
      }}
    >
      {children}
    </UserContext.Provider>
  )
}