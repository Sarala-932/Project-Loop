import { Navigate, useLocation } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuth();
  

  if (isCheckingAuth) return null; // Wait for auth check to finish

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role || 'VIEWER';
    if (!allowedRoles.includes(userRole)) {
      // User is logged in but unauthorized for this route
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

