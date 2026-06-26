const express = require('express');
const router = express.Router();

const pecaController = require('../controllers/pecaController');

const validarRequisicao = require("../middlewares/validadorSchema");
const idSchema = require("../schemas/idSchema");

const {pecaPostSchema, pecaPatchSchema} = require("../schemas/pecaSchema");

router.post('/pecas', validarRequisicao(pecaPostSchema), pecaController.criar);

router.get('/pecas', pecaController.listarTodas);

router.get('/pecas/:id', validarRequisicao(idSchema, "params"),  pecaController.buscarPorId);

router.patch('/pecas/:id', validarRequisicao(idSchema, "params"), validarRequisicao(pecaPatchSchema), pecaController.atualizar);

router.delete('/pecas/:id', pecaController.deletar);

module.exports = router;