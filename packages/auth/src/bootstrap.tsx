import { createRoot } from 'react-dom/client';
import AuthApp from './AuthApp';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

createRoot(container).render(
  <AuthApp
    onLoginSuccess={(token, user) => console.log('Login:', { token, user })}
    onRegisterSuccess={() => console.log('Register success')}
    defaultView="login"
  />
);
