import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Importamos o 'api' aqui

// 1. Criamos o Contexto
const ClienteContext = createContext();

// 2. Criamos o "Provider" (Provedor)
// É um componente que vai "abraçar" nossa aplicação
export const ClienteProvider = ({ children }) => {

  // 3. MOVEMOS TODA A LÓGICA DO App.jsx PARA CÁ
  // ===============================================
  const [clientes, setClientes] = useState([]);
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        mostrarMensagem('error', 'Falha ao carregar clientes.');
      }
    };
    fetchClientes();
  }, []);

  const mostrarMensagem = (tipo, texto) => {
    setMensagem({ tipo, texto });
    setTimeout(() => {
      setMensagem({ tipo: '', texto: '' });
    }, 3000);
  };

  const handleSave = async (dadosCliente) => {
    try {
      if (clienteEmEdicao) {
        const response = await api.put(`/clientes/${clienteEmEdicao.id}`, dadosCliente);
        setClientes(clientes.map(c => (c.id === response.data.id ? response.data : c)));
        mostrarMensagem('success', 'Cliente atualizado com sucesso!');
      } else {
        const response = await api.post('/clientes', dadosCliente);
        setClientes([...clientes, response.data]);
        mostrarMensagem('success', 'Cliente cadastrado com sucesso!');
      }
      setClienteEmEdicao(null);
    } catch (error) {
      mostrarMensagem('error', 'Erro ao salvar cliente.');
    }
  };

  const handleEdit = (cliente) => {
    setClienteEmEdicao(cliente);
  };

  const handleCancelEdit = () => {
    setClienteEmEdicao(null);
  };

  const handleDelete = async (clienteId) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ID ${clienteId}?`)) {
      try {
        await api.delete(`/clientes/${clienteId}`);
        setClientes(clientes.filter(cliente => cliente.id !== clienteId));
        mostrarMensagem('success', 'Cliente excluído com sucesso!');
      } catch (error) {
        mostrarMensagem('error', 'Erro ao excluir cliente.');
      }
    }
  };
  // ===============================================
  // FIM DA LÓGICA MOVIDA

  // 4. Fornecemos os estados e funções para os "filhos"
  return (
    <ClienteContext.Provider value={{
      clientes,
      clienteEmEdicao,
      mensagem,
      handleSave,
      handleEdit,
      handleCancelEdit,
      handleDelete
    }}>
      {children}
    </ClienteContext.Provider>
  );
};

// 5. Criamos um Hook personalizado para consumir o contexto
// Isso evita ter que importar 'useContext' e 'ClienteContext' em todo componente
export const useClientes = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error('useClientes deve ser usado dentro de um ClienteProvider');
  }
  return context;
};
