import { apiClient, fetchPaginated } from './apiClient';
import type { WorkOrder, WorkOrderFormData, CommentsWO, ChangeOrder } from '@/types/workOrder';
import type { PaginatedResponse, PaginationParams } from '@/types/api';

export const workOrderService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<WorkOrder>> {
    return fetchPaginated<WorkOrder>('/workorders', params);
  },

  async getById(id: number): Promise<WorkOrder> {
    const response = await apiClient.get<WorkOrder>(`/workorders/${id}`);
    return response.data;
  },

  async create(data: WorkOrderFormData): Promise<WorkOrder> {
    const response = await apiClient.post<WorkOrder>('/workorders', data);
    return response.data;
  },

  async update(id: number, data: WorkOrder): Promise<void> {
    await apiClient.put(`/workorders/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/workorders/${id}`);
  },

  // Comments for work orders
  async getComments(params?: PaginationParams): Promise<PaginatedResponse<CommentsWO>> {
    return fetchPaginated<CommentsWO>('/commentswoes', params);
  },

  async addComment(comment: { description: string; idWorkOrder: number }): Promise<CommentsWO> {
    const response = await apiClient.post<CommentsWO>('/commentswoes', comment);
    return response.data;
  },

  // Change orders
  async getChangeOrders(params?: PaginationParams): Promise<PaginatedResponse<ChangeOrder>> {
    return fetchPaginated<ChangeOrder>('/changeorders', params);
  },

  async createChangeOrder(data: Omit<ChangeOrder, 'id'>): Promise<ChangeOrder> {
    const response = await apiClient.post<ChangeOrder>('/changeorders', data);
    return response.data;
  },
};
