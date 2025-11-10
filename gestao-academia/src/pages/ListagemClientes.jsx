import React from 'react';
import ClienteTabela from '../components/ClienteTabela';
// 1. Importe o hook
import { useClientes } from '../context/ClienteContext';

// 1. Imports do MUI para o layout e o campo de busca
import { Box, Typography, TextField } from '@mui/material';

// 2. Remova TODAS as props
const ListagemClientes = () => {

  // 3. Puxe 'clientes' E os novos estados de busca do contexto
  const { clientes, searchTerm, setSearchTerm } = useClientes();

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

        {/* 4. A BARRA DE BUSCA */}
        <TextField
          label="Buscar Cliente"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <ClienteTabela clientes={clientes} />
    </Box>
  );
}

export default ListagemClientes;
