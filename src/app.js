const express = require('express');
require('dotenv').config();
const categoriaRoutes = require('./routes/categoriaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const pool = require('./config/database');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        mensagem: "API de Vendas inicializada",
    });
});

app.use(categoriaRoutes);

app.use('/api/clientes', clienteRoutes);

app.use(errorMiddleware);

module.exports = app;