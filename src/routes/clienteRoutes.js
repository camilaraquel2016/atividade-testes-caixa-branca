const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');

const validarRequisicao = require('../middlewares/validadorSchema')

const { clientePostSchema, clientePatchSchema } = require('../schemas/clienteSchema');
const idSchema = require("../schemas/idSchema");

router.post('/', validarRequisicao(clientePostSchema, "body"), clienteController.criar);

router.get('/', clienteController.listar);

router.patch('/:id', validarRequisicao(idSchema, "params"), validarRequisicao(clientePatchSchema, "body"), clienteController.atualizar);

router.get('/:id', validarRequisicao(idSchema, "params"), clienteController.buscarPorId);

router.delete('/:id', validarRequisicao(idSchema, "params"), clienteController.deletar);

module.exports = router;