interface AuthAppProps {
  onLoginSuccess: (token: string, user: { id: number; name: string; email: string; createdAt: string }) => void;
  onRegisterSuccess: () => void;
  defaultView?: 'login' | 'register';
}

export default function AuthApp({ defaultView, onLoginSuccess, onRegisterSuccess }: AuthAppProps) {
  return (
    <div data-testid="mock-auth-app" data-view={defaultView}>
      <button
        onClick={() =>
          onLoginSuccess('mock-token', {
            id: 1,
            name: 'Test User',
            email: 'test@test.com',
            createdAt: '2024-01-01',
          })
        }
      >
        Mock Login
      </button>
      <button onClick={onRegisterSuccess}>Mock Register</button>
    </div>
  );
}
