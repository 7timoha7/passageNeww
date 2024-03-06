import React from 'react';
import { Navigate } from 'react-router-dom';

interface GoogleProtectedRouteProps extends React.PropsWithChildren {
  google: boolean | null;
}

const GoogleProtectedRoute: React.FC<GoogleProtectedRouteProps> = ({ google, children }) => {
  if (!google) {
    return <Navigate to="/google" />;
  }

  return children as React.ReactElement;
};

export default GoogleProtectedRoute;
