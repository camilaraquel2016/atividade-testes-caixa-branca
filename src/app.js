const express = require('express');
require('dotenv').config();
const categoriaRoutes = require('./routes/categoriaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const pecaRoutes = require('./routes/pecaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes')
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
app.use(pecaRoutes);

app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.use(errorMiddleware);

module.exports = app;