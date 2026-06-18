import axios, { AxiosInstance } from 'axios';
import type { IAuthService } from './interfaces/IAuthService';
import type { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001';

/**
 * Single Responsibility: handles only HTTP auth requests.
 * Open/Closed: extend by subclassing — no modification needed for new auth strategies.
 * Liskov Substitution: any IAuthService implementation can replace this.
 * Dependency Inversion: accepts AxiosInstance so tests can inject a mock transport.
 */
export class AuthService implements IAuthService {
  constructor(
    private readonly http: AxiosInstance = axios.create({ baseURL: API_BASE_URL })
  ) {}

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await this.http.post<LoginResponse>('/login', credentials);
    return data;
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const { data } = await this.http.post<RegisterResponse>('/register', credentials);
    return data;
  }
}

export const authService = new AuthService();
