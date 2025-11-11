// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

// (Feature: Teste) - Handlers do MSW para simular a API de clientes

// A nossa "base de dados" falsa em memória
let clientesDB = [
  { id: '1', nome: 'Ana Mock', plano: 'Completo', status: 'Ativo' },
];

export const handlers = [
  // 1. Handler para GET /clientes
  http.get('http://localhost:3001/clientes', ({ request }) => {
    // Simula a busca (query 'q')
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('q');
    let data = clientesDB;
    if (searchTerm) {
      data = clientesDB.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return HttpResponse.json(data);
  }),

  // 2. Handler para POST /clientes
  http.post('http://localhost:3001/clientes', async ({ request }) => {
    const novoCliente = await request.json();
    novoCliente.id = (clientesDB.length + 2).toString();
    clientesDB.push(novoCliente);
    return HttpResponse.json(novoCliente, { status: 201 });
  }),

  // 3. Handler para DELETE /clientes/:id
  http.delete('http://localhost:3001/clientes/:id', ({ params }) => {
    clientesDB = clientesDB.filter(c => c.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
  // Handler para a API do GitHub usada na página de instrutores
  http.get('https://api.github.com/orgs/reactjs/members', () => {
    // Retorna uma lista pequena de instrutores falsos
    const gh = [
      { id: 1001, login: 'instrutor1', avatar_url: 'https://example.com/a1.png', html_url: 'https://github.com/instrutor1' },
      { id: 1002, login: 'instrutor2', avatar_url: 'https://example.com/a2.png', html_url: 'https://github.com/instrutor2' },
    ];
    return HttpResponse.json(gh);
  }),
  // Responder a OPTIONS se necessário
  http.options('https://api.github.com/orgs/reactjs/members', () => new HttpResponse(null, { status: 200 })),
];
