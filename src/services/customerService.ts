import { apiClient, fetchPaginated } from './apiClient';
import type { Customer, CustomerFormData } from '@/types/customer';
import type { PaginatedResponse, PaginationParams } from '@/types/api';

export const customerService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Customer>> {
    return fetchPaginated<Customer>('/customers', params);
  },

  async getById(id: number): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  async create(data: CustomerFormData): Promise<Customer> {
    const response = await apiClient.post<Customer>('/customers', data);
    return response.data;
  },

  async update(id: number, data: Customer): Promise<void> {
    await apiClient.put(`/customers/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },
};
