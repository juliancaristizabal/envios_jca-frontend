export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  role: 'user' | 'admin' | null;
  isAuthenticated: boolean;
}
