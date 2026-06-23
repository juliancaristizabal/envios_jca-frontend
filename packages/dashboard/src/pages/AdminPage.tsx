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
} from '@mui/material';
import { AdminPanelSettings, Person, Email, CalendarToday, Logout } from '@mui/icons-material';
import type { User } from '../types';

interface AdminPageProps {
  user: User | null;
  onLogout: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AdminPage({ user, onLogout }: AdminPageProps) {
  if (!user) return null;

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2, borderLeft: 4, borderColor: 'secondary.main' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'secondary.main',
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Panel de Administración
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      icon={<AdminPanelSettings fontSize="small" />}
                      label="Administrador"
                      color="secondary"
                      size="small"
                    />
                    <Chip label="Sesión activa" color="success" size="small" />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Logout />}
                  onClick={onLogout}
                  size="small"
                >
                  Cerrar sesión
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Información del administrador
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Person color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Nombre
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {user.name}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Email color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Correo electrónico
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <CalendarToday color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Miembro desde
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Módulos disponibles
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Chip label="Gestión de transportistas" variant="outlined" color="secondary" size="small" />
                <Chip label="Rutas logísticas" variant="outlined" color="secondary" size="small" />
                <Chip label="Todos los envíos" variant="outlined" color="secondary" size="small" />
                <Chip label="Seguimiento en tiempo real" variant="outlined" color="secondary" size="small" />
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                Próximamente disponibles en este panel.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
