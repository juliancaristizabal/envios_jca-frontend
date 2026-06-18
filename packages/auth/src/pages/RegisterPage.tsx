import { Container, Paper, Box } from '@mui/material';
import RegisterForm from '../components/RegisterForm';
import type { IAuthService } from '../services/interfaces/IAuthService';

interface RegisterPageProps {
  authService: IAuthService;
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ authService, onRegisterSuccess, onSwitchToLogin }: RegisterPageProps) {
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
          <RegisterForm
            authService={authService}
            onSuccess={onRegisterSuccess}
            onSwitchToLogin={onSwitchToLogin}
          />
        </Paper>
      </Box>
    </Container>
  );
}
