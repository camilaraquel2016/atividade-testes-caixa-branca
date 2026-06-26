const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');

const validarRequisicao = require('../middlewares/validadorSchema')

const { pedidoPostSchema, pedidoQuerySchema } = require('../schemas/pedidoSchema');
const idSchema = require("../schemas/idSchema");

router.post('/', validarRequisicao(pedidoPostSchema, "body"), pedidoController.criar);

router.get('/', validarRequisicao(pedidoQuerySchema, "query"), pedidoController.listar);

router.get('/:id', validarRequisicao(idSchema, "params"), pedidoController.buscarPorId);

router.patch('/:id/status', validarRequisicao(idSchema, "params"), pedidoController.atualizarStatus);

router.delete('/:id', validarRequisicao(idSchema, "params"), pedidoController.deletar);

module.exports = router;