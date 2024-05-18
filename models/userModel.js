
// Importa a conexão com o banco de dados
const db = require('../config/dbConnect');

// Função para buscar um usuário pelo CPF no banco de dados
function buscarUsuarioPorCPF(cpf) {
  // Função interna para buscar o usuário no banco de dados de forma assíncrona
  async function buscarUsuarioNoBanco(cpf) {
    try {
      // Executa uma query no banco de dados para buscar o usuário pelo CPF
      const usuario = await db.query('SELECT * FROM users WHERE cpf = ?', [cpf]);
      return usuario[0]; // Retorna o primeiro usuário encontrado (ou null se não encontrado)
    } catch (error) {
      console.error(error); // Registra qualquer erro no console
      return null; // Retorna null em caso de erro
    }
  }
  // Chama a função interna para buscar o usuário no banco de dados e retorna sua promise
  return buscarUsuarioNoBanco(cpf);
}

// Função para validar um CPF
function validarCPF(cpf) {
  // Remove caracteres não numéricos do CPF
  cpf = cpf.replace(/[^0-9]/g, '');

  // Verifica se o CPF possui 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (cpf.split('').every(d => d === cpf[0])) {
    return false;
  }

  // Calcula os dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let digito1 = 11 - (soma % 11);
  if (digito1 > 9) {
    digito1 = 0;
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  let digito2 = 11 - (soma % 11);
  if (digito2 > 9) {
    digito2 = 0;
  }

  // Verifica se os dígitos calculados são iguais aos dígitos finais do CPF
  return cpf[9] === String(digito1) && cpf[10] === String(digito2);
}

// Função para verificar se a senha fornecida corresponde à senha do usuário
function verificarSenha(usuario, senha) {
  return usuario === senha; // Simples comparação entre a senha do usuário e a senha fornecida
}

// Exporta as funções para uso em outros módulos
module.exports = {
  buscarUsuarioPorCPF,
  validarCPF,
  verificarSenha
};
