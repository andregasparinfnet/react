import React from 'react';
import { useClienteForm } from '../hooks/useClienteForm';
import { useClientes } from '../context/ClienteContext';

// 1. Imports dos componentes de formulário do MUI
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography
} from '@mui/material';

const FormularioCliente = () => {
  const { handleSave, clienteEmEdicao, handleCancelEdit } = useClientes();
  const { nome, setNome, plano, setPlano, status, setStatus } = useClienteForm(clienteEmEdicao);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nome) {
      alert("O nome é obrigatório!"); // (Validação simples mantida)
      return;
    }
    await handleSave({ nome, plano, status }); 
  };

  return (
    // 2. (Feature 3: Componente de Terceiro - Box)
    // Box é uma "div" do MUI, usamos 'component="form"' para ele funcionar como formulário
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // Espaçamento entre os campos
        padding: 2,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fff'
      }}
    >
      {/* 3. Trocamos o 'h3' por 'Typography' (componente de texto do MUI) */}
      <Typography variant="h5" component="h3">
        {clienteEmEdicao ? `Editando: ${clienteEmEdicao.nome}` : 'Cadastrar Novo Cliente'}
      </Typography>
      
      {/* 4. (Feature 3: Componente de Terceiro - TextField) */}
      <TextField
        label="Nome"
        variant="outlined"
        fullWidth
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      
      {/* 5. (Feature 3: Componente de Terceiro - Select) */}
      <FormControl fullWidth>
        <InputLabel id="plano-label">Plano</InputLabel>
        <Select
          labelId="plano-label"
          label="Plano"
          value={plano}
          onChange={(e) => setPlano(e.target.value)}
        >
          <MenuItem value="Musculação">Musculação</MenuItem>
          <MenuItem value="Pilates">Pilates</MenuItem>
          <MenuItem value="Completo">Completo</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="Ativo">Ativo</MenuItem>
          <MenuItem value="Inativo">Inativo</MenuItem>
        </Select>
      </FormControl>
      
      {/* 6. (Feature 3: Componente de Terceiro - Button) */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button type="submit" variant="contained" color="primary">
          {clienteEmEdicao ? 'Atualizar' : 'Salvar'}
        </Button>
        
        {clienteEmEdicao && (
          <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
            Cancelar
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FormularioCliente;
