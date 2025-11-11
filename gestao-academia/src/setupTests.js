// src/setupTests.js
import '@testing-library/jest-dom';
import { server } from './mocks/server.js';
import { vi } from 'vitest';

// (Feature: Teste) - Configuração global do Vitest

// 1. Inicia o servidor MSW antes de todos os testes
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// 2. Desliga o servidor MSW após todos os testes
afterAll(() => server.close());

// 3. Reinicia os handlers do MSW após cada teste
afterEach(() => server.resetHandlers());

// 4. Mock global para o window.confirm (evita bloqueio de confirmação)
window.confirm = vi.fn(() => true);
