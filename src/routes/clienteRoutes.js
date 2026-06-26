const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController')

const validarRequisicao = require('../middlewares/validadorSchema')

const { clientePostSchema, clientePatchSchema } = require('../schemas/clienteSchema');

router.post('/', validarRequisicao(clientePostSchema, "body"), clienteController.criar);

router.get('/', (req, res) => clienteController.listar(req, res));

router.patch('/:id', validarRequisicao(clientePatchSchema, "body"), clienteController.atualizar);

router.get('/:id', (req, res) => clienteController.buscarPorId(req, res));

router.delete('/:id', (req, res) => clienteController.deletar(req, res));

module.exports = router;