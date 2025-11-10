import React from 'react';
import { useClientes } from '../context/ClienteContext';

// 1. Imports dos componentes do MUI
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';

// 2. Imports dos Ícones do MUI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ClienteTabela = ({ clientes }) => {
  // 3. Lógica do contexto (sem mudança)
  const { handleEdit, handleDelete } = useClientes();

  return (
    // 4. Componente de "container" que dá o fundo de papel
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {/* Células do Cabeçalho (negrito por padrão) */}
            <TableCell>Nome</TableCell>
            <TableCell>Plano</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map(cliente => (
            <TableRow key={cliente.id}>
              {/* Células do Corpo */}
              <TableCell>{cliente.nome}</TableCell>
              <TableCell>{cliente.plano}</TableCell>
              <TableCell>{cliente.status}</TableCell>
              <TableCell align="right">
                {/* 5. (Feature 3: Componente de Terceiro - IconButton) */}
                <IconButton onClick={() => handleEdit(cliente)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(cliente.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClienteTabela;
