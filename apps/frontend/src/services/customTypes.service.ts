import api from './api';
import type {
  CustomCoffeeType,
  CreateCustomCoffeeTypeDTO,
  UpdateCustomCoffeeTypeDTO,
} from '@coffee/shared';

export const customTypesService = {
  async getCustomTypes(): Promise<CustomCoffeeType[]> {
    const response = await api.get<CustomCoffeeType[]>('/custom-types');
    return response.data;
  },

  async getCustomType(id: string): Promise<CustomCoffeeType> {
    const response = await api.get<CustomCoffeeType>(`/custom-types/${id}`);
    return response.data;
  },

  async createCustomType(data: CreateCustomCoffeeTypeDTO): Promise<CustomCoffeeType> {
    const response = await api.post<CustomCoffeeType>('/custom-types', data);
    return response.data;
  },

  async updateCustomType(
    id: string,
    data: UpdateCustomCoffeeTypeDTO
  ): Promise<CustomCoffeeType> {
    const response = await api.put<CustomCoffeeType>(`/custom-types/${id}`, data);
    return response.data;
  },

  async deleteCustomType(id: string): Promise<void> {
    await api.delete(`/custom-types/${id}`);
  },
};
