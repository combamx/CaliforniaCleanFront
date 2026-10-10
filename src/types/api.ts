export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  desc?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
