import { useState } from 'react';
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
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import type { UpdateStatusPayload } from '../types/shipment';

interface UpdateStatusDialogProps {
  shipmentId: number;
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number, payload: UpdateStatusPayload) => Promise<void>;
}

const STATUS_OPTIONS = [
  { value: 'in_transit', label: 'En tránsito' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
] as const;

export default function UpdateStatusDialog({
  shipmentId,
  open,
  onClose,
  onConfirm,
}: UpdateStatusDialogProps) {
  const [status, setStatus] = useState<UpdateStatusPayload['status']>('in_transit');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setError('');
    setLoading(true);
    try {
      await onConfirm(shipmentId, { status, notes: notes.trim() || undefined });
      setNotes('');
      setStatus('in_transit');
      onClose();
    } catch {
      setError('No se pudo actualizar el estado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setError('');
    setNotes('');
    setStatus('in_transit');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Actualizar estado del envío #{shipmentId}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <FormControl fullWidth>
          <InputLabel>Nuevo estado</InputLabel>
          <Select
            value={status}
            label="Nuevo estado"
            onChange={(e) => setStatus(e.target.value as UpdateStatusPayload['status'])}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Notas (opcional)"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          inputProps={{ maxLength: 500 }}
          helperText={`${notes.length}/500`}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
