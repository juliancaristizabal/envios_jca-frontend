import { Suspense, lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';
import type { DashboardAppProps } from 'dashboard/DashboardApp';

const RemoteDashboardApp = lazy(() => import('dashboard/DashboardApp'));

const Loader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress />
  </Box>
);

export default function DashboardApp(props: DashboardAppProps) {
  return (
    <ErrorBoundary fallbackMessage="No se pudo cargar el dashboard.">
      <Suspense fallback={<Loader />}>
        <RemoteDashboardApp {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
