import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Divider,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  AdminPanelSettings,
  Person,
  Email,
  CalendarToday,
  Logout,
  LocalShipping,
  Dashboard,
} from '@mui/icons-material';
import AllShipmentsList from '../components/AllShipmentsList';
import type { User } from '../types';

interface AdminPageProps {
  user: User | null;
  token: string | null;
  onLogout: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AdminPage({ user, token, onLogout }: AdminPageProps) {
  const [tab, setTab] = useState(0);

  if (!user || !token) return null;

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Encabezado */}
      <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'secondary.main', fontSize: 22, fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={700}>
                Panel de administración
              </Typography>
              <Chip
                icon={<AdminPanelSettings fontSize="small" />}
                label="Administrador"
                color="secondary"
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
            <Button variant="outlined" color="error" startIcon={<Logout />} onClick={onLogout} size="small">
              Cerrar sesión
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
            <Tab icon={<Dashboard />} iconPosition="start" label="Panel" />
            <Tab icon={<LocalShipping />} iconPosition="start" label="Gestión de envíos" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Tab 0 — Perfil */}
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Información del administrador
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <AdminPanelSettings color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">ID</Typography>
                      <Typography variant="body2" fontWeight={500}>#{user.id}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Person color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Nombre</Typography>
                      <Typography variant="body2" fontWeight={500}>{user.name}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Email color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Correo electrónico</Typography>
                      <Typography variant="body2" fontWeight={500}>{user.email}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <CalendarToday color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Miembro desde</Typography>
                      <Typography variant="body2" fontWeight={500}>{formatDate(user.createdAt)}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Capacidades de administración
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Tienes acceso completo al sistema de Envios JCA.
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  <Chip label="Ver todos los envíos" color="secondary" size="small" variant="outlined" />
                  <Chip label="Asignar transportistas" color="secondary" size="small" variant="outlined" />
                  <Chip label="Gestionar rutas" color="secondary" size="small" variant="outlined" />
                </Box>
              </Grid>
            </Grid>
          )}

          {/* Tab 1 — Gestión de envíos */}
          {tab === 1 && <AllShipmentsList token={token} />}
        </CardContent>
      </Card>
    </Container>
  );
}
