import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

import InstrutoresPage from './InstrutoresPage';

// Helper para criar um QueryClient limpo
const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderComponent = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <InstrutoresPage />
    </QueryClientProvider>
  );
};

describe('InstrutoresPage Component', () => {
  test('deve mostrar "Carregando..." e depois exibir a lista de instrutores', async () => {
    renderComponent();

    expect(screen.getByText(/Carregando instrutores.../i)).toBeInTheDocument();

    expect(await screen.findByText(/instrutor1|Membro Mock 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/instrutor2|Membro Mock 2/i)).toBeInTheDocument();

    expect(screen.queryByText(/Carregando instrutores.../i)).not.toBeInTheDocument();
  });

  test('deve mostrar uma mensagem de erro se a API (GitHub) falhar', async () => {
    server.use(
      http.get('https://api.github.com/orgs/reactjs/members', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Erro Interno Simulado' });
      })
    );

    renderComponent();

  // axios may produce an English message like 'Request failed with status code 500'
  const errorMessage = await screen.findByText(/Erro|Request failed/i);
    expect(errorMessage).toBeInTheDocument();

    expect(screen.queryByText(/Carregando instrutores.../i)).not.toBeInTheDocument();
  });

  test('deve mostrar uma mensagem de erro se o timeout (Promise.race) for atingido', async () => {
    // Simula o cenário de timeout forçando o axios a rejeitar com a nossa mensagem de timeout.
    vi.spyOn(axios, 'get').mockRejectedValueOnce(new Error('A API do GitHub demorou mais de 5 segundos para responder.'));

    renderComponent();

    expect(await screen.findByText(/A API do GitHub demorou mais de 5 segundos/i)).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
