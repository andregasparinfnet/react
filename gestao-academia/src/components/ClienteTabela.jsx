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
  IconButton,
  CircularProgress // 1. Importe o CircularProgress
} from '@mui/material';

// 2. Imports dos Ícones do MUI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ClienteTabela = ({ clientes }) => {
  // 3. Puxe os novos estados
  const { 
    handleEdit, 
    handleDelete, 
    isDeleting,         // true se *algum* delete estiver a decorrer
    deletingClientId,   // o ID do cliente a ser eliminado
    isSaving            // Opcional: desabilita 'Editar' enquanto salva
  } = useClientes();

  return (
    // 4. Componente de "container" que dá o fundo de papel
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {/* Células do Cabeçalho (negrito por padrão) */}
            <TableCell>Nome</TableCell>
            <TableCell>Plano</TableCell>
            <TableCell>Instrutor</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map(cliente => {
            // 3. Lógica: Este botão específico está a ser eliminado?
            const isThisOneDeleting = isDeleting && deletingClientId === cliente.id;

            return (
              <TableRow key={cliente.id}>
                {/* Células do Corpo */}
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.plano}</TableCell>
                <TableCell>
                  {cliente.instrutor ? (
                    typeof cliente.instrutor === 'string' ? (
                      // formato antigo: apenas o login
                      <span>{cliente.instrutor}</span>
                    ) : (
                      // formato novo: objeto com avatar_url e login
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        {cliente.instrutor.avatar_url && (
                          <img src={cliente.instrutor.avatar_url} alt={cliente.instrutor.login} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        )}
                        <span>{cliente.instrutor.login}</span>
                      </span>
                    )
                  ) : (
                    'Não selecionado'
                  )}
                </TableCell>
                <TableCell>{cliente.status}</TableCell>
                <TableCell align="right">
                  {/* 5. (Feature 3: Componente de Terceiro - IconButton) */}
                  <IconButton 
                    onClick={() => handleEdit(cliente)} 
                    color="primary"
                    // Desabilita "Editar" se esta linha estiver a ser eliminada
                    // ou se o formulário estiver a salvar algo
                    disabled={isThisOneDeleting || isSaving}
                  >
                    <EditIcon />
                  </IconButton>
                  
                  {/* 4. Lógica de Loading/Disabled no botão Excluir */}
                  <IconButton 
                    onClick={() => handleDelete(cliente.id)} 
                    color="error"
                    // Desabilita se esta linha estiver a ser eliminada
                    // ou se o formulário estiver a salvar algo
                    disabled={isThisOneDeleting || isSaving}
                  >
                    {/* 5. Mostra o Spinner ou o Ícone */}
                    {isThisOneDeleting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClienteTabela;
