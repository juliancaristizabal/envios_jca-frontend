import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AuthService } from '../services/AuthService';

const mockUser = { id: 1, name: 'Juan', email: 'juan@test.com', createdAt: '2024-01-01T00:00:00.000Z' };

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
