const express = require('express');
const router = require('express').Router();
const userController = require('./controllers/userController')
const agendarConsulta = require('./controllers/consultaController');
const enderecoController = require('./controllers/enderecoController')
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/users', userController);
app.use('/consulta', agendarConsulta)
app.use('/endereco', enderecoController)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = router;