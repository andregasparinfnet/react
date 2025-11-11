import React from 'react';
import { useClienteForm } from '../hooks/useClienteForm';
import { useClientes } from '../context/ClienteContext';

import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Typography,
  CircularProgress // 1. Importe o CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const FormularioCliente = () => {
  // 2. Puxe o novo estado 'isSaving'
  const { 
    handleSave, 
    clienteEmEdicao, 
    handleCancelEdit, 
    isSaving // <-- Novo estado de "carregamento" da mutação
  } = useClientes();

  // Pega o toggle para resetar o formulário quando um novo cliente for criado
  const { formResetToggle } = useClientes();

  const { nome, setNome, plano, setPlano, status, setStatus, instrutor, setInstrutor } = useClienteForm(clienteEmEdicao, formResetToggle);

  // Busca a lista de instrutores (reuso simples da mesma API do InstrutoresPage)
  const fetchInstrutores = async ({ signal }) => {
    const localController = new AbortController();
    if (signal) signal.addEventListener('abort', () => localController.abort());

    const timeoutPromise = new Promise((_, reject) => {
      const id = setTimeout(() => {
        localController.abort();
        reject(new Error('A API do GitHub demorou mais de 5 segundos para responder.'));
      }, 5000);
      if (signal) signal.addEventListener('abort', () => clearTimeout(id));
    });

    try {
      const response = await Promise.race([
        axios.get('https://api.github.com/orgs/reactjs/members', { signal: localController.signal }),
        timeoutPromise
      ]);
      return response.data;
    } catch (err) {
      console.warn('Erro ao buscar instrutores:', err && err.message);
      throw err;
    }
  };

  const { data: instrutores = [], isLoading: loadingInstrutores } = useQuery({
    queryKey: ['instrutoresGithub'],
    queryFn: fetchInstrutores,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nome) {
      alert("O nome é obrigatório!");
      return;
    }
    // monta o payload de instrutor: procuramos nos instrutores carregados
    const selectedInstrutor = instrutores.find(i => i.login === instrutor);
    const instrutorPayload = selectedInstrutor ? { login: selectedInstrutor.login, avatar_url: selectedInstrutor.avatar_url } : null;

    // envia também o instrutor selecionado (se houver)
    handleSave({ nome, plano, status, instrutor: instrutorPayload }); 
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        padding: 2,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fff'
      }}
    >
      <Typography variant="h5" component="h3">
        {clienteEmEdicao ? `Editando: ${clienteEmEdicao.nome}` : 'Cadastrar Novo Cliente'}
      </Typography>
      
      <TextField
        label="Nome"
        variant="outlined"
        fullWidth
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        disabled={isSaving} // 3. Desabilita o campo enquanto salva
      />
      
      <FormControl fullWidth disabled={isSaving}> {/* 3. Desabilita o campo enquanto salva */}
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

      {/* Novo campo: Instrutor */}
      <FormControl fullWidth disabled={isSaving || loadingInstrutores}>
        <InputLabel id="instrutor-label">Instrutor</InputLabel>
        <Select
          labelId="instrutor-label"
          label="Instrutor"
          value={instrutor}
          onChange={(e) => setInstrutor(e.target.value)}
          renderValue={(selected) => {
            if (!selected) return 'Nenhum';
            const s = instrutores.find(i => i.login === selected);
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {s && s.avatar_url && (
                  <img src={s.avatar_url} alt={s.login} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                )}
                <span>{selected}</span>
              </span>
            );
          }}
        >
          <MenuItem value="">Nenhum</MenuItem>
          {instrutores.map(ins => (
            // mostramos a foto ao lado do login no menu
            <MenuItem key={ins.id} value={ins.login} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img src={ins.avatar_url} alt={ins.login} style={{ width: 28, height: 28, borderRadius: '50%' }} />
              <span>{ins.login}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth disabled={isSaving}> {/* 3. Desabilita o campo enquanto salva */}
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
      
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          // 4. Adiciona a propriedade 'disabled'
          disabled={isSaving} 
        >
          {/* 5. Mostra o texto ou um spinner (UX bónus) */}
          {isSaving 
            ? <CircularProgress size={24} color="inherit" /> 
            : (clienteEmEdicao ? 'Atualizar' : 'Salvar')
          }
        </Button>
        
        {clienteEmEdicao && (
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleCancelEdit}
            disabled={isSaving} // 6. Desabilita o "Cancelar" também
          >
            Cancelar
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FormularioCliente;
