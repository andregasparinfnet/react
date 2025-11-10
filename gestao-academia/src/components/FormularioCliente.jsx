import React, { useState } from 'react';

// (Feature 1: Componente reutilizável de formulário)
const FormularioCliente = () => {

  // (Feature 2: Gerenciamento de estado do formulário)
  const [nome, setNome] = useState('');
  const [plano, setPlano] = useState('Musculação'); // Valor padrão

  const handleSubmit = (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    // (Feature 1: Usando template literals para a mensagem)
    const mensagem = `Cliente: ${nome}, Plano: ${plano}`;
    alert(`(Simulação) Enviando dados: ${mensagem}`);

    // Aqui, futuramente, enviaremos os dados para a API
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cadastrar / Editar Cliente</h3>

      <div>
        <label htmlFor="nome">Nome:</label>
        <input 
          type="text" 
          id="nome" 
          value={nome}
          onChange={(e) => setNome(e.target.value)} // (Feature 2: Formulário controlado)
        />
      </div>

      <div>
        <label htmlFor="plano">Plano:</label>
        <select 
          id="plano" 
          value={plano}
          onChange={(e) => setPlano(e.target.value)} // (Feature 2: Formulário controlado)
        >
          <option value="Musculação">Musculação</option>
          <option value="Pilates">Pilates</option>
          <option value="Completo">Completo</option>
        </select>
      </div>

      <button type="submit">Salvar</button>
    </form>
  );
};

export default FormularioCliente;
