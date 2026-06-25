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
  Person,
  Email,
  CalendarToday,
  Badge,
  Logout,
  LocalShipping,
  AddBox,
  AccountCircle,
} from '@mui/icons-material';
import ShipmentList from '../components/ShipmentList';
import CreateShipmentForm from '../components/CreateShipmentForm';
import type { User } from '../types';

interface DashboardPageProps {
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

export default function DashboardPage({ user, token, onLogout }: DashboardPageProps) {
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
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 22, fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={700}>
                ¡Bienvenido, {user.name.split(' ')[0]}!
              </Typography>
              <Chip label="Sesión activa" color="success" size="small" sx={{ mt: 0.5 }} />
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
            <Tab icon={<AccountCircle />} iconPosition="start" label="Mi perfil" />
            <Tab icon={<LocalShipping />} iconPosition="start" label="Mis envíos" />
            <Tab icon={<AddBox />} iconPosition="start" label="Nuevo envío" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Tab 0 — Perfil */}
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Información de la cuenta
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Badge color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">ID de usuario</Typography>
                      <Typography variant="body2" fontWeight={500}>#{user.id}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Person color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Nombre completo</Typography>
                      <Typography variant="body2" fontWeight={500} data-testid="user-full-name">
                        {user.name}
                      </Typography>
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
                <Typography variant="h6" fontWeight={600} mb={2}>Resumen</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Tu cuenta está activa y conectada correctamente al sistema de Envios JCA.
                </Typography>
                <Box mt={2}>
                  <Chip label="JWT verificado" color="primary" size="small" variant="outlined" sx={{ mr: 1 }} />
                  <Chip label="Sesión segura" color="success" size="small" variant="outlined" />
                </Box>
              </Grid>
            </Grid>
          )}

          {/* Tab 1 — Mis envíos */}
          {tab === 1 && <ShipmentList token={token} />}

          {/* Tab 2 — Nuevo envío */}
          {tab === 2 && (
            <CreateShipmentForm
              token={token}
              onSuccess={() => setTab(1)}
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
