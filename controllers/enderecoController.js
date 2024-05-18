
// Importações
const express = require('express');
const router = express.Router();
const db = require('../config/dbConnect');
const { verificarToken } = require('../utils/jwtUtils');

// Rota para inserir um novo endereço.
router.post('/inserir', verificarToken, async (req, res) => {
    // Extrai os dados do endereço do corpo da requisição.
    const { endereco, cep, bairro, complemento } = req.body;

    // Obtém o usuário autenticado do token.
    const usuario = req.usuario;

    // Verifica se o usuário está autenticado.
    if (!usuario) {
      return res.status(401).send({ message: 'Usuário não autenticado' });
    }

    // Verifica se todos os campos obrigatórios foram preenchidos.
    if (!endereco || !cep || !bairro || !complemento) {
      return res.status(400).send({ message: 'Por favor, preencha todos os campos' });
    }

    // Loga os dados que serão enviados ao banco de dados.
    console.log('Dados enviados para o banco de dados:', { id_usuario: usuario.id, endereco, cep, bairro, complemento });

    // Insere um novo endereço no banco de dados.
    await db.query('INSERT INTO endereco (id_usuario, endereco, cep, bairro, complemento) VALUES (?, ?, ?, ?, ?)', [usuario.id, endereco, cep, bairro, complemento]);

    // Retorna uma mensagem de sucesso.
    res.status(200).send({ message: 'Endereço inserido com sucesso' });
});

// Rota para exibir os endereços do usuário autenticado.
router.get('/exibir', verificarToken, async (req, res) => {
    // Obtém o usuário autenticado do token.
    const usuario = req.usuario;

    // Verifica se o usuário está autenticado.
    if (!usuario) {
      return res.status(401).send({ message: 'Usuário não autenticado' });
    }

    // Busca os endereços do usuário no banco de dados.
    const [endereco] = await db.query('SELECT * FROM endereco WHERE id_usuario = ?', [usuario.id]);

    // Retorna os endereços.
    res.status(200).send(endereco);
});

// Rota para alterar o último endereço do usuário autenticado.
router.put('/alterar', verificarToken, async (req, res) => {
    // Obtém o usuário autenticado do token.
    const usuario = req.usuario;

    // Verifica se o usuário está autenticado.
    if (!usuario) {
      return res.status(401).send({ message: 'Usuário não autenticado' });
    }

    // Extrai os dados do endereço do corpo da requisição.
    const { enderecoReq, cep, bairro, complemento } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos.
    if (!enderecoReq || !cep || !bairro || !complemento) {
      return res.status(400).send({ message: 'Por favor, preencha todos os campos' });
    }

    // Busca o último endereço do usuário no banco de dados.
    const endereco = await db.query('SELECT * FROM endereco WHERE id_usuario = ? ORDER BY id_endereco DESC LIMIT 1', [usuario.id]);
    if (!endereco[0]) {
      return res.status(404).send({ message: 'Nenhum endereço encontrado' });
    }

    // Obtém o ID do último endereço.
    const ultimoEndereco = endereco[0];
    const enderecoId = ultimoEndereco[0].id_endereco;

    // Atualiza o último endereço com os novos dados.
    await db.query('UPDATE endereco SET endereco = ?, cep = ?, bairro = ?, complemento = ? WHERE id_endereco = ?', [enderecoReq, cep, bairro, complemento, enderecoId]);

    // Retorna uma mensagem de sucesso.
    res.status(200).send({ message: 'Endereço alterado com sucesso' });
});

// Exporta o roteador para que possa ser usado em outros módulos da aplicação.
module.exports = router;
