export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface DashboardAppProps {
  user: User | null;
  onLogout: () => void;
  role: 'user' | 'admin';
}
