import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Container, Button } from '@mui/material'; // 1. Importe Button
import { useAuth } from '../context/AuthContext'; // 1. Importe useAuth

// (Feature 3: Componente de Layout com navegação)
const Layout = () => {
  // 2. Puxe o estado e a função de logout
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // Para o logout e navegação

  const handleLogout = () => {
    logout();
    navigate('/'); // Redireciona para a Home após o logout
  };

  return (
    <div>
      {/* 1. Cabeçalho e Título Principal (movido do App.jsx) */}
      <header className="app-header">
        <h1>Gestão de Academia</h1>

        {/* 2. Menu de Navegação */}
        <nav>
          {/* 'Link' é o '<a>' do React Router */}
          <Link to="/">Home</Link>

          {/* 3. (Feature 3: Renderização Condicional da Navegação) */}
          {isAuthenticated && (
            <>
              <Link to="/clientes">Gerenciar Clientes</Link>
              <Link to="/instrutores">Nossos Instrutores</Link>
            </>
          )}
        </nav>

        {/* 4. (Feature 3: Renderização Condicional Login/Logout) */}
        {isAuthenticated ? (
          <Button color="inherit" onClick={handleLogout} variant="outlined">
            Logout
          </Button>
        ) : (
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')} 
            variant="outlined"
          >
            Login
          </Button>
        )}
      </header>

      <hr />

      {/* 2. Envolva o Outlet com o Container */}
      <main>
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default Layout;
