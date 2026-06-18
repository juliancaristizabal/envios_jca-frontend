declare module 'auth/AuthApp' {
  import { FC } from 'react';
  import { User } from './types';

  export interface AuthAppProps {
    onLoginSuccess: (token: string, user: User) => void;
    onRegisterSuccess: () => void;
    defaultView?: 'login' | 'register';
  }

  const AuthApp: FC<AuthAppProps>;
  export default AuthApp;
}

declare module 'dashboard/DashboardApp' {
  import { FC } from 'react';
  import { User } from './types';

  export interface DashboardAppProps {
    user: User | null;
    onLogout: () => void;
  }

  const DashboardApp: FC<DashboardAppProps>;
  export default DashboardApp;
}
