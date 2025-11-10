// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// (Feature 3: Implementar rotas privadas)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Se não estiver logado, redireciona para /login
    // 'replace' substitui a entrada no histórico (o usuário não pode "voltar" para cá)
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza o componente "filho" (a página)
  return children;
};

export default ProtectedRoute;
