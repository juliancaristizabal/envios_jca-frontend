import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AuthService } from '../services/AuthService';

const mockUser = { id: 1, name: 'Juan', email: 'juan@test.com', role: 'user' as const, createdAt: '2024-01-01T00:00:00.000Z' };
const mockAdmin = { id: 2, name: 'Admin', email: 'admin@test.com', role: 'admin' as const, createdAt: '2024-01-01T00:00:00.000Z' };

describe('AuthService', () => {
  let mock: MockAdapter;
  let service: AuthService;

  beforeEach(() => {
    const instance = axios.create({ baseURL: 'http://localhost:3001' });
    mock = new MockAdapter(instance);
    service = new AuthService(instance);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('login', () => {
    it('returns token and user on success', async () => {
      mock.onPost('/login').reply(200, {
        message: 'Inicio de sesión exitoso',
        data: { token: 'jwt-token', user: mockUser },
      });

      const result = await service.login({ email: 'juan@test.com', password: 'password123' });

      expect(result.data.token).toBe('jwt-token');
      expect(result.data.user).toEqual(mockUser);
    });

    it('throws on 401 invalid credentials', async () => {
      mock.onPost('/login').reply(401, { error: 'Credenciales inválidas' });

      await expect(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });

  describe('adminLogin', () => {
    it('retorna token y admin en login exitoso', async () => {
      mock.onPost('/admin/login').reply(200, {
        message: 'Inicio de sesión exitoso',
        data: { token: 'jwt-admin', admin: mockAdmin },
      });

      const result = await service.adminLogin({ email: 'admin@test.com', password: 'password123' });

      expect(result.data.token).toBe('jwt-admin');
      expect(result.data.admin).toEqual(mockAdmin);
    });

    it('lanza error 401 con credenciales inválidas', async () => {
      mock.onPost('/admin/login').reply(401, { error: 'Credenciales inválidas' });

      await expect(service.adminLogin({ email: 'a@b.com', password: 'wrong' })).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });

  describe('loginAny', () => {
    it('retorna role user cuando el login de usuario tiene éxito', async () => {
      mock.onPost('/login').reply(200, {
        message: 'Inicio de sesión exitoso',
        data: { token: 'jwt-user', user: mockUser },
      });

      const result = await service.loginAny({ email: 'juan@test.com', password: 'password123' });

      expect(result.role).toBe('user');
      expect(result.token).toBe('jwt-user');
      expect(result.user).toEqual(mockUser);
    });

    it('intenta admin/login cuando el usuario recibe 401 y retorna role admin', async () => {
      mock.onPost('/login').reply(401, { error: 'Credenciales inválidas' });
      mock.onPost('/admin/login').reply(200, {
        message: 'Inicio de sesión exitoso',
        data: { token: 'jwt-admin', admin: mockAdmin },
      });

      const result = await service.loginAny({ email: 'admin@test.com', password: 'password123' });

      expect(result.role).toBe('admin');
      expect(result.token).toBe('jwt-admin');
      expect(result.user).toEqual(mockAdmin);
    });

    it('lanza el error original si /login falla con un código distinto a 401', async () => {
      mock.onPost('/login').reply(500, { error: 'Error interno' });

      await expect(
        service.loginAny({ email: 'a@b.com', password: 'pass' })
      ).rejects.toMatchObject({ response: { status: 500 } });
    });

    it('lanza error si ambos endpoints fallan', async () => {
      mock.onPost('/login').reply(401, { error: 'No encontrado' });
      mock.onPost('/admin/login').reply(401, { error: 'Credenciales inválidas' });

      await expect(
        service.loginAny({ email: 'nobody@test.com', password: 'wrong' })
      ).rejects.toMatchObject({ response: { status: 401 } });
    });
  });

  describe('register', () => {
    it('returns new user data on success', async () => {
      mock.onPost('/register').reply(201, {
        message: 'Usuario registrado exitosamente',
        data: mockUser,
      });

      const result = await service.register({ name: 'Juan', email: 'juan@test.com', password: 'pass1234' });

      expect(result.data).toEqual(mockUser);
    });

    it('throws on 409 when email already exists', async () => {
      mock.onPost('/register').reply(409, { error: 'El correo ya está registrado' });

      await expect(
        service.register({ name: 'Juan', email: 'existing@test.com', password: 'pass1234' })
      ).rejects.toMatchObject({ response: { status: 409 } });
    });
  });
});
