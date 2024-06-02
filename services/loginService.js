// loginService.js

// Importações
const userModel = require('../models/userModel');
const { gerarToken } = require('../utils/jwtUtils');

// Função para autenticar um usuário
async function autenticar(cpf, senha) {
  // Verificar se o CPF e senha estão presentes na requisição
  if (!cpf || !senha) {
    throw new Error('CPF e senha são obrigatórios');
  }

  // Verificar se o CPF é válido
  const cpfValido = userModel.validarCPF(cpf);
  if (cpfValido) {
  } else {
    throw new Error('CPF inválido');
  }

  // Buscar usuário no banco de dados pelo CPF
  const usuario = await userModel.buscarUsuarioPorCPF(cpf);
  if (!usuario || !usuario[0]) {
    throw new Error('Usuário não encontrado');
  }

 // Verificar se a senha fornecida corresponde à senha do usuário
 const isValid = await userModel.verificarSenha(usuario, senha);
 if (isValid) {
   // Se a senha estiver correta, gera um token JWT para o usuário
   const id = usuario[0].id; // Obtém o ID do usuário
   const token = gerarToken(id); // Gera o token JWT com base no ID
   return token; // Retorna o token JWT
 } else {
   // Se a senha estiver incorreta, lança um erro
   throw new Error('Senha incorreta');
 }
}

// Exporta a função de autenticação para uso em outros módulos
module.exports = autenticar;
