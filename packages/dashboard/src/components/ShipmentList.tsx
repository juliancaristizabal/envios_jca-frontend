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
} from '@mui/material';
import { Refresh, EditNote } from '@mui/icons-material';
import { shipmentService } from '../services/ShipmentService';
import UpdateStatusDialog from './UpdateStatusDialog';
import type { Shipment, ShipmentStatus, UpdateStatusPayload } from '../types/shipment';

interface ShipmentListProps {
  token: string;
}

const STATUS_CONFIG: Record<ShipmentStatus, { label: string; color: 'warning' | 'info' | 'primary' | 'success' | 'error' }> = {
  pending:    { label: 'En espera',   color: 'warning' },
  assigned:   { label: 'Asignado',    color: 'info' },
  in_transit: { label: 'En tránsito', color: 'primary' },
  delivered:  { label: 'Entregado',   color: 'success' },
  cancelled:  { label: 'Cancelado',   color: 'error' },
};

const PRODUCT_LABELS: Record<string, string> = {
  electronica: 'Electrónica',
  ropa:        'Ropa',
  alimentos:   'Alimentos',
  documentos:  'Documentos',
  fragil:      'Frágil',
  peligroso:   'Peligroso',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ShipmentList({ token }: ShipmentListProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogShipmentId, setDialogShipmentId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await shipmentService.getMyShipments(token);
      setShipments(data);
    } catch {
      setError('No se pudieron cargar los envíos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleUpdateStatus = async (id: number, payload: UpdateStatusPayload) => {
    await shipmentService.updateStatus(token, id, payload);
    await load();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={<Button size="small" onClick={load}>Reintentar</Button>}
      >
        {error}
      </Alert>
    );
  }

  if (shipments.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography color="text.secondary" mb={2}>
          Aún no tienes envíos registrados.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Tooltip title="Actualizar lista">
          <IconButton onClick={load} size="small">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell><strong>#ID</strong></TableCell>
              <TableCell><strong>Ciudad destino</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Peso (kg)</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((s) => {
              const cfg = STATUS_CONFIG[s.status];
              const canUpdate = s.status === 'assigned' || s.status === 'in_transit';
              return (
                <TableRow key={s.id} hover>
                  <TableCell>#{s.id}</TableCell>
                  <TableCell>{s.destCity}</TableCell>
                  <TableCell>{PRODUCT_LABELS[s.productType] ?? s.productType}</TableCell>
                  <TableCell>{s.weight}</TableCell>
                  <TableCell>
                    <Chip label={cfg.label} color={cfg.color} size="small" />
                  </TableCell>
                  <TableCell>{formatDate(s.createdAt)}</TableCell>
                  <TableCell align="center">
                    {canUpdate && (
                      <Tooltip title="Actualizar estado">
                        <IconButton size="small" onClick={() => setDialogShipmentId(s.id)}>
                          <EditNote fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {dialogShipmentId !== null && (
        <UpdateStatusDialog
          shipmentId={dialogShipmentId}
          open={true}
          onClose={() => setDialogShipmentId(null)}
          onConfirm={handleUpdateStatus}
        />
      )}
    </Box>
  );
}
