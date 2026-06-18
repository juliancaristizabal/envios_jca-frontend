export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface DashboardAppProps {
  user: User | null;
  onLogout: () => void;
}
