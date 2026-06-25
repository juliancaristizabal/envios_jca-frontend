declare module 'auth/AuthApp' {
  import { FC } from 'react';

  interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
  }

  export interface AuthAppProps {
    onLoginSuccess: (token: string, user: User, role: 'user' | 'admin') => void;
    onRegisterSuccess: () => void;
    defaultView?: 'login' | 'register';
  }

  const AuthApp: FC<AuthAppProps>;
  export default AuthApp;
}

declare module 'dashboard/DashboardApp' {
  import { FC } from 'react';

  interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
  }

  export interface DashboardAppProps {
    user: User | null;
    token: string | null;
    onLogout: () => void;
    role: 'user' | 'admin';
  }

  const DashboardApp: FC<DashboardAppProps>;
  export default DashboardApp;
}
