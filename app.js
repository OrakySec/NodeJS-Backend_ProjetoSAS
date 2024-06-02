//app.js

// Importações
const express = require('express');
const router = require('express').Router();
const userController = require('./controllers/userController')
const agendarConsulta = require('./controllers/consultaController');
const multer = require('multer');
const imageController = require('./controllers/imageController');
const enderecoController = require('./controllers/enderecoController');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Cria uma instância do aplicativo Express
const app = express();

// Configuração do multer para armazenar a imagem
const storage = multer.memoryStorage();

// Create Multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  }
});

// Habilita o uso de JSON para analisar o corpo das requisições
app.use(express.json());

// Utiliza o cookie-parser para analisar os cookies nas requisições
app.use(cookieParser());

// Define as rotas para cada recurso
app.use('/users', userController);
app.use('/consulta', agendarConsulta)
app.use('/endereco', enderecoController)
app.post('/upload-image', upload.single('image'), imageController.uploadImage);

// Inicia o servidor Express e começa a escutar as requisições na porta definida
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = router;