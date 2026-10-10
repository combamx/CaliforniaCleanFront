import { apiClient, fetchPaginated } from './apiClient';
import type { Project, ProjectFormData, VListProject } from '@/types/project';
import type { PaginatedResponse, PaginationParams } from '@/types/api';

export const projectService = {
  // Fetch detailed list from view (joined with customer names, status descriptions, etc.)
  async getVListProjects(params?: PaginationParams): Promise<PaginatedResponse<VListProject>> {
    return fetchPaginated<VListProject>('/vlistprojects', params);
  },

  // Fetch raw projects
  async getProjects(params?: PaginationParams): Promise<PaginatedResponse<Project>> {
    return fetchPaginated<Project>('/projects/getprojects', params);
  },

  async getById(id: number): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async create(data: ProjectFormData): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', data);
    return response.data;
  },

  async update(id: number, data: Project): Promise<void> {
    await apiClient.put(`/projects/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
};
