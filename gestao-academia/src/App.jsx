import React, { useState, useEffect } from 'react'; // 1. Imports adicionados
import api from './services/api'; // 2. Import do api
import ListagemClientes from './pages/ListagemClientes';
import FormularioCliente from './components/FormularioCliente';
import './App.css'

function App() {
  // 3. Lógica de estado e busca movida para cá
  const [clientes, setClientes] = useState([]);

  // (Feature 2: useEffect para efeitos colaterais, como buscar dados)
  useEffect(() => {
    // (Feature 1: Arrow function)
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };
    
    fetchClientes();
  }, []); // Array vazio garante que rode só uma vez

  // (Feature 2: Manipular eventos de submissão + Promises)
  const handleAddCliente = async (novoClienteData) => {
    try {
      const response = await api.post('/clientes', novoClienteData);
      const novoCliente = response.data; // O novo cliente retornado pela API

      // (Feature 1: Operador Spread para atualizar o estado)
      // (Feature 2: Gerenciamento de estado reativo)
      setClientes(prev => [...prev, novoCliente]); // Adiciona o novo cliente à lista

    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };

  // (Feature 2: Deletar cliente)
  const handleDeleteCliente = async (id) => {
    // (Feature 1: Template literal para mensagem dinâmica)
    if (window.confirm(`Tem certeza que deseja excluir o cliente ID ${id}?`)) {
      try {
        await api.delete(`/clientes/${id}`);
        // Filtra a lista, mantendo apenas os clientes com ID diferente
        setClientes(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error("Erro ao deletar cliente:", error);
      }
    }
  };

  return (
    <div>
      <h1>Gestão de Academia</h1>
      <hr />
      {/* Passe a função 'create' como prop */}
      <FormularioCliente onSave={handleAddCliente} />
      <hr />
      <ListagemClientes clientes={clientes} onDelete={handleDeleteCliente} />
    </div>
  )
}

export default App
