import { useState, useEffect } from 'react';

// O nome de todo Hook personalizado deve começar com 'use'
export const useClienteForm = (clienteEmEdicao, formResetToggle) => {

  // 1. Trazemos todo o estado do formulário para dentro do Hook
  const [nome, setNome] = useState('');
  const [plano, setPlano] = useState('Musculação');
  const [status, setStatus] = useState('Ativo');
  // novo: instrutor selecionado (guardamos o login como string)
  const [instrutor, setInstrutor] = useState('');

  // 2. Trazemos o 'useEffect' que preenche o formulário
  useEffect(() => {
    // Sempre que `clienteEmEdicao` mudar, garantimos que o formulário
    // reflete o modo atual (edição ou criação).
    if (clienteEmEdicao) {
      // Se estamos editando, preencha os campos
      setNome(clienteEmEdicao.nome);
      setPlano(clienteEmEdicao.plano);
      setStatus(clienteEmEdicao.status);
      // clienteEmEdicao.instrutor pode ser um objeto { login, avatar_url } ou apenas uma string
      if (clienteEmEdicao.instrutor && typeof clienteEmEdicao.instrutor === 'object') {
        setInstrutor(clienteEmEdicao.instrutor.login || '');
      } else {
        setInstrutor(clienteEmEdicao.instrutor || '');
      }
    } else {
      // Se não (modo cadastro), limpe os campos
      setNome('');
      setPlano('Musculação');
      setStatus('Ativo');
      setInstrutor('');
    }
    // Além disso, se formResetToggle mudar (sinal de criação bem-sucedida),
    // e estamos no modo criação (clienteEmEdicao null), o efeito será disparado
    // e limpará os campos — isso corrige o caso onde o formulário já estava
    // em modo criação antes do save e portanto não mudaria apenas com
    // setClienteEmEdicao(null) no contexto.
  }, [clienteEmEdicao, formResetToggle]);

  // 3. Retornamos os valores e os 'setters' para o componente
  return {
    nome,
    setNome,
    plano,
    setPlano,
    status,
    setStatus
    ,
    instrutor,
    setInstrutor
  };
};
