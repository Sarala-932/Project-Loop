import { Navigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};
