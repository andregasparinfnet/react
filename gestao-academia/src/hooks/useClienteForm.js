import { useState, useEffect } from 'react';

// O nome de todo Hook personalizado deve começar com 'use'
export const useClienteForm = (clienteEmEdicao) => {

  // 1. Trazemos todo o estado do formulário para dentro do Hook
  const [nome, setNome] = useState('');
  const [plano, setPlano] = useState('Musculação');
  const [status, setStatus] = useState('Ativo');

  // 2. Trazemos o 'useEffect' que preenche o formulário
  useEffect(() => {
    if (clienteEmEdicao) {
      // Se estamos editando, preencha os campos
      setNome(clienteEmEdicao.nome);
      setPlano(clienteEmEdicao.plano);
      setStatus(clienteEmEdicao.status);
    } else {
      // Se não (modo cadastro), limpe os campos
      setNome('');
      setPlano('Musculação');
      setStatus('Ativo');
    }
  }, [clienteEmEdicao]); // A dependência é a mesma

  // 3. Retornamos os valores e os 'setters' para o componente
  return {
    nome,
    setNome,
    plano,
    setPlano,
    status,
    setStatus
  };
};
