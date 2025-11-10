import axios from 'axios';

// Pequeno wrapper do axios para chamada à API local (json-server)
const api = axios.create({
  baseURL: 'http://localhost:3001'
});

export default api;
