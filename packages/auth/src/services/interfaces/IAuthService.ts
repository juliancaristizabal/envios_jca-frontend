import type { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from '../../types';

/**
 * Contract for authentication operations.
 * Follows Interface Segregation (ISP) — only auth methods here.
 * Enables Dependency Inversion (DIP) — consumers depend on this, not on concrete HTTP implementation.
 */
export interface IAuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  register(credentials: RegisterCredentials): Promise<RegisterResponse>;
}
