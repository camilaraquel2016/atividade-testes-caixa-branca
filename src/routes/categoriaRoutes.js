const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

const validarRequisicao = require("../middlewares/validadorSchema");

const {categoriaPostSchema, categoriaPatchSchema} = require("../schemas/categoriaSchema");
const idSchema = require("../schemas/idSchema");

router.post('/', validarRequisicao(categoriaPostSchema), categoriaController.criar);

router.get('/', categoriaController.listarTodos);

router.patch('/:id', validarRequisicao(idSchema, "params"), validarRequisicao(categoriaPatchSchema), categoriaController.atualizar);

router.delete('/:id', validarRequisicao(idSchema, "params"), categoriaController.deletar);

router.get('/:id', validarRequisicao(idSchema, "params"), categoriaController.buscarPorId);

module.exports = router;
