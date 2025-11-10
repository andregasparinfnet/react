import React, { useState } from 'react';

// 1. Receba 'onSave' via props (usando destructuring)
const FormularioCliente = ({ onSave }) => {

  const [nome, setNome] = useState('');
  const [plano, setPlano] = useState('Musculação');
  const [status, setStatus] = useState('Ativo'); // 2. Adicione 'status' ao estado

  // (Feature 2: Manipular evento de submissão)
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // (Feature 2: Validação simples antes de enviar)
    if (!nome) {
      alert("O nome é obrigatório!");
      return;
    }

    // (Feature 1: Template literals)
    console.log(`Enviando: ${nome}, ${plano}, ${status}`);

    // 3. Chame a função 'onSave' (que veio do App.jsx) com os dados do estado
    // (Feature 2: Promises serão tratadas na função pai)
    if (onSave) {
      await onSave({ nome, plano, status });
    }

    // 4. Limpar o formulário após o envio
    setNome('');
    setPlano('Musculação');
    setStatus('Ativo');
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
          onChange={(e) => setNome(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="plano">Plano:</label>
        <select 
          id="plano" 
          value={plano}
          onChange={(e) => setPlano(e.target.value)}
        >
          <option value="Musculação">Musculação</option>
          <option value="Pilates">Pilates</option>
          <option value="Completo">Completo</option>
        </select>
      </div>

      {/* 5. Adicione o campo 'status' ao JSX */}
      <div>
        <label htmlFor="status">Status:</label>
        <select 
          id="status" 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>
      
      <button type="submit">Salvar</button>
    </form>
  );
};

export default FormularioCliente;
