import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; // Mantenha o import do axios

// A função de busca (queryFn)
const fetchInstrutores = async ({ signal }) => {
  // 1. Criamos um AbortController LOCAL
  // Este controlador será usado para a "corrida" interna.
  const localController = new AbortController();

  // 2. Se o useQuery (externo) decidir cancelar (ex: utilizador saiu da página),
  // nós também abortamos o nosso controlador local.
  if (signal) {
    signal.addEventListener('abort', () => {
      localController.abort();
    });
  }

  // 3. (Feature 3: Promise.race - Helper de Timeout)
  // O timeout agora ABORTA o controlador local antes de rejeitar.
  const timeoutPromise = new Promise((_, reject) => {
    const id = setTimeout(() => {
      // 4. A MELHORIA: Cancela ativamente a requisição axios
      localController.abort();
      reject(new Error('A API do GitHub demorou mais de 5 segundos para responder.'));
    }, 5000); // 5 segundos
    // Optional: if the outer signal aborts, clear timeout
    if (signal) {
      signal.addEventListener('abort', () => clearTimeout(id));
    }
  });

  try {
    // 5. Começa a "corrida"
    const response = await Promise.race([
      // Promise 1: A requisição real
      axios.get('https://api.github.com/orgs/reactjs/members', {
        // 6. Usamos o SINAL do nosso controlador LOCAL
        signal: localController.signal
      }),
      // Promise 2: Nosso timer
      timeoutPromise
    ]);

    // Se chegamos aqui, o axios "ganhou"
    return response.data;

  } catch (error) {
    // 7. Se o erro for de cancelamento (axios/Abort), o useQuery já trata isso.
    console.warn('Erro na corrida da API:', error && error.message);
    throw error; // Repassa o erro para o useQuery
  }
};

const InstrutoresPage = () => {
  const {
    data: instrutores,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['instrutoresGithub'],
    queryFn: fetchInstrutores,
  });

  if (isLoading) {
    return <div style={{ textAlign: 'center' }}>Carregando instrutores...</div>;
  }

  if (isError) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error.message}</div>;
  }

  return (
    <div>
      <h2>Nossos Instrutores (Membros da Org "ReactJS" no GitHub)</h2>
      <ul className="instrutor-lista">
        {instrutores.map(instrutor => (
          <li key={instrutor.id}>
            <img
              src={instrutor.avatar_url}
              alt={`Avatar de ${instrutor.login}`}
              className="instrutor-avatar"
            />
            <strong>{instrutor.login}</strong>
            <a
              href={instrutor.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Perfil
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstrutoresPage;
