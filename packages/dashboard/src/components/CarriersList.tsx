import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Refresh, PersonAddAlt1, Close } from '@mui/icons-material';
import { adminService } from '../services/AdminService';
import CreateCarrierForm from './CreateCarrierForm';
import type { Carrier } from '../types/admin';

interface CarriersListProps {
  token: string;
}

const VEHICLE_LABELS: Record<string, string> = {
  moto:   'Moto',
  van:    'Van',
  camion: 'Camión',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function CarriersList({ token }: CarriersListProps) {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAllCarriers(token);
      setCarriers(data);
    } catch {
      setError('No se pudieron cargar los transportistas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleCreated = () => {
    setDialogOpen(false);
    load();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
          {carriers.length} transportista{carriers.length !== 1 ? 's' : ''} registrado{carriers.length !== 1 ? 's' : ''}
        </Typography>
        <Box display="flex" gap={1}>
          <Tooltip title="Actualizar lista">
            <IconButton onClick={load} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            size="small"
            startIcon={<PersonAddAlt1 />}
            onClick={() => setDialogOpen(true)}
          >
            Registrar transportista
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" action={<Button size="small" onClick={load}>Reintentar</Button>}>
          {error}
        </Alert>
      )}

      {!loading && !error && carriers.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography color="text.secondary" mb={2}>
            No hay transportistas registrados.
          </Typography>
          <Button variant="outlined" startIcon={<PersonAddAlt1 />} onClick={() => setDialogOpen(true)}>
            Registrar el primero
          </Button>
        </Box>
      )}

      {!loading && !error && carriers.length > 0 && (
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell><strong>#ID</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Teléfono</strong></TableCell>
                <TableCell><strong>Vehículo</strong></TableCell>
                <TableCell><strong>Capacidad</strong></TableCell>
                <TableCell><strong>Disponibilidad</strong></TableCell>
                <TableCell><strong>Registro</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carriers.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>#{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={VEHICLE_LABELS[c.vehicleType] ?? c.vehicleType}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block">{c.capacityKg} kg</Typography>
                    <Typography variant="caption" color="text.secondary">{c.capacityM3} m³</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.isAvailable ? 'Disponible' : 'Ocupado'}
                      color={c.isAvailable ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(c.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Registrar transportista
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <CreateCarrierForm token={token} onSuccess={handleCreated} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
