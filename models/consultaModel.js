// consultaModel.js

const db = require('../config/dbConnect');

// Função para agendar uma consulta.
async function agendarConsulta(usuarioId, data_consulta, horario_consulta, tipo_consulta) {
  await db.query('INSERT INTO consultas (id_usuario, data_consulta, horario_consulta, tipo_consulta) VALUES (?, ?, ?, ?)', [usuarioId, data_consulta, horario_consulta, tipo_consulta]);
}

// Função para exibir todas as consultas do usuário autenticado.
async function exibirTodasConsultas(usuarioId) {
  const [consultas] = await db.query('SELECT * FROM consultas WHERE id_usuario = ?', [usuarioId]);
  return consultas;
}

// Função para exibir a última consulta do usuário autenticado.
async function exibirUltimaConsulta(usuarioId) {
  const [consulta] = await db.query('SELECT * FROM consultas WHERE id_usuario = ? ORDER BY id_consulta DESC LIMIT 1', [usuarioId]);
  return consulta;
}

// Função para alterar a última consulta do usuário autenticado.
async function alterarUltimaConsulta(usuarioId, data_consulta, horario_consulta, tipo_consulta) {
  const consulta = await exibirUltimaConsulta(usuarioId);
  if (!consulta[0]) {
    throw new Error('Nenhuma consulta encontrada');
  }

  const consultaId = consulta[0].id_consulta;
  await db.query('UPDATE consultas SET data_consulta = ?, horario_consulta = ?, tipo_consulta = ? WHERE id_consulta = ?', [data_consulta, horario_consulta, tipo_consulta, consultaId]);
}

// Função para cancelar a última consulta do usuário autenticado.
async function cancelarUltimaConsulta(usuarioId) {
  const consulta = await exibirUltimaConsulta(usuarioId);
  if (!consulta[0]) {
    throw new Error('Nenhuma consulta encontrada');
  }

  const consultaId = consulta[0].id_consulta;
  await db.query('DELETE FROM consultas WHERE id_consulta = ?', [consultaId]);
}

module.exports = {
  agendarConsulta,
  exibirTodasConsultas,
  exibirUltimaConsulta,
  alterarUltimaConsulta,
  cancelarUltimaConsulta,
};