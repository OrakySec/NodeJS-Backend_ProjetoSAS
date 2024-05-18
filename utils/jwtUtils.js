// Importa o módulo jsonwebtoken
const jwt = require('jsonwebtoken');

// Obtém a chave secreta do ambiente ou define uma padrão
const secretKey = process.env.SECRET_KEY || 'SGVsbG8gd29ybGQh';

// Verificar se a chave secreta está definida corretamente
if (!secretKey) {
  throw new Error('A chave secreta não foi configurada corretamente.');
}

// Função para gerar token JWT
exports.gerarToken = (id) => {
  // Define o payload do token com o ID do usuário
  const payload = {
    id,
  };

  // Gera o token JWT usando o payload e a chave secreta
  const token = jwt.sign(payload, secretKey);
  return token; // Retorna o token gerado
};

// Função para verificar o token JWT
exports.verificarToken = (req, res, next) => {
  // Obtém o cabeçalho "Cookie" da requisição
  const cookieHeader = req.header('Cookie');

  // Verifica se o cabeçalho "Cookie" está presente na requisição
  if (!cookieHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Divide o cabeçalho "Cookie" em partes e mapeia para um objeto
  const cookies = cookieHeader.split(';').reduce((prev, current) => {
    const [key, value] = current.trim().split('=');
    prev[key] = value;
    return prev;
  }, {});

  // Obtém o token JWT dos cookies
  const token = cookies.jwt;

  try {
    // Verifica se o token JWT é válido usando a chave secreta
    const decoded = jwt.verify(token, secretKey);
    // Adiciona o payload decodificado à requisição
    req.usuario = decoded;
    // Chama a próxima função de middleware
    next();
  } catch (error) {
    // Em caso de erro na verificação do token, retorna uma resposta de erro
    console.error(error);
    res.status(400).json({ error: 'Token inválido' });
  }
};
