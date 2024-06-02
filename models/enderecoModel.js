const db = require('../config/dbConnect');

class EnderecoModel {
  async create(endereco, usuario) {
    try {
      await db.query('INSERT INTO endereco (id_usuario, endereco, cep, bairro, complemento) VALUES (?, ?, ?, ?, ?)', [usuario.id, endereco.endereco, endereco.cep, endereco.bairro, endereco.complemento]);
      return { message: 'Endereço inserido com sucesso' };
    } catch (error) {
      throw new Error('Erro ao inserir endereço');
    }
  }

  async findByUser(usuario) {
    try {
      const enderecos = await db.query('SELECT * FROM endereco WHERE id_usuario = ? ORDER BY id_endereco DESC', [usuario.id]);
      return enderecos[0];
    } catch (error) {
      throw new Error('Erro ao buscar endereços');
    }
  }

  async updateLastAddress(endereco, usuario) {
    try {
      const enderecoExistente = await db.query('SELECT * FROM endereco WHERE id_usuario =? ORDER BY id_endereco DESC LIMIT 1', [usuario.id]);
      if (enderecoExistente[0]) {
        const enderecoId = enderecoExistente[0].id_endereco;
        await db.query('UPDATE endereco SET endereco =?, cep =?, bairro =?, complemento =? WHERE id_endereco =?', [
          endereco.endereco,
          endereco.cep,
          endereco.bairro,
          endereco.complemento,
          enderecoId
        ]);
        return { message: 'Endereço atualizado com sucesso' };
      } else {
        const novoEndereco = await db.query('INSERT INTO endereco SET ?', [
          {
            id_usuario: usuario.id,
            endereco: endereco.endereco,
            cep: endereco.cep,
            bairro: endereco.bairro,
            complemento: endereco.complemento
          }
        ]);
        return { message: 'Endereço inserido com sucesso' };
      }
    } catch (error) {
      throw new Error('Erro ao atualizar endereço');
    }
  }
}
module.exports = new EnderecoModel();