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
import {
  Person,
  Email,
  CalendarToday,
  Badge,
  Logout,
} from '@mui/icons-material';
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
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    ¡Bienvenido, {user.name.split(' ')[0]}!
                  </Typography>
                  <Chip label="Sesión activa" color="success" size="small" />
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
                Información de la cuenta
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Badge color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      ID de usuario
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      #{user.id}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Person color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Nombre completo
                    </Typography>
                    <Typography variant="body2" fontWeight={500} data-testid="user-full-name">
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
                Resumen
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Tu cuenta está activa y conectada correctamente al sistema de Envios JCA.
              </Typography>
              <Box mt={2}>
                <Chip label="JWT verificado" color="primary" size="small" variant="outlined" sx={{ mr: 1 }} />
                <Chip label="Sesión segura" color="success" size="small" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
