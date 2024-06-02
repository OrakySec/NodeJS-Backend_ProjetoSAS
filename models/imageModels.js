//imageModels.js

const db = require('../config/dbConnect');

async function atualizarImagemDoUsuario(userId, image) {
  const [result] = await db.execute('UPDATE users SET foto_perfil = ? WHERE id = ?', [image, userId]);
  return result;
}

module.exports = { atualizarImagemDoUsuario };