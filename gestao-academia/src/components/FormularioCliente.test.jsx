// src/components/FormularioCliente.test.jsx

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import FormularioCliente from './FormularioCliente'; // O componente a ser testado
import { useClientes } from '../context/ClienteContext'; // O hook que vamos mockar
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

// evitar requests reais: mock axios
vi.mock('axios');

// 1. (Feature: Teste) - Mocka o módulo do contexto
// Diz ao Vitest: "Quando alguém importar 'useClientes', intercete e use o nosso objeto falso"
vi.mock('../context/ClienteContext');

// 2. Criamos as nossas funções "falsas" (mocks)
// Podemos espiá-las para ver se foram chamadas
const mockHandleSave = vi.fn();
const mockHandleCancelEdit = vi.fn();
let alertSpy; // Variável para o spy do window.alert

// 3. Define a implementação base do nosso mock
// O 'beforeEach' garante que este mock é resetado antes de cada 'test()'
beforeEach(() => {
  // Limpa o histórico das funções mock
  mockHandleSave.mockClear();
  mockHandleCancelEdit.mockClear();

  // mock de axios.get para retornar lista vazia de instrutores por padrão
  vi.mocked(axios.get).mockResolvedValue({ data: [] });

  // Define a implementação falsa de 'useClientes'
  vi.mocked(useClientes).mockReturnValue({
    // Funções
    handleSave: mockHandleSave,
    handleCancelEdit: mockHandleCancelEdit,
    
    // Estados
    isSaving: false,
    clienteEmEdicao: null, // Modo "Create" por padrão
    formResetToggle: false,
  });

  // Mocka o window.alert antes de cada teste para evitar alert real que bloqueia
  alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
});

// Restaura o spy após cada teste
afterEach(() => {
  if (alertSpy && alertSpy.mockRestore) alertSpy.mockRestore();
});

// (Feature: Teste) - Teste de componente isolado (Formulário)
describe('FormularioCliente Component', () => {

  test('renderiza corretamente em modo "Cadastrar"', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <FormularioCliente />
      </QueryClientProvider>
    );
    
    // Verifica se o título e o botão estão corretos para o modo "Create"
    expect(screen.getByText('Cadastrar Novo Cliente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
  });

  test('chama handleSave com os dados corretos ao submeter em modo "Cadastrar"', async () => {
    const user = userEvent.setup(); // Configura o simulador de utilizador
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <FormularioCliente />
      </QueryClientProvider>
    );

  // 1. Simula o utilizador a preencher o formulário
  await user.type(screen.getByLabelText(/Nome/i), 'Cliente Teste');
  // MUI Select não expõe opções nativamente até o menu abrir. Abrimos e clicamos na opção.
  await user.click(screen.getByLabelText(/Plano/i));
  await user.click(await screen.findByText('Pilates'));
  await user.click(screen.getByLabelText(/Status/i));
  await user.click(await screen.findByText('Inativo'));

    // 2. Simula o clique no botão Salvar
    await user.click(screen.getByRole('button', { name: /Salvar/i }));

    // 3. VERIFICA: A nossa função mock 'handleSave' foi chamada?
    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    
    // 4. VERIFICA: Foi chamada com os dados exatos que digitámos?
    // O componente também pode enviar `instrutor: null` — aceitamos isso usando objectContaining
    expect(mockHandleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Cliente Teste',
        plano: 'Pilates',
        status: 'Inativo',
      })
    );
  });

  test('renderiza campos preenchidos e botão "Atualizar" em modo "Editar"', () => {
    // 1. Sobrescreve o mock APENAS para este teste
    vi.mocked(useClientes).mockReturnValue({
      handleSave: mockHandleSave,
      handleCancelEdit: mockHandleCancelEdit,
      isSaving: false,
      clienteEmEdicao: { // <-- Fornece um cliente para edição
        id: '1',
        nome: 'Ana Silva',
        plano: 'Completo',
        status: 'Ativo'
      },
      formResetToggle: false,
    });

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <FormularioCliente />
      </QueryClientProvider>
    );

    // 2. VERIFICA: O título e o botão estão corretos para o modo "Edit"
    expect(screen.getByText(/Editando: Ana Silva/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Atualizar/i })).toBeInTheDocument();

    // 3. VERIFICA: Os campos estão preenchidos com os dados do mock?
    // Usamos 'getByDisplayValue' para encontrar inputs pelo seu valor atual
    expect(screen.getByDisplayValue('Ana Silva')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Completo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ativo')).toBeInTheDocument();
    
    // 4. VERIFICA: O botão "Cancelar" aparece?
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
  });

  test('desabilita todos os campos e botões quando "isSaving" é true', () => {
    // 1. Sobrescreve o mock APENAS para este teste
    vi.mocked(useClientes).mockReturnValue({
      handleSave: mockHandleSave,
      handleCancelEdit: mockHandleCancelEdit,
      isSaving: true, // <-- Define o estado de carregamento
      clienteEmEdicao: null,
      formResetToggle: false,
    });

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <FormularioCliente />
      </QueryClientProvider>
    );

    // 2. VERIFICA: O spinner aparece no botão?
    // 'getByRole("progressbar")' é como o MUI renderiza o CircularProgress
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

  // 3. VERIFICA: Os campos estão desabilitados?
  expect(screen.getByLabelText(/Nome/i)).toBeDisabled();
  // MUI Select usa aria-disabled ao invés do atributo disabled no elemento retornado
  expect(screen.getByLabelText(/Plano/i)).toHaveAttribute('aria-disabled', 'true');
  expect(screen.getByLabelText(/Status/i)).toHaveAttribute('aria-disabled', 'true');

    // 4. VERIFICA: O botão de salvar está desabilitado?
    // MUI renderiza apenas um spinner sem texto quando desabilitado, então selecionamos pelo type
    const submitBtn = document.querySelector('button[type="submit"]');
    expect(submitBtn).toBeDisabled();
  });

  test('não deve chamar handleSave e deve mostrar um alerta se o nome estiver vazio', async () => {
    const user = userEvent.setup();
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const utils = render(
      <QueryClientProvider client={qc}>
        <FormularioCliente />
      </QueryClientProvider>
    );

    // Em browsers reais o 'required' bloquearia o submit. Para forçar a execução
    // do handler onSubmit no ambiente de teste, submetemos o formulário
    // programaticamente (evitando a validação do navegador).
    const form = utils.container.querySelector('form');
    fireEvent.submit(form);

    // handleSave NÃO foi chamado
    expect(mockHandleSave).not.toHaveBeenCalled();

    // window.alert foi chamado com a mensagem esperada
    await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));
    expect(alertSpy).toHaveBeenCalledWith('O nome é obrigatório!');
  });
});
