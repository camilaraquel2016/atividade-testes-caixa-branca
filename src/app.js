const express = require('express');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        mensagem: "API de Vendas inicializada",
    });
});

app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;