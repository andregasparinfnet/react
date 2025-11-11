// Re-export the real implementation from the .jsx file (keeps imports stable for tests)
export { AuthProvider, useAuth } from './AuthContext.jsx';
export { default } from './AuthContext.jsx';
