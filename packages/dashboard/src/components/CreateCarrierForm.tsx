import { useState, FormEvent } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Typography,
  Divider,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { adminService } from '../services/AdminService';
import type { CreateCarrierPayload } from '../types/admin';
import type { HttpError } from '../services/http/FetchHttpClient';

interface CreateCarrierFormProps {
  token: string;
  onSuccess: () => void;
}

interface FormFields {
  name: string;
  phone: string;
  vehicleType: 'moto' | 'van' | 'camion' | '';
  capacityKg: string;
  capacityM3: string;
}

type FormErrors = Partial<Record<keyof FormFields, string>>;

const INITIAL: FormFields = {
  name: '',
  phone: '',
  vehicleType: '',
  capacityKg: '',
  capacityM3: '',
};

const VEHICLE_OPTIONS: { value: 'moto' | 'van' | 'camion'; label: string }[] = [
  { value: 'moto',   label: 'Moto' },
  { value: 'van',    label: 'Van' },
  { value: 'camion', label: 'Camión' },
];

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim()) {
    errors.name = 'El nombre es requerido';
  } else if (fields.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }

  const digits = fields.phone.replace(/\D/g, '');
  if (!fields.phone.trim()) {
    errors.phone = 'El teléfono es requerido';
  } else if (digits.length < 7) {
    errors.phone = 'El teléfono debe tener al menos 7 dígitos';
  }

  if (!fields.vehicleType) {
    errors.vehicleType = 'Selecciona un tipo de vehículo';
  }

  if (!fields.capacityKg) {
    errors.capacityKg = 'La capacidad en kg es requerida';
  } else if (isNaN(Number(fields.capacityKg)) || Number(fields.capacityKg) <= 0) {
    errors.capacityKg = 'Debe ser un número mayor a 0';
  }

  if (!fields.capacityM3) {
    errors.capacityM3 = 'La capacidad en m³ es requerida';
  } else if (isNaN(Number(fields.capacityM3)) || Number(fields.capacityM3) <= 0) {
    errors.capacityM3 = 'Debe ser un número mayor a 0';
  }

  return errors;
}

export default function CreateCarrierForm({ token, onSuccess }: CreateCarrierFormProps) {
  const [fields, setFields] = useState<FormFields>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const payload: CreateCarrierPayload = {
      name:        fields.name.trim(),
      phone:       fields.phone.trim(),
      vehicleType: fields.vehicleType as 'moto' | 'van' | 'camion',
      capacityKg:  Number(fields.capacityKg),
      capacityM3:  Number(fields.capacityM3),
    };

    try {
      await adminService.createCarrier(token, payload);
      setFields(INITIAL);
      onSuccess();
    } catch (err) {
      const httpErr = err as HttpError;
      setServerError(httpErr?.message ?? 'No se pudo registrar el transportista.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}

      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Datos personales
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre completo"
            value={fields.name}
            onChange={set('name')}
            error={!!errors.name}
            helperText={errors.name}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teléfono"
            value={fields.phone}
            onChange={set('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
            inputProps={{ maxLength: 20 }}
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Vehículo y capacidad
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth error={!!errors.vehicleType}>
            <InputLabel>Tipo de vehículo</InputLabel>
            <Select
              value={fields.vehicleType}
              label="Tipo de vehículo"
              onChange={(e) =>
                setFields((p) => ({ ...p, vehicleType: e.target.value as 'moto' | 'van' | 'camion' }))
              }
            >
              {VEHICLE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
            {errors.vehicleType && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.vehicleType}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Capacidad de peso"
            type="number"
            value={fields.capacityKg}
            onChange={set('capacityKg')}
            error={!!errors.capacityKg}
            helperText={errors.capacityKg}
            InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Capacidad de volumen"
            type="number"
            value={fields.capacityM3}
            onChange={set('capacityM3')}
            error={!!errors.capacityM3}
            helperText={errors.capacityM3}
            InputProps={{ endAdornment: <InputAdornment position="end">m³</InputAdornment> }}
          />
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" size="large" fullWidth sx={{ height: 48 }} disabled={loading}>
        {loading ? <CircularProgress size={22} color="inherit" /> : 'Registrar transportista'}
      </Button>
    </Box>
  );
}
