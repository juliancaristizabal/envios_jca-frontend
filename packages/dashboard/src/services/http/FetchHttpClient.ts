import type { IHttpClient, RequestConfig } from './IHttpClient';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: unknown,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class FetchHttpClient implements IHttpClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        (data as { message?: string })?.message ??
        (data as { error?: string })?.error ??
        'Error en la petición';
      throw new HttpError(response.status, data, message);
    }

    return data as T;
  }

  get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', path, undefined, config);
  }

  post<T>(path: string, body: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', path, body, config);
  }

  patch<T>(path: string, body: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', path, body, config);
  }
}

export const httpClient = new FetchHttpClient('http://localhost:3001');
