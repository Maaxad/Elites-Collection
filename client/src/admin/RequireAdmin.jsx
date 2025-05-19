import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/admin-89xYz-Q4/signin" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'admin') {
      return <Navigate to="/admin-89xYz-Q4/signin" />;
    }
    return children;
  } catch (err) {
    return <Navigate to="/admin-89xYz-Q4/signin" />;
  }
};

export default RequireAdmin;
