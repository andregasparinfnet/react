// middleware.js
// CORS middleware para json-server que responde aos preflight OPTIONS
// e define Access-Control-Allow-Origin para o frontend hospedado no Render.
module.exports = (req, res, next) => {
  // Substitua pelo domínio do seu frontend no Render
  res.header('Access-Control-Allow-Origin', 'https://react-frontend-7re2.onrender.com');

  // Necessário para o preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    // Define os métodos e headers permitidos
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    return res.sendStatus(200); // Responde OK ao preflight
  }

  next(); // Continua para o json-server
};
