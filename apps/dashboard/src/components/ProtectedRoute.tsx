import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { hasMinRole, type UserRole } from '@kore/types';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';

interface ProtectedRouteProps {
  /** Erlaubte Rollen (exakt) */
  allowedRoles?: UserRole[];
  /** Mindestrolle (hierarchisch) */
  minRole?: UserRole;
}

export function ProtectedRoute({ allowedRoles, minRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-kore-bg">
        <p className="font-body text-kore-mid">Laden...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Rollenprüfung
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <AccessDeniedPage />;
  }

  if (minRole && !hasMinRole(user.role, minRole)) {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
}
