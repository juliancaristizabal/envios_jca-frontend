import authReducer, { setCredentials, logout } from '../authSlice';
import type { AuthState } from '../../../types';

const mockUser = { id: 1, name: 'Juan', email: 'juan@test.com', createdAt: '2024-01-01' };
const mockToken = 'eyJhbGciOiJIUzI1NiJ9.test.signature';

const emptyState: AuthState = { user: null, token: null, isAuthenticated: false };

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial state', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('setCredentials sets user, token and marks authenticated', () => {
    const state = authReducer(emptyState, setCredentials({ token: mockToken, user: mockUser }));
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe(mockToken);
    expect(state.user).toEqual(mockUser);
  });

  it('setCredentials persists token to localStorage', () => {
    authReducer(emptyState, setCredentials({ token: mockToken, user: mockUser }));
    expect(localStorage.getItem('jca_token')).toBe(mockToken);
  });

  it('logout clears state and localStorage', () => {
    const authenticated: AuthState = { user: mockUser, token: mockToken, isAuthenticated: true };
    localStorage.setItem('jca_token', mockToken);
    localStorage.setItem('jca_user', JSON.stringify(mockUser));

    const state = authReducer(authenticated, logout());

    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(localStorage.getItem('jca_token')).toBeNull();
    expect(localStorage.getItem('jca_user')).toBeNull();
  });
});
