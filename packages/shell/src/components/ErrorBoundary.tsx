import { Component, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="200px"
          gap={2}
        >
          <Typography color="error">
            {this.props.fallbackMessage ?? 'Error al cargar el módulo.'}
          </Typography>
          <Button variant="outlined" onClick={() => this.setState({ hasError: false })}>
            Reintentar
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
