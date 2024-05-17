const express = require('express');
const router = express.Router();
const db = require('../config/dbConnect');
const { verificarToken } = require('../utils/jwtUtils');

router.post('/agendar', verificarToken, async (req, res) => {
  console.log('req.usuario:', req.usuario);
  const { data_consulta, horario_consulta, tipo_consulta } = req.body;
  const usuario = req.usuario;

  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  if (!data_consulta || !horario_consulta || !tipo_consulta) {
    return res.status(400).send({ message: 'Por favor, preencha todos os campos' });
  }
  console.log('Dados enviados para o banco de dados:', { id_usuario: usuario.id, data_consulta, horario_consulta, tipo_consulta });

  await db.query('INSERT INTO consultas (id_usuario, data_consulta, horario_consulta, tipo_consulta) VALUES (?, ?, ?, ?)', [usuario.id, data_consulta, horario_consulta, tipo_consulta]);

  res.status(200).send({ message: 'Consulta agendada com sucesso' });
});

router.get('/exibirTodas', verificarToken, async (req, res) => {
  const usuario = req.usuario;

  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  const consultas = await db.query('SELECT * FROM consultas WHERE id_usuario = ?', [usuario.id]);

  res.status(200).send(consultas);
});

router.get('/exibirUltima', verificarToken, async (req, res) => {
  const usuario = req.usuario;

  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  const consulta = await db.query('SELECT * FROM consultas WHERE id_usuario = ? ORDER BY id_consulta DESC LIMIT 1', [usuario.id]);

  res.status(200).send(consulta);
});

module.exports = router;