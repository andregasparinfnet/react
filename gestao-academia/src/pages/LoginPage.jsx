// src/pages/LoginPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Paper } from '@mui/material';

const LoginPage = () => {
  // Puxa a função 'login' do nosso contexto
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/clientes');
  };

  return (
    <Paper 
      sx={{ 
        padding: 4, 
        maxWidth: 400, 
        margin: 'auto', 
        marginTop: 8,
        textAlign: 'center'
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Acesso Restrito
      </Typography>
      <Typography variant="body1" gutterBottom>
        Por favor, faça o login para acessar o painel de gerenciamento.
      </Typography>
      <Box sx={{ marginTop: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleLogin} // Chama a função de login simulado
        >
          Entrar (Simulado)
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginPage;
