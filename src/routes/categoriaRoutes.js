const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.post('/categorias', categoriaController.criar);

router.get('/categorias', categoriaController.listarTodos);

router.put('/categorias/:id', categoriaController.atualizar);

router.delete('/categorias/:id', categoriaController.deletar);

router.get('/categorias/:id', categoriaController.buscarPorId);

module.exports = router;
