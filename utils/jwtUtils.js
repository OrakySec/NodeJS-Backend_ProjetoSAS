
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'SGVsbG8gd29ybGQh';

// Verificar se a chave secreta está definida corretamente
if (!secretKey) {
  throw new Error('A chave secreta não foi configurada corretamente.');
}

// Função para gerar token JWT
exports.gerarToken = (id) => {
  const payload = {
    id,
  };

  const token = jwt.sign(payload, secretKey);
    return token;
  };
  
  // Função para verificar o token JWT
  exports.verificarToken = (req, res, next) => {
    const cookieHeader = req.header('Cookie');
  
    if (!cookieHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
  
    const cookies = cookieHeader.split(';').reduce((prev, current) => {
      const [key, value] = current.trim().split('=');
      prev[key] = value;
      return prev;
    }, {});
  
    const token = cookies.jwt;
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.usuario = decoded;
  
      next();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Token inválido' });
    }
  };