import ListagemClientes from './pages/ListagemClientes';
import FormularioCliente from './components/FormularioCliente'; // 1. Importe o formulário
import './App.css'

function App() {
  return (
    <div>
      <h1>Gestão de Academia</h1>
      <hr />
      {/* 2. Adicione o formulário */}
      <FormularioCliente />
      <hr />
      {/* 3. Adicione a listagem */}
      <ListagemClientes />
    </div>
  )
}

export default App
