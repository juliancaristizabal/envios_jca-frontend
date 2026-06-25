import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { adminService } from '../services/AdminService';
import type { Carrier, Route } from '../types/admin';
import type { HttpError } from '../services/http/FetchHttpClient';

interface AssignShipmentDialogProps {
  open: boolean;
  shipmentId: number | null;
  token: string;
  onClose: () => void;
  onAssigned: () => void;
}

const VEHICLE_LABELS: Record<string, string> = {
  moto:   'Moto',
  van:    'Van',
  camion: 'Camión',
};

export default function AssignShipmentDialog({
  open,
  shipmentId,
  token,
  onClose,
  onAssigned,
}: AssignShipmentDialogProps) {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [carrierId, setCarrierId] = useState<number | ''>('');
  const [routeId, setRouteId] = useState<number | ''>('');
  const [loadingData, setLoadingData] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!open) return;
    setCarrierId('');
    setRouteId('');
    setSubmitError('');
    setLoadError('');
    setLoadingData(true);
    Promise.all([
      adminService.getAvailableCarriers(token),
      adminService.getAllRoutes(token),
    ])
      .then(([c, r]) => { setCarriers(c); setRoutes(r); })
      .catch(() => setLoadError('No se pudieron cargar transportistas o rutas. Intenta de nuevo.'))
      .finally(() => setLoadingData(false));
  }, [open, token]);

  const handleConfirm = async () => {
    if (carrierId === '' || routeId === '' || !shipmentId) return;
    setSubmitError('');
    setSubmitting(true);
    try {
      await adminService.assignShipment(token, shipmentId, {
        carrierId: carrierId as number,
        routeId: routeId as number,
      });
      onAssigned();
    } catch (err) {
      const httpErr = err as HttpError;
      setSubmitError(httpErr?.message ?? 'No se pudo asignar el envío.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Asignar envío #{shipmentId}</DialogTitle>

      <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loadingData && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        )}

        {loadError && <Alert severity="error">{loadError}</Alert>}
        {submitError && <Alert severity="error">{submitError}</Alert>}

        {!loadingData && !loadError && (
          <>
            <FormControl fullWidth>
              <InputLabel>Transportista disponible</InputLabel>
              <Select
                value={carrierId}
                label="Transportista disponible"
                onChange={(e) => setCarrierId(e.target.value as number)}
              >
                {carriers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name} — {VEHICLE_LABELS[c.vehicleType] ?? c.vehicleType}
                    {' '}({c.capacityKg} kg / {c.capacityM3} m³)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Ruta</InputLabel>
              <Select
                value={routeId}
                label="Ruta"
                onChange={(e) => setRouteId(e.target.value as number)}
              >
                {routes.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name} — {r.originCity} → {r.destinationCity} ({r.estimatedDays}d)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {carriers.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay transportistas disponibles en este momento.
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={submitting} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={submitting || loadingData || !!loadError || carrierId === '' || routeId === ''}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : 'Asignar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
