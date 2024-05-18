const express = require('express');
// const morgan = require('morgan')
const userController = require('./controllers/userController')
const agendarConsulta = require('./controllers/consultaController');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use(morgan('dev'));

app.use('/users', userController);
app.use('/consulta', agendarConsulta)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});