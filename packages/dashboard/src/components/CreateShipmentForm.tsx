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
  CircularProgress,
  Typography,
  Divider,
  InputAdornment,
} from '@mui/material';
import { shipmentService } from '../services/ShipmentService';
import type { CreateShipmentPayload, ProductType } from '../types/shipment';

interface CreateShipmentFormProps {
  token: string;
  onSuccess: () => void;
}

const PRODUCT_OPTIONS: { value: ProductType; label: string }[] = [
  { value: 'electronica', label: 'Electrónica' },
  { value: 'ropa',        label: 'Ropa' },
  { value: 'alimentos',   label: 'Alimentos' },
  { value: 'documentos',  label: 'Documentos' },
  { value: 'fragil',      label: 'Frágil' },
  { value: 'peligroso',   label: 'Peligroso' },
];

interface FormFields {
  weight: string;
  width: string;
  height: string;
  length: string;
  productType: ProductType | '';
  destAddress: string;
  destCity: string;
  destCountry: string;
  destZip: string;
}

type FormErrors = Partial<Record<keyof FormFields, string>>;

const INITIAL: FormFields = {
  weight: '', width: '', height: '', length: '',
  productType: '',
  destAddress: '', destCity: '', destCountry: '', destZip: '',
};

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  const positive = (val: string, key: keyof FormFields, label: string) => {
    if (!val) { errors[key] = `${label} es requerido`; return; }
    if (isNaN(Number(val)) || Number(val) <= 0) errors[key] = `${label} debe ser mayor a 0`;
  };

  positive(fields.weight, 'weight', 'El peso');
  positive(fields.width,  'width',  'El ancho');
  positive(fields.height, 'height', 'El alto');
  positive(fields.length, 'length', 'El largo');

  if (!fields.productType) errors.productType = 'Selecciona un tipo de producto';
  if (!fields.destAddress.trim()) errors.destAddress = 'La dirección es requerida';
  if (!fields.destCity.trim())    errors.destCity    = 'La ciudad es requerida';
  if (!fields.destCountry.trim()) errors.destCountry = 'El país es requerido';

  if (!fields.destZip.trim()) {
    errors.destZip = 'El código postal es requerido';
  } else if (!/^\d{4,10}$/.test(fields.destZip.trim())) {
    errors.destZip = 'Solo dígitos, entre 4 y 10 caracteres';
  }

  return errors;
}

export default function CreateShipmentForm({ token, onSuccess }: CreateShipmentFormProps) {
  const [fields, setFields] = useState<FormFields>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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

    const payload: CreateShipmentPayload = {
      weight:      Number(fields.weight),
      width:       Number(fields.width),
      height:      Number(fields.height),
      length:      Number(fields.length),
      productType: fields.productType as ProductType,
      destAddress: fields.destAddress.trim(),
      destCity:    fields.destCity.trim(),
      destCountry: fields.destCountry.trim(),
      destZip:     fields.destZip.trim(),
    };

    setLoading(true);
    try {
      await shipmentService.createShipment(token, payload);
      setFields(INITIAL);
      onSuccess();
    } catch {
      setServerError('No se pudo crear el envío. Verifica los datos e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}

      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Dimensiones y peso
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Peso" type="number" value={fields.weight}
            onChange={set('weight')} error={!!errors.weight} helperText={errors.weight}
            InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.productType}>
            <InputLabel>Tipo de producto</InputLabel>
            <Select value={fields.productType} label="Tipo de producto"
              onChange={(e) => setFields((p) => ({ ...p, productType: e.target.value as ProductType }))}>
              {PRODUCT_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
            {errors.productType && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.productType}
              </Typography>
            )}
          </FormControl>
        </Grid>
        {[
          { key: 'width'  as const, label: 'Ancho' },
          { key: 'height' as const, label: 'Alto' },
          { key: 'length' as const, label: 'Largo' },
        ].map(({ key, label }) => (
          <Grid item xs={12} sm={4} key={key}>
            <TextField fullWidth label={label} type="number" value={fields[key]}
              onChange={set(key)} error={!!errors[key]} helperText={errors[key]}
              InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment> }}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Destino
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12}>
          <TextField fullWidth label="Dirección" value={fields.destAddress}
            onChange={set('destAddress')} error={!!errors.destAddress} helperText={errors.destAddress}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Ciudad" value={fields.destCity}
            onChange={set('destCity')} error={!!errors.destCity} helperText={errors.destCity}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="País" value={fields.destCountry}
            onChange={set('destCountry')} error={!!errors.destCountry} helperText={errors.destCountry}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Código postal" value={fields.destZip}
            onChange={set('destZip')} error={!!errors.destZip} helperText={errors.destZip}
          />
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" size="large" fullWidth
        disabled={loading} sx={{ height: 48 }}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear envío'}
      </Button>
    </Box>
  );
}
