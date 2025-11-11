// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// (Feature: Teste) - Configura o servidor do MSW
export const server = setupServer(...handlers);
