import React from 'react';
// 1. Importe o hook
import { useClientes } from '../context/ClienteContext';

// 2. Remova 'onDelete' e 'onEdit' das props
const ClienteTabela = ({ clientes }) => {

  // 3. Puxe as funções do contexto
  const { handleEdit, handleDelete } = useClientes();

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Plano</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map(cliente => (
          <tr key={cliente.id}>
            <td>{cliente.nome}</td>
            <td>{cliente.plano}</td>
            <td>{cliente.status}</td>
            <td>
              {/* 4. Use as funções do contexto */}
              <button 
                onClick={() => handleEdit(cliente)} 
                className="edit-button"
              >
                Editar
              </button>

              <button 
                onClick={() => handleDelete(cliente.id)}
                className="delete-button"
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClienteTabela;
