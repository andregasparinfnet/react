import axios from 'axios';

// Pequeno wrapper do axios para chamada à API local (json-server)
// Allow overriding the API URL via Vite environment variable in production
// (set VITE_API_URL in Render or other host). Fall back to localhost for dev.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL
});

export default api;
