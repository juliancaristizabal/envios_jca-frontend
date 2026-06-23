import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, logout, selectIsAuthenticated, selectUser, selectRole } from '../store/slices/authSlice';
import AuthApp from '../remotes/AuthApp';
import DashboardApp from '../remotes/DashboardApp';
import ProtectedRoute from './ProtectedRoute';
import type { User } from '../types';

export default function AppRouter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const handleLoginSuccess = (token: string, user: User, role: 'user' | 'admin') => {
    dispatch(setCredentials({ token, user, role }));
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const homeRedirect = !isAuthenticated ? '/login' : role === 'admin' ? '/admin' : '/dashboard';
  const authRedirect = role === 'admin' ? '/admin' : '/dashboard';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={homeRedirect} replace />} />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={authRedirect} replace />
          ) : (
            <AuthApp
              key="login"
              onLoginSuccess={handleLoginSuccess}
              onRegisterSuccess={handleRegisterSuccess}
              defaultView="login"
            />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={authRedirect} replace />
          ) : (
            <AuthApp
              key="register"
              onLoginSuccess={handleLoginSuccess}
              onRegisterSuccess={handleRegisterSuccess}
              defaultView="register"
            />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <DashboardApp user={user} onLogout={handleLogout} role="user" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardApp user={user} onLogout={handleLogout} role="admin" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
