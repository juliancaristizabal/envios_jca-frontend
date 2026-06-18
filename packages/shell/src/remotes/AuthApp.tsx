import { Suspense, lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';
import type { AuthAppProps } from 'auth/AuthApp';

const RemoteAuthApp = lazy(() => import('auth/AuthApp'));

const Loader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress />
  </Box>
);

export default function AuthApp(props: AuthAppProps) {
  return (
    <ErrorBoundary fallbackMessage="No se pudo cargar el módulo de autenticación.">
      <Suspense fallback={<Loader />}>
        <RemoteAuthApp {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
