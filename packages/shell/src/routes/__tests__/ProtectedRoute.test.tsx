import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import ProtectedRoute from '../ProtectedRoute';

function buildStore(isAuthenticated: boolean) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated,
        user: isAuthenticated
          ? { id: 1, name: 'Test', email: 'test@test.com', createdAt: '' }
          : null,
        token: isAuthenticated ? 'token' : null,
      },
    },
  });
}

function renderWithRouter(isAuthenticated: boolean) {
  const store = buildStore(isAuthenticated);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Contenido protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    renderWithRouter(true);
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redirects to /login when user is not authenticated', () => {
    renderWithRouter(false);
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
