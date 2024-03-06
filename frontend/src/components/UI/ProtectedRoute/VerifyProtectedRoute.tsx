import React from 'react';
import { Navigate } from 'react-router-dom';

interface VerifyProtectedRouteProps extends React.PropsWithChildren {
  isVerify: boolean | null;
}

const VerifyProtectedRoute: React.FC<VerifyProtectedRouteProps> = ({ isVerify, children }) => {
  if (!isVerify) {
    return <Navigate to="/verifyPage" />;
  }

  return children as React.ReactElement;
};

export default VerifyProtectedRoute;
