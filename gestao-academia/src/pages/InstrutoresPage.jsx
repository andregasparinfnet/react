import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; // Vamos usar axios para a requisição

// 1. (Feature 3: Integrar API real - GitHub)
// Esta é a função que busca os dados.
const fetchInstrutores = async () => {
  // Usamos axios.get() direto, pois nosso 'api.js' está configurado para o localhost.
  const { data } = await axios.get('https://api.github.com/orgs/reactjs/members');
  return data;
};

const InstrutoresPage = () => {

  // 2. (Feature 3: Utilizando React Query para gerenciar cache)
  // O useQuery cuida de tudo: loading, error, cache, e re-validação.
  const { 
    data: instrutores, // 'data' é renomeado para 'instrutores'
    isLoading,         // Estado de carregamento
    isError,           // Estado de erro
    error              // Objeto do erro
  } = useQuery({
    queryKey: ['instrutoresGithub'], // Chave única para o cache
    queryFn: fetchInstrutores,       // A função que busca os dados
  });

  // 3. (Feature 3: Gerenciar erros e loading)
  if (isLoading) {
    return <div style={{ textAlign: 'center' }}>Carregando instrutores...</div>;
  }

  if (isError) {
    return <div style={{ color: 'red' }}>Erro ao buscar dados: {error.message}</div>;
  }

  // 4. Renderização dos dados
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
