const express = require('express');
const router = express.Router();
const autenticar = require('../services/loginService');
const db = require('../config/dbConnect');
const userModel = require('../models/userModel')



router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  console.log('Step 01: Extrai as propriedades CPF e Senha do req.body = ', req.body)

  try {
    const token = await autenticar(cpf, senha);
    const usuario = await userModel.buscarUsuarioPorCPF(cpf);
    console.log('Step 02: Usuario encontrado: ', usuario)
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