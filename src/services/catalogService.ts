import { apiClient, fetchPaginated } from './apiClient';
import type {
  Worker,
  Provider,
  Seller,
  Building,
  StatusProject,
  StatusWorkOrder,
  StatusDate,
  TypesProject,
  TypesOrderWork,
} from '@/types/catalogs';
import type { PaginatedResponse, PaginationParams } from '@/types/api';

export const catalogService = {
  // Workers
  async getWorkers(params?: PaginationParams): Promise<PaginatedResponse<Worker>> {
    return fetchPaginated<Worker>('/workers', { pageSize: 100, ...params });
  },

  async createWorker(worker: Omit<Worker, 'id'>): Promise<Worker> {
    const res = await apiClient.post<Worker>('/workers', worker);
    return res.data;
  },

  // Providers
  async getProviders(params?: PaginationParams): Promise<PaginatedResponse<Provider>> {
    return fetchPaginated<Provider>('/providers', { pageSize: 100, ...params });
  },

  // Sellers
  async getSellers(params?: PaginationParams): Promise<PaginatedResponse<Seller>> {
    return fetchPaginated<Seller>('/sellers', { pageSize: 100, ...params });
  },

  // Buildings
  async getBuildings(params?: PaginationParams): Promise<PaginatedResponse<Building>> {
    return fetchPaginated<Building>('/buildings', { pageSize: 100, ...params });
  },

  // Status Catalogs
  async getStatusProjects(): Promise<StatusProject[]> {
    const res = await apiClient.get<StatusProject[]>('/statusprojects', { params: { pageSize: 50 } });
    return res.data;
  },

  async getStatusWorkOrders(): Promise<StatusWorkOrder[]> {
    const res = await apiClient.get<StatusWorkOrder[]>('/statusworkorders', { params: { pageSize: 50 } });
    return res.data;
  },

  async getStatusDates(): Promise<StatusDate[]> {
    const res = await apiClient.get<StatusDate[]>('/statusdates', { params: { pageSize: 50 } });
    return res.data;
  },

  // Types Catalogs
  async getTypesProjects(): Promise<TypesProject[]> {
    const res = await apiClient.get<TypesProject[]>('/typesprojects', { params: { pageSize: 50 } });
    return res.data;
  },

  async getTypesOrderWorks(): Promise<TypesOrderWork[]> {
    const res = await apiClient.get<TypesOrderWork[]>('/typesorderworks', { params: { pageSize: 50 } });
    return res.data;
  },
};
