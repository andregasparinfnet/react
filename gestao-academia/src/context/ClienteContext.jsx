import React, { createContext, useContext, useState } from 'react';
// 1. Importe 'useMutation'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';

const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  // Toggle usado para sinalizar ao formulário que deve ser limpo após um CREATE
  const [formResetToggle, setFormResetToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  // --- BUSCA (useQuery) - Sem alteração ---
  const { 
    data: clientes,
    isFetching: isFetchingClientes,
    isError: isErrorClientes
  } = useQuery({
    queryKey: ['clientes', debouncedSearchTerm], 
    queryFn: async ({ signal }) => {
      const response = await api.get(`/clientes?q=${debouncedSearchTerm}`, { signal });
      return response.data;
    },
  });

  const mostrarMensagem = (tipo, texto) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem({ tipo: '', texto: '' }), 3000);
  };

  // --- MUTAÇÕES (useMutation) ---

  // 2. (Feature 3: useMutation para Create/Update)
  const saveMutation = useMutation({
    mutationFn: (dadosCliente) => {
      if (clienteEmEdicao) {
        return api.put(`/clientes/${clienteEmEdicao.id}`, dadosCliente);
      } else {
        return api.post('/clientes', dadosCliente);
      }
    },
    onSuccess: () => {
      const message = clienteEmEdicao ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!';
      mostrarMensagem('success', message);
      // Se estivermos em modo edição, limpamos o estado de edição.
      // Se NÃO estivermos em edição (ou seja: criamos um novo cliente),
      // precisamos também sinalizar ao formulário que limpe os campos.
      if (clienteEmEdicao) {
        setClienteEmEdicao(null);
      } else {
        // dispara toggle para que hooks que dependem dele resetem o formulário
        setFormResetToggle(prev => !prev);
      }
      queryClient.invalidateQueries({ queryKey: ['clientes'] }); 
    },
    onError: () => {
      mostrarMensagem('error', 'Erro ao salvar cliente.');
    }
  });

  // 3. (Feature 3: useMutation para Delete)
  const deleteMutation = useMutation({
    mutationFn: (clienteId) => {
      return api.delete(`/clientes/${clienteId}`);
    },
    onSuccess: () => {
      mostrarMensagem('success', 'Cliente excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    onError: () => {
      mostrarMensagem('error', 'Erro ao excluir cliente.');
    }
  });

  // 4. Nossas funções "handle" agora são mais simples
  const handleSave = (dadosCliente) => {
    // Normaliza o nome para comparação (trim + case-insensitive)
    const nomeNormalized = (dadosCliente.nome || '').trim().toLowerCase();

    if (!nomeNormalized) {
      mostrarMensagem('error', 'O nome é obrigatório.');
      return;
    }

    // Verifica existência de cliente com mesmo nome
    const existente = (clientes || []).find(c => ((c.nome || '').trim().toLowerCase()) === nomeNormalized);

    if (clienteEmEdicao) {
      // Se estamos editando, permitir o mesmo nome se for o próprio registro
      if (existente && existente.id !== clienteEmEdicao.id) {
        mostrarMensagem('error', 'Já existe um cliente com este nome.');
        return;
      }
    } else {
      // Modo criação: impede duplicados
      if (existente) {
        mostrarMensagem('error', 'Já existe um cliente com este nome.');
        return;
      }
    }

    saveMutation.mutate(dadosCliente);
  };

  const handleDelete = (clienteId) => {
    // tenta obter nome para exibir na confirmação
    const cliente = (clientes || []).find(c => c.id === clienteId);
    const nomeExibicao = cliente ? cliente.nome : `ID ${clienteId}`;

    if (window.confirm(`Tem certeza que deseja excluir o cliente ${nomeExibicao}?`)) {
      deleteMutation.mutate(clienteId);
    }
  };

  const handleEdit = (cliente) => setClienteEmEdicao(cliente);
  const handleCancelEdit = () => setClienteEmEdicao(null);

  return (
    <ClienteContext.Provider value={{
      // Dados da Busca (useQuery)
      clientes: clientes || [], 
      isFetchingClientes,
      isErrorClientes,
      
      // Dados das Mutações (useMutation)
  isSaving: saveMutation.isLoading,
  isDeleting: deleteMutation.isLoading,
  // 'variables' no useMutation guarda o valor que foi passado para .mutate()
  // Neste caso, é o 'clienteId' que está a ser deletado
  deletingClientId: deleteMutation.variables,
      
      // Estado Local
      clienteEmEdicao,
      mensagem,
      searchTerm,
      setSearchTerm,
      
      // Funções "Handler"
      handleSave,
      handleEdit,
      handleCancelEdit,
      handleDelete
      ,
      // Toggle que indica para o formulário resetar (muda sempre que um novo cliente é criado)
      formResetToggle
    }}>
      {children}
    </ClienteContext.Provider>
  );
};

export const useClientes = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error('useClientes deve ser usado dentro de um ClienteProvider');
  }
  return context;
};
