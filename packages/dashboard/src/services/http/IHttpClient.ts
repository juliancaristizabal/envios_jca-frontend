export interface RequestConfig {
  headers?: Record<string, string>;
}

export interface IHttpClient {
  get<T>(path: string, config?: RequestConfig): Promise<T>;
  post<T>(path: string, body: unknown, config?: RequestConfig): Promise<T>;
  patch<T>(path: string, body: unknown, config?: RequestConfig): Promise<T>;
}
