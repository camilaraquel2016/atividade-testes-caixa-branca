const express = require('express');
require('dotenv').config();

const pool = require('./config/database');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        mensagem: "API de Vendas inicializada",
    });
});

module.exports = app;