import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ClienteTabela from '../components/ClienteTabela'; // 1. Importe o componente novo

// (Feature 1: Usando arrow function)
const ListagemClientes = () => {
  const [clientes, setClientes] = useState([]);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div>
      <h2>Clientes Cadastrados</h2>
      {/* 2. Use o componente e passe os dados via props */}
      <ClienteTabela clientes={clientes} />
    </div>
  );
}

export default ListagemClientes;
