
// Importações
const express = require('express');
const router = express.Router();
const db = require('../config/dbConnect');
const { verificarToken } = require('../utils/jwtUtils');
const consultaModel = require('../models/consultaModel')

// Rota para agendar uma consulta.
router.post('/agendar', verificarToken, async (req, res) => {
  // Loga o usuário autenticado.

  // Extrai os dados da consulta do corpo da requisição.
  const { data_consulta, horario_consulta, tipo_consulta } = req.body;

  // Obtém o usuário autenticado do token.
  const usuario = req.usuario;

  // Verifica se o usuário está autenticado.
  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  // Verifica se todos os campos obrigatórios foram preenchidos.
  if (!data_consulta || !horario_consulta || !tipo_consulta) {
    return res.status(400).send({ message: 'Por favor, preencha todos os campos' });
  }


  // Agenda a consulta no banco de dados.
  await consultaModel.agendarConsulta(usuario.id, data_consulta, horario_consulta, tipo_consulta);

  // Retorna uma mensagem de sucesso.
  res.status(200).send({ message: 'Consulta agendada com sucesso' });
});

// Rota para exibir todas as consultas do usuário autenticado.
router.get('/exibirTodas', verificarToken, async (req, res) => {
  // Obtém o usuário autenticado do token.
  const usuario = req.usuario;

  // Verifica se o usuário está autenticado.
  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  // Busca todas as consultas do usuário no banco de dados.
  const consultas = await consultaModel.exibirTodasConsultas(usuario.id);

  // Retorna todas as consultas.
  res.status(200).send(consultas);
});

// Rota para exibir a última consulta do usuário autenticado.
router.get('/exibirUltima', verificarToken, async (req, res) => {
  // Obtém o usuário autenticado do token.
  const usuario = req.usuario;

  // Verifica se o usuário está autenticado.
  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  // Busca a última consulta do usuário no banco de dados.
  const consulta = await consultaModel.exibirUltimaConsulta(usuario.id);

  // Retorna a última consulta.
  res.status(200).send(consulta);
});

// Rota para alterar a última consulta do usuário autenticado.
router.put('/alterarUltimaConsulta', verificarToken, async (req, res) => {
  // Obtém o usuário autenticado do token.
  const usuario = req.usuario;

  // Verifica se o usuário está autenticado.
  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  // Extrai os dados da consulta do corpo da requisição.
  const { data_consulta, horario_consulta, tipo_consulta } = req.body;

  // Verifica se todos os campos obrigatórios foram preenchidos.
  if (!data_consulta || !horario_consulta || !tipo_consulta) {
    return res.status(400).send({ message: 'Por favor, preencha todos os campos' });
  }

  // Altera a última consulta do usuário no banco de dados.
  await consultaModel.alterarUltimaConsulta(usuario.id, data_consulta, horario_consulta, tipo_consulta);

  // Retorna uma mensagem de sucesso.
  res.status(200).send({ message: 'Consulta alterada com sucesso' });
});

// Rota para cancelar a última consulta do usuário autenticado.
router.delete('/cancelarUltimaConsulta', verificarToken, async (req, res) => {
  // Obtém o usuário autenticado do token.
  const usuario = req.usuario;

  // Verifica se o usuário está autenticado.
  if (!usuario) {
    return res.status(401).send({ message: 'Usuário não autenticado' });
  }

  // Busca a última consulta do usuário no banco de dados.
  const consulta = await db.query('SELECT * FROM consultas WHERE id_usuario = ? ORDER BY id_consulta DESC LIMIT 1', [usuario.id]);
  if (!consulta[0]) {
    return res.status(404).send({ message: 'Nenhuma consulta encontrada' });
  }

  // Obtém o ID da última consulta.
  const ultimaConsulta = consulta[0];
  const consultaId = ultimaConsulta[0].id_consulta;

  // Deleta a última consulta do banco de dados.
  await db.query('DELETE FROM consultas WHERE id_consulta = ?', [consultaId]);

  // Retorna uma mensagem de sucesso.
  res.status(200).send({ message: 'Consulta deletada com sucesso' });
});

// Exporta o roteador para que possa ser usado em outros módulos da aplicação.
module.exports = router;
