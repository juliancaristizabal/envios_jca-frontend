import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import { store } from './store';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Navbar />
          <Box component="main" flexGrow={1}>
            <AppRouter />
          </Box>
        </Box>
      </BrowserRouter>
    </Provider>
  );
}
