import React from 'react';
import ClienteTabela from '../components/ClienteTabela';

// 1. Receba { clientes } como prop
const ListagemClientes = ({ clientes, onDelete }) => {
  // Toda a lógica de useState e useEffect foi REMOVIDA
  
  return (
    <div>
      <h2>Clientes Cadastrados</h2>
      {/* 2. Passe a prop 'clientes' para a tabela */}
      <ClienteTabela clientes={clientes} onDelete={onDelete} />
    </div>
  );
}

export default ListagemClientes;
