// src/Auth.integration.test.jsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, describe, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Vamos usar o createMemoryRouter para simular a navegação
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

// 2. Importamos TODOS os nossos componentes reais de estrutura e provedores
import { AuthProvider } from './context/AuthContext';
import { ClienteProvider } from './context/ClienteContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import App from './App';
import Layout from './components/Layout';
import InstrutoresPage from './pages/InstrutoresPage';

// --- Configuração (Setup) ---

// Helper para criar um QueryClient limpo para cada teste
const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// Helper para definir as rotas (copiado do seu main.jsx)
const HomePage = () => <h2>Bem-vindo ao Sistema!</h2>;

const testRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'clientes',
        element: (<ProtectedRoute><App /></ProtectedRoute>),
      },
      {
        path: 'instrutores',
        element: (<ProtectedRoute><InstrutoresPage /></ProtectedRoute>),
      },
    ],
  },
];

// Helper principal: Renderiza a App completa com todos os provedores
// e um MemoryRouter que começa na rota que especificarmos.
const renderApp = (initialRoute = '/') => {
  const queryClient = createTestQueryClient();
  const router = createMemoryRouter(testRoutes, {
    initialEntries: [initialRoute],
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClienteProvider>
          <RouterProvider router={router} />
        </ClienteProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// --- Os Testes ---

describe('Fluxo de Autenticação (Integração)', () => {

  test('mostra "Login" e esconde links protegidos quando deslogado (na Home)', async () => {
    renderApp('/');

    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: /Gerenciar Clientes/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Nossos Instrutores/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
  });

  test('redireciona de uma rota protegida (/clientes) para /login se deslogado', async () => {
    renderApp('/clientes');

    expect(await screen.findByText('Acesso Restrito')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar \(Simulado\)/i })).toBeInTheDocument();
  });

  test('permite o login, redireciona, mostra links protegidos e botão Logout', async () => {
    const user = userEvent.setup();
    renderApp('/login');

    await user.click(screen.getByRole('button', { name: /Entrar \(Simulado\)/i }));

    expect(await screen.findByText('Ana Mock')).toBeInTheDocument();
    expect(await screen.findByText('Clientes Cadastrados')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Gerenciar Clientes/i })).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: /Login/i })).not.toBeInTheDocument();
  });

  test('permite o logout e esconde links protegidos', async () => {
    const user = userEvent.setup();
    renderApp('/login');
    await user.click(screen.getByRole('button', { name: /Entrar \(Simulado\)/i }));

    const logoutButton = await screen.findByRole('button', { name: /Logout/i });

  await user.click(logoutButton);

  // After logout we should see the Login button again and no protected links
  expect(await screen.findByRole('button', { name: /Login/i })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Gerenciar Clientes/i })).not.toBeInTheDocument();
  });

});
