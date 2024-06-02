// userController.js

// Importações
const express = require('express');
const router = express.Router();
const autenticar = require('../services/loginService');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { verificarToken } = require('../utils/jwtUtils');

// Rota de Cadastro
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, cpf, data_nascimento, numero_cadsus, sexo, telefone, senha } = req.body;
    const userId = await userModel.inserirUsuario(nome, cpf, data_nascimento, numero_cadsus, sexo, telefone, senha);
    res.status(201).json({ message: 'Usuario Cadastrado com Sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  try {
    const usuario = await userModel.buscarUsuarioPorCPF(cpf);
    const isValid = await userModel.verificarSenha(usuario, senha);
    if (isValid) {
      const token = await autenticar(cpf, senha);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 dias de validade
      });
      res.status(200).send({ message: 'Autenticação bem-sucedida' });
    } else {
      res.status(400).send({ message: 'Senha incorreta' });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
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
  const user = await userModel.buscarUsuarioPorID(usuario.id);

  // Retorna as informações do usuário.
  res.status(200).send(user);
});

// Exporta o roteador para que possa ser usado em outros módulos da aplicação.
module.exports = router;
