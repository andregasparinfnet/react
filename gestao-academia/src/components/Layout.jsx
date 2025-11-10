import React from 'react';
import { Outlet, Link } from 'react-router-dom';

// (Feature 3: Componente de Layout com navegação)
const Layout = () => {
  return (
    <div>
      {/* 1. Cabeçalho e Título Principal (movido do App.jsx) */}
      <header className="app-header">
        <h1>Gestão de Academia</h1>

        {/* 2. Menu de Navegação */}
        <nav>
          {/* 'Link' é o '<a>' do React Router */}
          <Link to="/">Home</Link>
          <Link to="/clientes">Gerenciar Clientes</Link>
          <Link to="/instrutores">Nossos Instrutores</Link>
        </nav>
      </header>

      <hr />

      {/* 3. Área de Conteúdo da Página */}
      <main>
        {/* 'Outlet' renderiza o componente da rota atual */}
        {/* (Ex: HomePage ou App) */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
