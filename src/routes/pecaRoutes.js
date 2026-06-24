const express = require('express');
const router = express.Router();
const pecaController = require('../controllers/pecaController');

router.post('/pecas', pecaController.criar);

router.get('/pecas', pecaController.listarTodas);

router.get('/pecas/:id', pecaController.buscarPorId);

router.patch('/pecas/:id', pecaController.atualizar);

router.delete('/pecas/:id', pecaController.deletar);

module.exports = router;