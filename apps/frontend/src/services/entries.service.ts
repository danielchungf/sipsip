import api from './api';
import type { CoffeeEntry, CreateCoffeeEntryDTO, UpdateCoffeeEntryDTO } from '@coffee/shared';

export interface EntriesResponse {
  entries: CoffeeEntry[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export const entriesService = {
  async getEntries(params?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<EntriesResponse> {
    const response = await api.get<EntriesResponse>('/entries', { params });
    return response.data;
  },

  async getEntry(id: string): Promise<CoffeeEntry> {
    const response = await api.get<CoffeeEntry>(`/entries/${id}`);
    return response.data;
  },

  async createEntry(data: CreateCoffeeEntryDTO): Promise<CoffeeEntry> {
    const response = await api.post<CoffeeEntry>('/entries', data);
    return response.data;
  },

  async updateEntry(id: string, data: UpdateCoffeeEntryDTO): Promise<CoffeeEntry> {
    const response = await api.put<CoffeeEntry>(`/entries/${id}`, data);
    return response.data;
  },

  async deleteEntry(id: string): Promise<void> {
    await api.delete(`/entries/${id}`);
  },
};
