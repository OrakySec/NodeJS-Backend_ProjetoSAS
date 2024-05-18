-- Criação do banco de dados
CREATE DATABASE sas_sistema_agendamento;

-- Seleciona o banco de dados criado
USE sas_sistema_agendamento;

-- Criação da tabela users
CREATE TABLE users (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(15) NOT NULL UNIQUE,
    data_nascimento VARCHAR(10) NOT NULL,
    numero_cadsus VARCHAR(20) NOT NULL UNIQUE,
    sexo VARCHAR(10) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    foto_perfil LONGBLOB
);

-- Criação da tabela consultas
CREATE TABLE consultas (
    id_consulta INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_usuario BIGINT,
    data_consulta VARCHAR(10),
    horario_consulta VARCHAR(8),
    tipo_consulta VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES users(id)
);

-- Criação da tabela endereco
CREATE TABLE endereco (
    id_usuario BIGINT,
    endereco VARCHAR(255),
    cep VARCHAR(10),
    bairro VARCHAR(50),
    complemento VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES users(id)
);
