// Importa a biblioteca mysql2/promise, que permite usar promessas com MySQL.
const mysql = require('mysql2/promise');

// Cria um pool de conexões com o banco de dados usando as configurações fornecidas.
const db = mysql.createPool({
  // Define o host do banco de dados. 'localhost' significa que o banco de dados está rodando na mesma máquina onde este código está sendo executado.
  host: 'localhost',
  
  // Define o usuário do banco de dados. 'root' é o usuário padrão do MySQL, geralmente usado para administração.
  user: 'root',
  
  // Define a senha do banco de dados. 'root' é uma senha comum usada em ambientes de desenvolvimento, mas não é segura para produção.
  password: 'root',
  
  // Define o nome do banco de dados ao qual este pool de conexões vai se conectar.
  database: 'sas_sistema_agendamento'
});

// Exporta o pool de conexões para que ele possa ser usado em outros módulos da aplicação.
module.exports = db;
