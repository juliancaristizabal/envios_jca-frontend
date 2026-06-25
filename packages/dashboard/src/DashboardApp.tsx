import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import type { DashboardAppProps } from './types';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

export default function DashboardApp({ user, token, onLogout, role }: DashboardAppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {role === 'admin'
        ? <AdminPage user={user} onLogout={onLogout} />
        : <DashboardPage user={user} token={token} onLogout={onLogout} />
      }
    </ThemeProvider>
  );
}
