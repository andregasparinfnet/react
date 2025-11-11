import React from 'react';
import { Typography, Container, Box } from '@mui/material';

/**
 * (Rubrica 2.2)
 * Este é um Componente de Classe.
 * Ele demonstra a sintaxe tradicional do React (antes dos Hooks),
 * usando 'extends React.Component' e o método 'render()'.
 */
class HomePage extends React.Component {
  render() {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bem-vindo ao Sistema!
          </Typography>
          <Typography variant="body1">
            Este é o painel principal da Gestão de Academia.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Utilize o menu de navegação acima para aceder às secções 
            (após efetuar o login).
          </Typography>
        </Box>
      </Container>
    );
  }
}

export default HomePage;
