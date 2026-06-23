import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';

const TOKEN_KEY = 'jca_token';
const USER_KEY = 'jca_user';

function loadPersistedAuth(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (token && raw) {
      const user = JSON.parse(raw) as User;
      return { token, user, role: user.role ?? null, isAuthenticated: true };
    }
  } catch {
    // corrupted storage — reset below
  }
  return { token: null, user: null, role: null, isAuthenticated: false };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadPersistedAuth(),
  reducers: {
    setCredentials(state, { payload }: PayloadAction<{ token: string; user: User; role: 'user' | 'admin' }>) {
      state.token = payload.token;
      state.user = payload.user;
      state.role = payload.role;
      state.isAuthenticated = true;
      localStorage.setItem(TOKEN_KEY, payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectRole = (state: { auth: AuthState }) => state.auth.role;
