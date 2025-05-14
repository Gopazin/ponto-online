
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = [] }) => {
  const { user, isInitialized } = useAuth();

  // If auth is still initializing, render nothing (or a loading spinner)
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If specific roles are required and user doesn't have one of them
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect employees to clock page
    if (user.role === 'employee') {
      return <Navigate to="/clock" replace />;
    } 
    // Redirect supervisors/admins to dashboard
    else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If all checks pass, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
