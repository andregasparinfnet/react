import React from 'react';
import ClienteTabela from '../components/ClienteTabela';
// 1. Importe o hook
import { useClientes } from '../context/ClienteContext';

// 1. Imports do MUI para o layout e o campo de busca
import { Box, Typography, TextField, CircularProgress } from '@mui/material';

// 2. Remova TODAS as props
const ListagemClientes = () => {

  // 3. Puxe 'clientes' E os novos estados de busca do contexto
  const { 
    clientes, 
    searchTerm, 
    setSearchTerm, 
    isFetchingClientes // <-- Nosso estado de loading!
  } = useClientes();

  return (
    // 3. (Feature 3: Componente de Terceiro - Box, TextField)
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <Typography variant="h5" component="h2">
          Clientes Cadastrados
        </Typography>
        
        {/* 3. (Gap 3: UX de Loading) Mostra o spinner de loading ao lado da busca */}
        {isFetchingClientes && <CircularProgress size={24} sx={{ marginLeft: 2 }} />}
        
        <Box sx={{ flexGrow: 1 }} /> {/* Espaçador */}
        
        <TextField
          label="Buscar Cliente"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      
      {/* 4. Passamos os clientes (que agora vêm do React Query) para a tabela */}
      <ClienteTabela clientes={clientes} />
    </Box>
  );
}

export default ListagemClientes;
