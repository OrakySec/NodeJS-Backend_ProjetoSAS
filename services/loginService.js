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
  if (cpfValido) {
    console.log('CPF Validado', cpf)
  } else {
    throw new Error('CPF inválido');
  }

  // Buscar usuário no banco de dados
  const usuario = await userModel.buscarUsuarioPorCPF(cpf);
  if (!usuario || !usuario[0]) {
    throw new Error('Usuário não encontrado');
  }

  if (userModel.verificarSenha(senha, usuario[0].senha)) {
    const id = usuario[0].id;
    const token = gerarToken(id);
    return token;
  } else {
    throw new Error('Senha incorreta');
  }
}

module.exports = autenticar;