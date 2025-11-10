import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Importe o Provider
import { ClienteProvider } from './context/ClienteContext.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Envolva o App com o Provider */}
    <ClienteProvider>
      <App />
    </ClienteProvider>
  </StrictMode>,
)
