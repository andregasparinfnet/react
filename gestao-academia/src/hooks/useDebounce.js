// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

// (Feature 2: Hook Personalizado)
export const useDebounce = (value, delay) => {
  // Estado para guardar o valor "atrasado"
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. Cria um "timer"
    const handler = setTimeout(() => {
      // 2. Só atualiza o estado "atrasado" depois que o 'delay' passar
      setDebouncedValue(value);
    }, delay);

    // 3. Função de limpeza: cancela o timer
    //    Se o 'value' mudar (utilizador a digitar), o timer anterior é limpo
    //    e um novo é criado.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Só re-executa se o valor ou o delay mudarem

  // Retorna o valor apenas quando o utilizador parar de digitar
  return debouncedValue;
};
