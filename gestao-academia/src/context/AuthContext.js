// Re-export the real implementation from the .jsx file (avoids JSX-in-.js parse errors)
export { AuthProvider, useAuth } from './AuthContext.jsx';
export { default } from './AuthContext.jsx';
// 1. Cria o Contexto
