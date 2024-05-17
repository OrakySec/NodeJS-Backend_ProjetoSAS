const express = require('express');
const router = express.Router();
const autenticar = require('../services/loginService');
const db = require('../config/dbConnect');
const userModel = require('../models/userModel')


// Aqui estamos definindo uma rota POST chamada /login usando o objeto router do Express. 
// Quando uma requisição POST é feita para /login, a função de callback é executada.

// Essa função tem dois parâmetros: req (a requisição) e res (a resposta),
// que representam respectivamente os objetos de requisição e resposta do Express.
router.post('/login', async (req, res) => {
  // Esta linha utiliza a desestruturação para extrair as propriedades
  // cpf e senha do corpo da requisição (req.body).
  const { cpf, senha } = req.body;

  try {
    // Utiliza-se o método buscarUsuarioPorCPF do modelo userModel para encontrar o 
    // usuário com base no CPF fornecido na requisição.
    const usuario = await userModel.buscarUsuarioPorCPF(cpf);
  
    // Após encontrar o usuário com sucesso, o ID do usuário é extraído do objeto usuario.
    // Esse ID provavelmente será usado para gerar o token JWT mais tarde.
    const id = usuario.id;

    const token = await autenticar( cpf, senha, id );
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    res.status(200).send({ message: 'Autenticação bem-sucedida' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post('/cadastro', async (req, res) => {
  try {
    const { nome, cpf, data_nascimento, numero_cadsus, sexo, telefone, senha } = req.body;
    const query = 'INSERT INTO users (nome, cpf, data_nascimento, numero_cadsus, sexo, telefone, senha) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [nome, cpf, data_nascimento, numero_cadsus, sexo, telefone, senha];
    const result = await db.execute(query, values);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

module.exports = router;