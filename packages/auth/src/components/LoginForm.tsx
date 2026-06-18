import { useState, FormEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { IAuthService } from '../services/interfaces/IAuthService';
import type { User } from '../types';

interface LoginFormProps {
  authService: IAuthService;
  onSuccess: (token: string, user: User) => void;
  onSwitchToRegister: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!email) errors.email = 'El correo es requerido';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Formato de correo inválido';
  if (!password) errors.password = 'La contraseña es requerida';
  return errors;
}

/**
 * Single Responsibility: renders and validates the login form.
 * Dependency Inversion: depends on IAuthService interface, not concrete class.
 */
export default function LoginForm({ authService, onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      onSuccess(response.data.token, response.data.user);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Error al iniciar sesión. Inténtalo de nuevo.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" fontWeight={600} mb={1} textAlign="center">
        Iniciar sesión
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Bienvenido de vuelta a Envios JCA
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }} data-testid="server-error">
          {serverError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
        autoComplete="email"
        inputProps={{ 'data-testid': 'email-input' }}
      />

      <TextField
        fullWidth
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        margin="normal"
        autoComplete="current-password"
        inputProps={{ 'data-testid': 'password-input' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, mb: 2, height: 48 }}
        data-testid="submit-button"
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
      </Button>

      <Typography variant="body2" textAlign="center">
        ¿No tienes cuenta?{' '}
        <Button
          variant="text"
          size="small"
          onClick={onSwitchToRegister}
          sx={{ p: 0, minWidth: 0, textTransform: 'none' }}
        >
          Regístrate
        </Button>
      </Typography>
    </Box>
  );
}
