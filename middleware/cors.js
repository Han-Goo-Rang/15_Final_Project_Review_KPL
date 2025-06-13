// middleware/cors.js
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // URL frontend Anda
  optionsSuccessStatus: 200,
  credentials: true, // Memungkinkan cookies dan token di kirim dalam request
};

module.exports = cors();