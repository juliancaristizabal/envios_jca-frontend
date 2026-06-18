import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import DashboardPage from './pages/DashboardPage';
import type { DashboardAppProps } from './types';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

export default function DashboardApp({ user, onLogout }: DashboardAppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardPage user={user} onLogout={onLogout} />
    </ThemeProvider>
  );
}
