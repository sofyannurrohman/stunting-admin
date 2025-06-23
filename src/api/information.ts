import api from '@/api'; // adjust based on your api instance path
import { type InformationRead } from '@/api/schemas/information_schema'

export const getAllInformation = (params?: { skip?: number; limit?: number }) => {
  return api.get<InformationRead[]>('/information/', { params });
};

export const getInformationById = (id: number) => {
  return api.get<InformationRead>(`/information/${id}`);
};

export const createInformation = (data: FormData) => {
  return api.post<InformationRead>('/information/', data);
};

export const updateInformation = (id: number, data: FormData) => {
  return api.put<InformationRead>(`/information/${id}`, data);
};

export const deleteInformation = (id: number) => {
  return api.delete<InformationRead>(`/information/${id}`);
};
