const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');

const validarRequisicao = require('../middlewares/validadorSchema')

const { pedidoPostSchema, pedidoQuerySchema } = require('../schemas/pedidoSchema');

router.post('/', validarRequisicao(pedidoPostSchema, "body"), pedidoController.criar);

router.get('/', validarRequisicao(pedidoQuerySchema, "query"), pedidoController.listar);

router.get('/:id', pedidoController.buscarPorId);

router.patch('/:id', pedidoController.atualizarStatus);

router.delete('/:id', pedidoController.deletar);

module.exports = router;