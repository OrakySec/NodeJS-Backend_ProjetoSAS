//imageController.js

const multer = require('multer');
const jwtUtils = require('../utils/jwtUtils');
const db = require('../config/dbConnect');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImage = async (req, res) => {
  try {
    jwtUtils.verificarToken(req, res, async () => {
      upload.single('image')(req, res, async () => {
        console.log(req.file);
        if (!req.file) {
          return res.status(400).send({ message: 'Imagem não enviada' });
        }

        const userId = req.usuario.id;
        const image = req.file.buffer;

        // Atualiza a coluna foto_perfil da tabela users com a imagem enviada
        const [result] = await db.execute('UPDATE users SET foto_perfil = ? WHERE id = ?', [image, userId]);

        res.status(201).send({ message: 'Imagem enviada com sucesso!' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao enviar imagem' });
  }
};

module.exports = { uploadImage };