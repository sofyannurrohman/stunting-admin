import api from './index'
import type { ChildProfileRead, ChildProfileCreate, ChildProfileUpdate } from '@/api/schemas/child_profile_schema'

export default {
  /**
   * Get ALL child profiles
   */
  getAll(): Promise<{ data: ChildProfileRead[] }> {
    return api.get('/child-profiles')
  },

  /**
   * Get child profiles by user ID
   */
  listByUser(userId: number): Promise<{ data: ChildProfileRead[] }> {
    return api.get(`/child-profiles/user/${userId}`)
  },

  /**
   * Get child profile by ID
   */
  getById(id: number): Promise<{ data: ChildProfileRead }> {
    return api.get(`/child-profiles/${id}`)
  },

  /**
   * Get child profile by NIK
   */
  getByNik(nik: string): Promise<{ data: ChildProfileRead }> {
    return api.get(`/child-profiles/by-nik/${nik}`)
  },

  /**
   * Create a new child profile
   */
  create(payload: ChildProfileCreate): Promise<{ data: ChildProfileRead }> {
    return api.post('/child-profiles', payload)
  },

  /**
   * Update child profile (PATCH)
   */
  update(id: number, payload: ChildProfileUpdate): Promise<{ data: ChildProfileRead }> {
    return api.patch(`/child-profiles/${id}`, payload)
  },

  /**
   * Delete child profile
   */
  delete(id: number): Promise<{ data: { message: string } }> {
    return api.delete(`/child-profiles/${id}`)
  }
}
