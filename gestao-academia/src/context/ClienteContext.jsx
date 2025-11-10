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
  // 1. NOVO ESTADO: Para a barra de busca
  const [searchTerm, setSearchTerm] = useState('');

  // 2. useEffect MODIFICADO: Agora busca os clientes E reage à busca
  // (Feature 3: AbortController para tratar race conditions)
  useEffect(() => {
    // --- Início da lógica do AbortController ---

    // 1. Cria um novo "controlador" para esta requisição específica
    const controller = new AbortController();

    const fetchClientes = async () => {
      try {
        // 2. Passamos o 'signal' do controlador para o axios.
        // O 'json-server' usa o parâmetro 'q' para busca full-text
        const response = await api.get(`/clientes?q=${encodeURIComponent(searchTerm)}`, {
          signal: controller.signal // <--- O AbortController é conectado aqui
        });

        setClientes(response.data);

      } catch (error) {
        // 3. Se o erro for de cancelamento (proposital), não fazemos nada
        if (error && (error.name === 'CanceledError' || error.code === 'ERR_CANCELED')) {
          console.log('Requisição anterior cancelada');
        } else {
          // Se for um erro real (rede, 500, etc.)
          console.error("Erro ao buscar clientes:", error);
          mostrarMensagem('error', 'Falha ao carregar clientes.');
        }
      }
    };

    fetchClientes();

    // 4. A MÁGICA: A função de "limpeza" do useEffect
    // Isso roda ANTES da próxima execução do useEffect ou quando o componente "morre".
    return () => {
      // 5. Cancela a requisição ANTERIOR
      // console.log(`Cancelando requisição para: ${searchTerm}`);
      controller.abort(); 
    };
    // --- Fim da lógica do AbortController ---

  }, [searchTerm]); // 6. O Array de dependência: Rode de novo se 'searchTerm' mudar

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
    // Tenta encontrar o cliente pelo id para usar o nome na confirmação
    const cliente = clientes.find(c => c.id === clienteId);
    const nomeExibicao = cliente ? cliente.nome : `ID ${clienteId}`;

    if (window.confirm(`Tem certeza que deseja excluir o cliente ${nomeExibicao}?`)) {
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
      searchTerm,
      setSearchTerm,
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
