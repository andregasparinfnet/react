import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 1. (Feature 3: Promise.race - Helper de Timeout)
// Esta função cria uma promise que falha (rejeita) após um tempo
const timeoutPromise = (ms, message = 'A requisição estourou o tempo limite') => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });
};


// 2. (Feature 3: Integrar API real - GitHub)
// A função de busca agora é MAIS ROBUSTA
const fetchInstrutores = async ({ signal }) => { // 'signal' é passado pelo useQuery
  try {
    // 3. (Feature 3: Promise.race)
    // Começa a "corrida" entre a requisição e um timeout de 5 segundos
    const response = await Promise.race([
      // Promise 1: A requisição real (passando o 'signal' do useQuery)
      axios.get('https://api.github.com/orgs/reactjs/members', {
        signal: signal 
      }),
      // Promise 2: Nosso timer
      timeoutPromise(5000, 'A API do GitHub demorou mais de 5 segundos para responder.')
    ]);

    // Se chegamos aqui, o axios "ganhou" a corrida
    return response.data;

  } catch (error) {
    // Se o timeout "ganhou" ou o axios falhou, o erro é pego aqui
    // e repassado para o useQuery
    throw error;
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
    queryFn: fetchInstrutores, // useQuery vai chamar 'fetchInstrutores' com o objeto { signal }
  });

  if (isLoading) {
    return <div style={{ textAlign: 'center' }}>Carregando instrutores...</div>;
  }

  // 4. AGORA: Se o timeout estourar, 'isError' será true
  if (isError) {
    // A 'error.message' será a mensagem do nosso timeout!
    return <div style={{ color: 'red', textAlign: 'center' }}>{error.message}</div>;
  }

  // ... (O JSX de renderização da lista continua o mesmo)
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
