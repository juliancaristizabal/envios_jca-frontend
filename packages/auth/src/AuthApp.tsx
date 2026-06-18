import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { authService } from './services/AuthService';
import type { AuthAppProps } from './types';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

/**
 * Main exported component for the auth microfrontend.
 * Receives callbacks from the shell — no direct Redux dependency.
 * The shell is responsible for persisting credentials globally.
 */
export default function AuthApp({ onLoginSuccess, onRegisterSuccess, defaultView = 'login' }: AuthAppProps) {
  const [view, setView] = useState<'login' | 'register'>(defaultView);

  // Sync local state when the shell navigates to a different route (/login vs /register)
  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  const handleRegisterSuccess = () => {
    setView('login');
    onRegisterSuccess();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {view === 'login' ? (
        <LoginPage
          authService={authService}
          onLoginSuccess={onLoginSuccess}
          onSwitchToRegister={() => setView('register')}
        />
      ) : (
        <RegisterPage
          authService={authService}
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setView('login')}
        />
      )}
    </ThemeProvider>
  );
}
