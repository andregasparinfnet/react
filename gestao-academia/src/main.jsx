import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // 1. Imports do Router

import App from './App.jsx'
import './index.css'
import { ClienteProvider } from './context/ClienteContext.js'

// 1. Imports do React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Nossos componentes de Rota
import Layout from './components/Layout.jsx';
import InstrutoresPage from './pages/InstrutoresPage.jsx';

// (Vamos criar esta página simples no próximo passo)
const HomePage = () => <h2>Bem-vindo ao Sistema!</h2>;

// 2. Crie uma instância do QueryClient
const queryClient = new QueryClient();

// 3. (Feature 3: Configurar rotas básicas)
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'clientes', element: <App /> },
      { path: 'instrutores', element: <InstrutoresPage /> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Envolva sua aplicação com o Provider do React Query */}
    <QueryClientProvider client={queryClient}>
      <ClienteProvider>
        <RouterProvider router={router} />
      </ClienteProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
