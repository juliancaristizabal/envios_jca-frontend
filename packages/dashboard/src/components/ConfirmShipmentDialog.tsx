import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import type { CreateShipmentPayload, ProductType } from '../types/shipment';

interface ConfirmShipmentDialogProps {
  open: boolean;
  payload: CreateShipmentPayload | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const PRODUCT_LABELS: Record<ProductType, string> = {
  electronica: 'Electrónica',
  ropa:        'Ropa',
  alimentos:   'Alimentos',
  documentos:  'Documentos',
  fragil:      'Frágil',
  peligroso:   'Peligroso',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box display="flex" justifyContent="space-between" py={0.75}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value}</Typography>
    </Box>
  );
}

export default function ConfirmShipmentDialog({
  open,
  payload,
  loading,
  onConfirm,
  onCancel,
}: ConfirmShipmentDialogProps) {
  if (!payload) return null;

  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Confirmar envío</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Revisa los datos antes de crear el envío. Una vez confirmado quedará registrado en el sistema.
        </Typography>

        <Divider sx={{ mb: 1 }} />

        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
          Paquete
        </Typography>
        <Row label="Peso"        value={`${payload.weight} kg`} />
        <Row label="Dimensiones" value={`${payload.width} × ${payload.height} × ${payload.length} cm`} />
        <Row label="Tipo"        value={PRODUCT_LABELS[payload.productType]} />

        <Divider sx={{ my: 1 }} />

        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
          Destino
        </Typography>
        <Row label="Dirección"      value={payload.destAddress} />
        <Row label="Ciudad"         value={payload.destCity} />
        <Row label="País"           value={payload.destCountry} />
        <Row label="Código postal"  value={payload.destZip} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onCancel} disabled={loading} color="inherit">
          Corregir
        </Button>
        <Button variant="contained" onClick={onConfirm} disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar y crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
