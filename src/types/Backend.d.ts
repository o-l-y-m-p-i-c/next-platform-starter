export interface IBackendResponse<T> {
  message?: string;
  data?: T;
  errors: {
    [key: string]: string;
  };
}

export interface IBackendResponsePagination<T> extends IBackendResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
