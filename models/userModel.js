const db = require('../config/dbConnect');

function buscarUsuarioPorCPF(cpf) {
      async function buscarUsuarioNoBanco(cpf) {
        try {
          const usuario = await db.query('SELECT * FROM users WHERE cpf = ?', [cpf]);
          return usuario[0];
        } catch (error) {
          console.error(error);
          return null;
        }
      }
      return buscarUsuarioNoBanco(cpf);
    }

// Funções auxiliares
function validarCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^0-9]/g, '');

  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (cpf.split('').every(d => d === cpf[0])) {
    return false;
  }

  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let digito1 = 11 - (soma % 11);
  if (digito1 > 9) {
    digito1 = 0;
  }

  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  let digito2 = 11 - (soma % 11);
  if (digito2 > 9) {
    digito2 = 0;
  }

  // Verifica se os dígitos verificadores são iguais aos dígitos finais do CPF
  return cpf[9] === String(digito1) && cpf[10] === String(digito2);
}

function verificarSenha(usuario, senha) {
  return usuario === senha;
}


// Exportar as funções
module.exports = {
  buscarUsuarioPorCPF,
  validarCPF,
  verificarSenha
};