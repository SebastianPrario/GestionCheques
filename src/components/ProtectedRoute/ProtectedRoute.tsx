// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
 console.log(isAuthenticated)
  // if (isAuthenticated) {
  //   // Redirige al usuario a la página de inicio de sesión si no está autenticado
  //   return <Navigate to="/" replace />;
  // }

  // Renderiza el contenido de la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;