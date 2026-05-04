import { useContext } from 'react'
import { MedicineContext } from '../context/MedicineContext'

export const useMedicine = () => {
  return useContext(MedicineContext)
}
