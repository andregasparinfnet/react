// src/App.integration.test.jsx

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, describe } from 'vitest';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';
import App from './App';

import { ClienteProvider } from './context/ClienteContext';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// 2. Criação de um QueryClient de teste
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

// 3. Helper para renderizar a App com todos os provedores
const renderApp = (queryClient) => {
  return render(
    <MemoryRouter initialEntries={["/clientes"]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ClienteProvider>
            <App />
          </ClienteProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe('Fluxo CRUD Completo (Integração)', () => {
  test('deve criar um novo cliente e exibi-lo na tabela', async () => {
    const user = userEvent.setup();
    const testQueryClient = createTestQueryClient();
    renderApp(testQueryClient);

    // 1. A tabela inicia com o cliente do MSW
    expect(await screen.findByText('Ana Mock')).toBeInTheDocument();

    // 2. Simula criação
    await user.type(screen.getByLabelText(/Nome/i), 'Cliente Novo');
    // Open plano select (MUI) and choose Pilates
    await user.click(screen.getByLabelText(/Plano/i));
    await user.click(await screen.findByText('Pilates'));

    await user.click(screen.getByRole('button', { name: /Salvar/i }));

    // 3. Verifica que novo cliente aparece
    expect(await screen.findByText('Cliente Novo')).toBeInTheDocument();

    // 4. Verifica que o formulário foi limpo
    expect(screen.queryByDisplayValue('Cliente Novo')).not.toBeInTheDocument();
  });

  test('deve excluir um cliente quando o botão de excluir é clicado', async () => {
    const user = userEvent.setup();
    const testQueryClient = createTestQueryClient();
    renderApp(testQueryClient);

    // 1. Espera o item inicial carregar
    const itemParaExcluir = await screen.findByText('Ana Mock');
    expect(itemParaExcluir).toBeInTheDocument();

    // encontra a linha (<tr>) contendo o item
    const linha = itemParaExcluir.closest('tr');
    // dentro da linha procura por botões e assume que o último é o de excluir
    const { getAllByRole } = within(linha);
    const botoes = getAllByRole('button');
    const botaoExcluir = botoes[botoes.length - 1];

    // 2. Clica no botão de excluir (window.confirm está mockado para true)
    await user.click(botaoExcluir);

    // 3. Espera que o item desapareça
    await waitFor(() => {
      expect(screen.queryByText('Ana Mock')).not.toBeInTheDocument();
    });
  });

  test('deve mostrar uma mensagem de erro se o Salvar falhar', async () => {
    const user = userEvent.setup();
    const testQueryClient = createTestQueryClient();

    // Faz com que o POST /clientes retorne 500 apenas para este teste
    server.use(
      http.post('http://localhost:3001/clientes', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderApp(testQueryClient);

  // Estado inicial: espera o formulário disponível
  expect(await screen.findByLabelText(/Nome/i)).toBeInTheDocument();

    // Tenta criar um novo cliente (a chamada vai falhar)
    await user.type(screen.getByLabelText(/Nome/i), 'Cliente Com Erro');
    await user.click(screen.getByRole('button', { name: /Salvar/i }));

    // Verifica que a mensagem de erro foi exibida
    expect(await screen.findByText('Erro ao salvar cliente.')).toBeInTheDocument();

    // Verifica que o novo item NÃO apareceu na tabela
    expect(screen.queryByText('Cliente Com Erro')).not.toBeInTheDocument();
  });
});
