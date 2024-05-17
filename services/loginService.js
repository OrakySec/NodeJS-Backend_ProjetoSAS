// loginService.js
const userModel = require('../models/userModel');
const { gerarToken } = require('../utils/jwtUtils');

async function autenticar(cpf, senha) {
  // Verificar se o CPF e senha estão presentes na requisição
  if (!cpf || !senha) {
    throw new Error('CPF e senha são obrigatórios');
  }

  // Verificar se o CPF é válido
  const cpfValido = userModel.validarCPF(cpf);
  if (!cpfValido) {
    throw new Error('CPF inválido');
  }

  // Buscar usuário no banco de dados
  const usuario = userModel.buscarUsuarioPorCPF(cpf);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  // Verificar se a senha está correta
  const senhaCorreta = userModel.verificarSenha(senha, usuario.senha);
  if (!senhaCorreta) {
    throw new Error('Senha incorreta');
  }

  const token = gerarToken(cpf);
  return token;
}

module.exports = autenticar;