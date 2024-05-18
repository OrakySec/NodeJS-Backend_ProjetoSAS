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

  const [consultas] = await db.query('SELECT * FROM consultas WHERE id_usuario = ?', [usuario.id]);

  res.status(200).send(consultas);
});

router.get('/exibirUltima', verificarToken, async (req, res) => {
  const usuario = req.usuario;

  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  const [consulta] = await db.query('SELECT * FROM consultas WHERE id_usuario = ? ORDER BY id_consulta DESC LIMIT 1', [usuario.id]);

  res.status(200).send(consulta);
});

router.put('/alterarUltimaConsulta', verificarToken, async (req, res) => {
  const usuario = req.usuario;

  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  const { data_consulta, horario_consulta, tipo_consulta } = req.body;

  if (!data_consulta || !horario_consulta || !tipo_consulta) {
    return res.status(400).send({ message: 'Por favor, preencha todos os campos' });
  }

  const consulta = await db.query('SELECT * FROM consultas WHERE id_usuario = ? ORDER BY id_consulta DESC LIMIT 1', [usuario.id]);
  if (!consulta[0]) {
    return res.status(404).send({ message: 'Nenhuma consulta encontrada' });
  }

  console.log(consulta)
  const ultimaConsulta = consulta[0];
  const consultaId = ultimaConsulta[0].id_consulta;
  console.log('ID da Consulta:',consultaId)

  await db.query('UPDATE consultas SET data_consulta = ?, horario_consulta = ?, tipo_consulta = ? WHERE id_consulta = ?', [data_consulta, horario_consulta, tipo_consulta, consultaId]);

  res.status(200).send({ message: 'Consulta alterada com sucesso' });
});

router.delete('/cancelarUltimaConsulta', verificarToken, async (req, res) => {
  const usuario = req.usuario;

  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  const consulta = await db.query('SELECT * FROM consultas WHERE id_usuario = ? ORDER BY id_consulta DESC LIMIT 1', [usuario.id]);
  if (!consulta[0]) {
    return res.status(404).send({ message: 'Nenhuma consulta encontrada' });
  }
  const ultimaConsulta = consulta[0];
  const consultaId = ultimaConsulta[0].id_consulta;
  console.log('ID da Consulta:', consultaId);

  await db.query('DELETE FROM consultas WHERE id_consulta = ?', [consultaId]);

  res.status(200).send({ message: 'Consulta deletada com sucesso' });
});

module.exports = router;