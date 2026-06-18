import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../components/RegisterForm';
import type { IAuthService } from '../services/interfaces/IAuthService';

const mockUser = { id: 2, name: 'Ana García', email: 'ana@test.com', createdAt: '2024-01-01' };

function buildMockService(overrides: Partial<IAuthService> = {}): IAuthService {
  return {
    login: jest.fn(),
    register: jest.fn().mockResolvedValue({ message: 'ok', data: mockUser }),
    ...overrides,
  };
}

describe('RegisterForm', () => {
  it('renders all fields and submit button', () => {
    render(
      <RegisterForm
        authService={buildMockService()}
        onSuccess={jest.fn()}
        onSwitchToLogin={jest.fn()}
      />
    );
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('shows error when name is too short', async () => {
    const user = userEvent.setup();
    render(
      <RegisterForm authService={buildMockService()} onSuccess={jest.fn()} onSwitchToLogin={jest.fn()} />
    );
    await user.type(screen.getByTestId('name-input'), 'A');
    await user.click(screen.getByTestId('submit-button'));
    expect(await screen.findByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument();
  });

  it('shows error when password has fewer than 8 characters', async () => {
    const user = userEvent.setup();
    render(
      <RegisterForm authService={buildMockService()} onSuccess={jest.fn()} onSwitchToLogin={jest.fn()} />
    );
    await user.type(screen.getByTestId('name-input'), 'Ana García');
    await user.type(screen.getByTestId('email-input'), 'ana@test.com');
    await user.type(screen.getByTestId('password-input'), 'short');
    await user.click(screen.getByTestId('submit-button'));
    expect(await screen.findByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
  });

  it('calls authService.register with trimmed name and correct data', async () => {
    const user = userEvent.setup();
    const mockService = buildMockService();
    render(
      <RegisterForm authService={mockService} onSuccess={jest.fn()} onSwitchToLogin={jest.fn()} />
    );
    await user.type(screen.getByTestId('name-input'), '  Ana García  ');
    await user.type(screen.getByTestId('email-input'), 'ana@test.com');
    await user.type(screen.getByTestId('password-input'), 'secure123');
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockService.register).toHaveBeenCalledWith({
        name: 'Ana García',
        email: 'ana@test.com',
        password: 'secure123',
      });
    });
  });

  it('calls onSuccess after successful registration', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    render(
      <RegisterForm authService={buildMockService()} onSuccess={onSuccess} onSwitchToLogin={jest.fn()} />
    );
    await user.type(screen.getByTestId('name-input'), 'Ana García');
    await user.type(screen.getByTestId('email-input'), 'ana@test.com');
    await user.type(screen.getByTestId('password-input'), 'secure123');
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('shows server error when email is already registered', async () => {
    const user = userEvent.setup();
    const failingService = buildMockService({
      register: jest.fn().mockRejectedValue({
        response: { data: { error: 'El correo ya está registrado' } },
      }),
    });
    render(
      <RegisterForm authService={failingService} onSuccess={jest.fn()} onSwitchToLogin={jest.fn()} />
    );
    await user.type(screen.getByTestId('name-input'), 'Ana García');
    await user.type(screen.getByTestId('email-input'), 'existing@test.com');
    await user.type(screen.getByTestId('password-input'), 'secure123');
    await user.click(screen.getByTestId('submit-button'));

    expect(await screen.findByTestId('server-error')).toHaveTextContent('El correo ya está registrado');
  });

  it('switches to login view when login link is clicked', async () => {
    const user = userEvent.setup();
    const onSwitch = jest.fn();
    render(
      <RegisterForm authService={buildMockService()} onSuccess={jest.fn()} onSwitchToLogin={onSwitch} />
    );
    await user.click(screen.getByText('Iniciar sesión'));
    expect(onSwitch).toHaveBeenCalledTimes(1);
  });
});
