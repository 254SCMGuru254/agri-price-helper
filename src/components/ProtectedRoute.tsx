
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Card } from './ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAuth = true 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </Card>
      </div>
    );
  }

  // If route requires auth but user is not authenticated, redirect to auth page
  if (requiresAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated and trying to access auth page, redirect to dashboard
  if (!requiresAuth && user && location.pathname === '/auth') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
