import { createRoot } from 'react-dom/client';
import DashboardApp from './DashboardApp';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

createRoot(container).render(
  <DashboardApp
    user={{ id: 1, name: 'Dev User', email: 'dev@test.com', createdAt: new Date().toISOString() }}
    onLogout={() => console.log('logout')}
  />
);
