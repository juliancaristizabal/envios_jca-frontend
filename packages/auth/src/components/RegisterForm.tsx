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

interface RegisterFormProps {
  authService: IAuthService;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

function validate(name: string, email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!name || name.trim().length < 2) errors.name = 'El nombre debe tener al menos 2 caracteres';
  if (name.trim().length > 100) errors.name = 'El nombre no puede superar los 100 caracteres';
  if (!email) errors.email = 'El correo es requerido';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Formato de correo inválido';
  if (!password) errors.password = 'La contraseña es requerida';
  else if (password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres';
  return errors;
}

/**
 * Single Responsibility: renders and validates the register form.
 * Dependency Inversion: depends on IAuthService interface.
 */
export default function RegisterForm({ authService, onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate(name, email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      await authService.register({ name: name.trim(), email, password });
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Error al registrarse. Inténtalo de nuevo.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" fontWeight={600} mb={1} textAlign="center">
        Crear cuenta
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Únete a Envios JCA hoy
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }} data-testid="server-error">
          {serverError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!errors.name}
        helperText={errors.name}
        margin="normal"
        autoComplete="name"
        inputProps={{ 'data-testid': 'name-input' }}
      />

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
        autoComplete="new-password"
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
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear cuenta'}
      </Button>

      <Typography variant="body2" textAlign="center">
        ¿Ya tienes cuenta?{' '}
        <Button
          variant="text"
          size="small"
          onClick={onSwitchToLogin}
          sx={{ p: 0, minWidth: 0, textTransform: 'none' }}
        >
          Iniciar sesión
        </Button>
      </Typography>
    </Box>
  );
}
