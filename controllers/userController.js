
// Importações
const express = require('express');
const router = express.Router();
const autenticar = require('../services/loginService');
const db = require('../config/dbConnect');
const userModel = require('../models/userModel');

// Importa a função para verificar o token JWT.
const { verificarToken } = require('../utils/jwtUtils');

// Rota para efetuar login.
router.post('/login', async (req, res) => {
  // Extrai CPF e senha do corpo da requisição.
  const { cpf, senha } = req.body;

  try {
    // Autentica o usuário.
    const token = await autenticar(cpf, senha);

    // Busca o usuário no banco de dados pelo CPF.
    const usuario = await userModel.buscarUsuarioPorCPF(cpf);

    // Define um cookie com o token JWT.
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 dias de validade
    });

    // Retorna uma mensagem de autenticação bem-sucedida.
    res.status(200).send({ message: 'Autenticação bem-sucedida' });
  } catch (error) {
    // Retorna uma mensagem de erro em caso de falha na autenticação.
    res.status(400).send({ message: error.message });
  }
});

// Rota para cadastrar um novo usuário.
router.post('/cadastro', async (req, res) => {
  try {
    // Extrai os dados do usuário do corpo da requisição.
    const { nome, cpf, data_nascimento, numero_cadsus, sexo, telefone, senha } = req.body;

    // Define a query SQL para inserir o usuário no banco de dados.
    const query = 'INSERT INTO users (nome, cpf, data_nascimento, numero_cadsus, sexo, telefone, senha) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    // Define os valores a serem inseridos na query.
    const values = [nome, cpf, data_nascimento, numero_cadsus, sexo, telefone, senha];
    
    // Executa a query no banco de dados.
    const result = await db.execute(query, values);

    // Retorna o ID do usuário cadastrado.
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    // Retorna uma mensagem de erro em caso de falha no cadastro.
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Rota para obter o perfil do usuário autenticado.
router.get('/perfil', verificarToken, async (req, res) => {
  // Obtém o usuário autenticado do token.
  const usuario = req.usuario;

  // Verifica se o usuário está autenticado.
  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  // Busca as informações do usuário no banco de dados com base no ID.
  const [user] = await db.query('SELECT * FROM users WHERE id = ?', [usuario.id]);

  // Retorna as informações do usuário.
  res.status(200).send(user);
});

// Exporta o roteador para que possa ser usado em outros módulos da aplicação.
module.exports = router;
