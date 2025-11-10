import React from 'react';
// 2. Importamos nosso novo Hook
import { useClienteForm } from '../hooks/useClienteForm';
// 1. Importe o hook de contexto
import { useClientes } from '../context/ClienteContext';

// 2. Remova as props onSave, clienteEmEdicao, onCancel
const FormularioCliente = () => {

  // 3. Puxe os dados do contexto
  const { 
    handleSave,       // Renomeamos onSave para handleSave no contexto
    clienteEmEdicao, 
    handleCancelEdit  // Renomeamos onCancel para handleCancelEdit
  } = useClientes();

  // O hook do formulário funciona perfeitamente
  const { 
    nome, setNome, 
    plano, setPlano, 
    status, setStatus 
  } = useClienteForm(clienteEmEdicao);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nome) {
      alert("O nome é obrigatório!");
      return;
    }
    // 4. Use a função do contexto
    await handleSave({ nome, plano, status }); 
  };

  // O JSX (return) abaixo usa as funções do contexto
  return (
    <form onSubmit={handleSubmit}>
      {/* ... (o h3 não muda) ... */}
      <h3>
        {clienteEmEdicao ? `Editando: ${clienteEmEdicao.nome}` : 'Cadastrar Novo Cliente'}
      </h3>
      {/* ... (os inputs não mudam) ... */}

      <div>
        <label htmlFor="nome">Nome:</label>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>
      <div>
        <label htmlFor="plano">Plano:</label>
        <select id="plano" value={plano} onChange={(e) => setPlano(e.target.value)}>
          <option value="Musculação">Musculação</option>
          <option value="Pilates">Pilates</option>
          <option value="Completo">Completo</option>
        </select>
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      <div className="form-buttons">
        <button type="submit">
          {clienteEmEdicao ? 'Atualizar' : 'Salvar'}
        </button>

        {clienteEmEdicao && (
          <button type="button" onClick={handleCancelEdit} className="cancel-button">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormularioCliente;
