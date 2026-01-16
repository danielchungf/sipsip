import api from './api';
import type { Companion, CreateCompanionDTO, UpdateCompanionDTO } from '@coffee/shared';

export const companionsService = {
  async getCompanions(): Promise<Companion[]> {
    const response = await api.get<Companion[]>('/companions');
    return response.data;
  },

  async getCompanion(id: string): Promise<Companion> {
    const response = await api.get<Companion>(`/companions/${id}`);
    return response.data;
  },

  async createCompanion(data: CreateCompanionDTO): Promise<Companion> {
    const response = await api.post<Companion>('/companions', data);
    return response.data;
  },

  async updateCompanion(id: string, data: UpdateCompanionDTO): Promise<Companion> {
    const response = await api.put<Companion>(`/companions/${id}`, data);
    return response.data;
  },

  async deleteCompanion(id: string): Promise<void> {
    await api.delete(`/companions/${id}`);
  },
};
