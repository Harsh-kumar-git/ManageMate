import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for authenticated content
 * @param children - Protected component tree
 * @returns 
 *   - Children if authenticated
 *   - Redirect to login if not authenticated
 *   - Loading state during auth check
 * 
 * Usage:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
