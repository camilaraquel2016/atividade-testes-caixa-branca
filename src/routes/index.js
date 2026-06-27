const express = require('express');
const router = express.Router();

const categoriaRoutes = require('./categoriaRoutes');
const clienteRoutes = require('./clienteRoutes');
const pecaRoutes = require('./pecaRoutes');
const pedidoRoutes = require('./pedidoRoutes');

router.use('/categorias', categoriaRoutes);
router.use('/pecas', pecaRoutes);
router.use('/clientes', clienteRoutes);
router.use('/pedidos', pedidoRoutes);

module.exports = router;