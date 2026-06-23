const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/', (req, res) => clienteController.criar(req, res));
router.get('/', (req, res) => clienteController.listar(req, res));

router.get('/:id', (req, res) => clienteController.buscarPorId(req, res));
router.put('/:id', (req, res) => clienteController.atualizar(req, res));
router.delete('/:id', (req, res) => clienteController.deletar(req, res));

module.exports = router;