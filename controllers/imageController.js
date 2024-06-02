//imageController.js

const multer = require('multer');
const jwtUtils = require('../utils/jwtUtils');
const { atualizarImagemDoUsuario } = require('../models/imageModels')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImage = async (req, res) => {
  try {
    jwtUtils.verificarToken(req, res, async () => {
      upload.single('image')(req, res, async () => {
        if (!req.file) {
          return res.status(400).send({ message: 'Imagem não enviada' });
        }

        const userId = req.usuario.id;
        const image = req.file.buffer;

        const result = await atualizarImagemDoUsuario(userId, image);
        

        res.status(201).send({ message: 'Imagem enviada com sucesso!' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao enviar imagem' });
  }
};

module.exports = { uploadImage };