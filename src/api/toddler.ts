import api from '@/api' // or your Axios instance path
import {
  type ToddlerCreate,
  type ToddlerUpdate,
  type ToddlerRead,
} from '@/api/schemas/toddler_schema'

export const getToddlers = () => api.get<ToddlerRead[]>('/toddlers')

export const getToddler = (id: number) => api.get<ToddlerRead>(`/toddlers/${id}`)

export const createToddler = (data: ToddlerCreate) => api.post<ToddlerRead>('/toddlers', data)

export const updateToddler = (id: number, data: ToddlerUpdate) =>
  api.put<ToddlerRead>(`/toddlers/${id}`, data)

export const deleteToddler = (id: number) => api.delete<ToddlerRead>(`/toddlers/${id}`)
