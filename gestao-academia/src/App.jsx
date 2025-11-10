import React from 'react'; 
import ListagemClientes from './pages/ListagemClientes';
import FormularioCliente from './components/FormularioCliente';

// 2. Importamos nosso Hook de contexto
import { useClientes } from './context/ClienteContext';
import { Box, Divider } from '@mui/material'; // 1. Imports do MUI
import './App.css'

// (Componente de Mensagem continua o mesmo, se você o manteve aqui)
// Se não, pode buscá-lo do contexto também. Vamos mantê-lo simples:
const Mensagem = ({ tipo, texto }) => {
  if (!texto) return null;
  const classeCss = `mensagem ${tipo}`;
  return <div className={classeCss}>{texto}</div>;
};


function App() {
  const { mensagem } = useClientes();

  return (
    // 2. Use Box no lugar de <div>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}> 
      <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} />

      <FormularioCliente />

      {/* 3. Use Divider no lugar de <hr /> */}
      <Divider sx={{ marginY: 2 }} /> 

      <ListagemClientes />
    </Box>
  )
}

export default App
