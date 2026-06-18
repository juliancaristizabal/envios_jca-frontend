interface DashboardAppProps {
  user: { id: number; name: string; email: string; createdAt: string } | null;
  onLogout: () => void;
}

export default function DashboardApp({ user, onLogout }: DashboardAppProps) {
  return (
    <div data-testid="mock-dashboard-app">
      <span data-testid="user-name">{user?.name}</span>
      <button onClick={onLogout}>Mock Logout</button>
    </div>
  );
}
