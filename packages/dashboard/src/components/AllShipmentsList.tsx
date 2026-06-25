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
  Stack,
} from '@mui/material';
import { Refresh, AssignmentInd } from '@mui/icons-material';
import { adminService } from '../services/AdminService';
import AssignShipmentDialog from './AssignShipmentDialog';
import type { Shipment, ShipmentStatus } from '../types/shipment';

interface AllShipmentsListProps {
  token: string;
}

const STATUS_CONFIG: Record<ShipmentStatus, { label: string; color: 'warning' | 'info' | 'primary' | 'success' | 'error' }> = {
  pending:    { label: 'En espera',   color: 'warning' },
  assigned:   { label: 'Asignado',    color: 'info' },
  in_transit: { label: 'En tránsito', color: 'primary' },
  delivered:  { label: 'Entregado',   color: 'success' },
  cancelled:  { label: 'Cancelado',   color: 'error' },
};

const FILTER_OPTIONS: { value: ShipmentStatus | 'all'; label: string }[] = [
  { value: 'all',        label: 'Todos' },
  { value: 'pending',    label: 'En espera' },
  { value: 'assigned',   label: 'Asignado' },
  { value: 'in_transit', label: 'En tránsito' },
  { value: 'delivered',  label: 'Entregado' },
  { value: 'cancelled',  label: 'Cancelado' },
];

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

export default function AllShipmentsList({ token }: AllShipmentsListProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [activeFilter, setActiveFilter] = useState<ShipmentStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningId, setAssigningId] = useState<number | null>(null);

  const load = useCallback(async (filter: ShipmentStatus | 'all') => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAllShipments(token, filter === 'all' ? undefined : filter);
      setShipments(data);
    } catch {
      setError('No se pudieron cargar los envíos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(activeFilter); }, [load, activeFilter]);

  const handleFilterChange = (filter: ShipmentStatus | 'all') => {
    setActiveFilter(filter);
  };

  const handleRefresh = () => load(activeFilter);

  return (
    <Box>
      {/* Barra de filtros */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} flexWrap="wrap" gap={1}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilter === opt.value;
            const chipColor = opt.value === 'all'
              ? undefined
              : STATUS_CONFIG[opt.value as ShipmentStatus].color;

            return (
              <Chip
                key={opt.value}
                label={opt.label}
                size="small"
                color={isActive && opt.value !== 'all' ? chipColor : isActive ? 'default' : 'default'}
                variant={isActive ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange(opt.value)}
                sx={{ cursor: 'pointer', fontWeight: isActive ? 600 : 400 }}
              />
            );
          })}
        </Stack>
        <Tooltip title="Actualizar lista">
          <IconButton onClick={handleRefresh} size="small">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Estado de carga / error / vacío */}
      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" action={<Button size="small" onClick={handleRefresh}>Reintentar</Button>}>
          {error}
        </Alert>
      )}

      {!loading && !error && shipments.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography color="text.secondary">
            {activeFilter === 'all'
              ? 'No hay envíos registrados en el sistema.'
              : `No hay envíos con estado "${FILTER_OPTIONS.find((o) => o.value === activeFilter)?.label}".`}
          </Typography>
        </Box>
      )}

      {/* Tabla */}
      {!loading && !error && shipments.length > 0 && (
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell><strong>#ID</strong></TableCell>
                <TableCell><strong>Usuario</strong></TableCell>
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
                return (
                  <TableRow key={s.id} hover>
                    <TableCell>#{s.id}</TableCell>
                    <TableCell>#{s.userId}</TableCell>
                    <TableCell>{s.destCity}</TableCell>
                    <TableCell>{PRODUCT_LABELS[s.productType] ?? s.productType}</TableCell>
                    <TableCell>{s.weight}</TableCell>
                    <TableCell>
                      <Chip label={cfg.label} color={cfg.color} size="small" />
                    </TableCell>
                    <TableCell>{formatDate(s.createdAt)}</TableCell>
                    <TableCell align="center">
                      {s.status === 'pending' && (
                        <Tooltip title="Asignar transportista y ruta">
                          <IconButton size="small" color="primary" onClick={() => setAssigningId(s.id)}>
                            <AssignmentInd fontSize="small" />
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
      )}

      <AssignShipmentDialog
        open={assigningId !== null}
        shipmentId={assigningId}
        token={token}
        onClose={() => setAssigningId(null)}
        onAssigned={() => { setAssigningId(null); load(activeFilter); }}
      />
    </Box>
  );
}
