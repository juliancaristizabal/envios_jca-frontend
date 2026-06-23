import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/LoginForm';
import type { IAuthService } from '../services/interfaces/IAuthService';

const mockUser = { id: 1, name: 'Juan', email: 'juan@test.com', role: 'user' as const, createdAt: '2024-01-01' };

function buildMockService(overrides: Partial<IAuthService> = {}): IAuthService {
  return {
    login: jest.fn().mockResolvedValue({ message: 'ok', data: { token: 'tok', user: mockUser } }),
    adminLogin: jest.fn(),
    loginAny: jest.fn().mockResolvedValue({ token: 'tok', user: mockUser, role: 'user' }),
    register: jest.fn(),
    ...overrides,
  } as IAuthService;
}

describe('LoginForm', () => {
  it('renders all fields and submit button', () => {
    render(
      <LoginForm
        authService={buildMockService()}
        onSuccess={jest.fn()}
        onSwitchToRegister={jest.fn()}
      />
    );
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('shows validation error when email is empty', async () => {
    const user = userEvent.setup();
    render(
      <LoginForm
        authService={buildMockService()}
        onSuccess={jest.fn()}
        onSwitchToRegister={jest.fn()}
      />
    );
    await user.click(screen.getByTestId('submit-button'));
    expect(await screen.findByText('El correo es requerido')).toBeInTheDocument();
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    render(
      <LoginForm
        authService={buildMockService()}
        onSuccess={jest.fn()}
        onSwitchToRegister={jest.fn()}
      />
    );
    await user.type(screen.getByTestId('email-input'), 'not-an-email');
    await user.click(screen.getByTestId('submit-button'));
    expect(await screen.findByText('Formato de correo inválido')).toBeInTheDocument();
  });

  it('shows validation error when password is empty', async () => {
    const user = userEvent.setup();
    render(
      <LoginForm
        authService={buildMockService()}
        onSuccess={jest.fn()}
        onSwitchToRegister={jest.fn()}
      />
    );
    await user.type(screen.getByTestId('email-input'), 'valid@email.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(await screen.findByText('La contraseña es requerida')).toBeInTheDocument();
  });

  it('calls authService.loginAny with correct credentials', async () => {
    const user = userEvent.setup();
    const mockService = buildMockService();
    render(
      <LoginForm authService={mockService} onSuccess={jest.fn()} onSwitchToRegister={jest.fn()} />
    );
    await user.type(screen.getByTestId('email-input'), 'juan@test.com');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockService.loginAny).toHaveBeenCalledWith({
        email: 'juan@test.com',
        password: 'password123',
      });
    });
  });

  it('calls onSuccess con token, user y role en login exitoso', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    render(
      <LoginForm authService={buildMockService()} onSuccess={onSuccess} onSwitchToRegister={jest.fn()} />
    );
    await user.type(screen.getByTestId('email-input'), 'juan@test.com');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('tok', mockUser, 'user');
    });
  });

  it('shows server error message on failed login', async () => {
    const user = userEvent.setup();
    const failingService = buildMockService({
      loginAny: jest.fn().mockRejectedValue({
        response: { data: { error: 'Credenciales inválidas' } },
      }),
    });
    render(
      <LoginForm authService={failingService} onSuccess={jest.fn()} onSwitchToRegister={jest.fn()} />
    );
    await user.type(screen.getByTestId('email-input'), 'juan@test.com');
    await user.type(screen.getByTestId('password-input'), 'wrongpassword');
    await user.click(screen.getByTestId('submit-button'));

    expect(await screen.findByTestId('server-error')).toHaveTextContent('Credenciales inválidas');
  });

  it('calls onSwitchToRegister when register link is clicked', async () => {
    const user = userEvent.setup();
    const onSwitch = jest.fn();
    render(
      <LoginForm authService={buildMockService()} onSuccess={jest.fn()} onSwitchToRegister={onSwitch} />
    );
    await user.click(screen.getByText('Regístrate'));
    expect(onSwitch).toHaveBeenCalledTimes(1);
  });
});
