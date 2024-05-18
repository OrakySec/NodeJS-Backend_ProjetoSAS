const express = require('express');
const router = express.Router();
const db = require('../config/dbConnect');
const { verificarToken } = require('../utils/jwtUtils');

router.post('/inserir', verificarToken, async (req, res) => {
    const { endereco, cep, bairro, complemento } = req.body;
    const usuario = req.usuario;
  
    if (!usuario) {
      return res.status(401).send({ message: 'Usuário não autenticado' });
    }
  
    if (!endereco || !cep || !bairro || !complemento) {
      return res.status(400).send({ message: 'Por favor, preencha todos os campos' });
    }
    console.log('Dados enviados para o banco de dados:', { id_usuario: usuario.id, endereco, cep, bairro, complemento });
  
    await db.query('INSERT INTO endereco (id_usuario, endereco, cep, bairro, complemento) VALUES (?, ?, ?, ?, ?)', [usuario.id, endereco, cep, bairro, complemento]);
  
    res.status(200).send({ message: 'Consulta agendada com sucesso' });
  });

  router.get('/exibir', verificarToken, async (req, res) => {
    const usuario = req.usuario;
  
    if (!usuario) {
      return res.status(401).send({ message: 'Usuário não autenticado' });
    }
  
    const [endereco] = await db.query('SELECT * FROM endereco WHERE id_usuario = ?', [usuario.id]);
  
    res.status(200).send(endereco);
  });

  router.put('/alterar', verificarToken, async (req, res) => {
    const usuario = req.usuario;
  
    if (!usuario) {
      return res.status(401).send({ message: 'Usuário não autenticado' });
    }
  
    const { enderecoReq, cep, bairro, complemento } = req.body;
  
    if (!enderecoReq || !cep || !bairro || !complemento) {
      return res.status(400).send({ message: 'Por favor, preencha todos os campos' });
    }
  
    const endereco = await db.query('SELECT * FROM endereco WHERE id_usuario = ? ORDER BY id_endereco DESC LIMIT 1', [usuario.id]);
    if (!endereco[0]) {
      return res.status(404).send({ message: 'Nenhum endereço encontrado' });
    }
  
    console.log(endereco)
    const ultimoEndereco = endereco[0];
    const enderecoId = ultimoEndereco[0].id_endereco;
    console.log('ID da Consulta:',enderecoId)
  
    await db.query('UPDATE endereco SET endereco = ?, cep = ?, bairro = ?, complemento = ? WHERE id_endereco = ?', [enderecoReq, cep, bairro, complemento, enderecoId]);
  
    res.status(200).send({ message: 'Endereco alterado com sucesso' });
  });

  module.exports = router;