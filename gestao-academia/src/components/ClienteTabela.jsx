import React from 'react';

// (Feature 1: Componente reutilizável)
// (Feature 1: Usando arrow function para definir o componente)
// (Feature 1: Usando destructuring nas props para pegar { clientes })
const ClienteTabela = ({ clientes }) => {

  // (Feature 1: JSX para renderizar os dados)
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
        {/* (Feature 2: Renderização de lista) */}
        {clientes.map(cliente => (
          <tr key={cliente.id}>
            <td>{cliente.nome}</td>
            <td>{cliente.plano}</td>
            <td>{cliente.status}</td>
            <td>
              {/* (Feature 1: Botões de ação reutilizáveis) */}
              <button>Editar</button>
              <button>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClienteTabela;
