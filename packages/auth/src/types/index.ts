export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface AdminLoginResponse {
  message: string;
  data: {
    token: string;
    admin: User;
  };
}

export interface UnifiedLoginResponse {
  token: string;
  user: User;
  role: 'user' | 'admin';
}

export interface RegisterResponse {
  message: string;
  data: User;
}

export interface ApiValidationError {
  error: string;
  details?: Array<{ field: string; message: string }>;
}

export interface AuthAppProps {
  onLoginSuccess: (token: string, user: User, role: 'user' | 'admin') => void;
  onRegisterSuccess: () => void;
  defaultView?: 'login' | 'register';
}
