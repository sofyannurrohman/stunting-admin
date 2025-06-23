import api from '@/api' // your pre-configured Axios instance
import type { LoginPayload, LoginResponse } from './schemas/auth_schema'

export const login = (payload: LoginPayload) => {
    return api.post<LoginResponse>('/auth/login', payload)
  }