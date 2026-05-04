import { useContext } from 'react'
import { ExamContext } from '../context/ExamContext'

export const useExam = () => useContext(ExamContext)
