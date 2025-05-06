// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  // Agar login hai to page dikhao, warna login pe bhejo
  return user ? children : <Navigate to="/Login" replace />;
};

export default ProtectedRoute;
