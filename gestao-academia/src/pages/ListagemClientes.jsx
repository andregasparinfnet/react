import React from 'react';
import ClienteTabela from '../components/ClienteTabela';
// 1. Importe o hook
import { useClientes } from '../context/ClienteContext';

// 2. Remova TODAS as props
const ListagemClientes = () => {

  // 3. Puxe APENAS 'clientes' do contexto
  const { clientes } = useClientes();

  return (
    <div>
      <h2>Clientes Cadastrados</h2>
      {/* 4. Passe 'clientes' para a tabela.
           NÃO precisamos mais passar onDelete ou onEdit! */}
      <ClienteTabela clientes={clientes} />
    </div>
  );
}

export default ListagemClientes;
