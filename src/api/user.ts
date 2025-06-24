import api from '@/api';  // 👈 import your reusable Axios instance
import type { UserCreate, UserRead, UserUpdate } from './schemas/user_schema';

export const getUsers = (params?: { skip?: number; limit?: number }) => {
  return api.get<UserRead[]>('/users/', { params });
};

export const getUser = (userId: number) => {
  return api.get<UserRead>(`/users/${userId}`);
};

export const createUser = (payload: UserCreate) => {
  return api.post<UserRead>('/users', payload);
};

export const updateUser = (userId: number, payload: UserUpdate) => {
  return api.put<UserRead>(`/users/${userId}`, payload);
};

export const deleteUser = (userId: number) => {
  return api.delete<UserRead>(`/users/${userId}`);
};
