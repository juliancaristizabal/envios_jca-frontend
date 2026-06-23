import { Container, Paper, Box } from '@mui/material';
import LoginForm from '../components/LoginForm';
import type { IAuthService } from '../services/interfaces/IAuthService';
import type { User } from '../types';

interface LoginPageProps {
  authService: IAuthService;
  onLoginSuccess: (token: string, user: User, role: 'user' | 'admin') => void;
  onSwitchToRegister: () => void;
}

export default function LoginPage({ authService, onLoginSuccess, onSwitchToRegister }: LoginPageProps) {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="calc(100vh - 64px)"
        py={4}
      >
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, width: '100%', borderRadius: 2 }}>
          <LoginForm
            authService={authService}
            onSuccess={onLoginSuccess}
            onSwitchToRegister={onSwitchToRegister}
          />
        </Paper>
      </Box>
    </Container>
  );
}
