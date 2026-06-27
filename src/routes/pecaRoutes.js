const express = require('express');
const router = express.Router();

const pecaController = require('../controllers/pecaController');

const validarRequisicao = require("../middlewares/validadorSchema");
const idSchema = require("../schemas/idSchema");

const {pecaPostSchema, pecaPatchSchema} = require("../schemas/pecaSchema");

router.post('/', validarRequisicao(pecaPostSchema), pecaController.criar);

router.get('/', pecaController.listarTodas);

router.get('/:id', validarRequisicao(idSchema, "params"),  pecaController.buscarPorId);

router.patch('/:id', validarRequisicao(idSchema, "params"), validarRequisicao(pecaPatchSchema), pecaController.atualizar);

router.delete('/:id', validarRequisicao(idSchema, "params"), pecaController.deletar);

module.exports = router;