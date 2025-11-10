import React from 'react'; 
import ListagemClientes from './pages/ListagemClientes';
import FormularioCliente from './components/FormularioCliente';

// 2. Importamos nosso Hook de contexto
import { useClientes } from './context/ClienteContext';
import './App.css'

// (Componente de Mensagem continua o mesmo, se você o manteve aqui)
// Se não, pode buscá-lo do contexto também. Vamos mantê-lo simples:
const Mensagem = ({ tipo, texto }) => {
  if (!texto) return null;
  const classeCss = `mensagem ${tipo}`;
  return <div className={classeCss}>{texto}</div>;
};


function App() {
  // 3. Pegamos APENAS o que o App precisa do contexto
  const { mensagem } = useClientes();

  // 4. TODA a lógica de handleSave, handleDelete, etc. SUMIU!

  return (
    <div>
      <h1>Gestão de Academia</h1>

      <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} />

      <hr />

      {/* 5. Não passamos mais NENHUMA PROP! */}
      <FormularioCliente />

      <hr />

      {/* 6. Não passamos mais NENHUMA PROP! */}
      <ListagemClientes />
    </div>
  )
}

export default App
