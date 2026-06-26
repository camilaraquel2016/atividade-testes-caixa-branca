const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

const validarRequisicao = require("../middlewares/validadorSchema");

const {categoriaPostSchema, categoriaPatchSchema} = require("../schemas/categoriaSchema");
const idSchema = require("../schemas/idSchema");

router.post('/categorias', validarRequisicao(categoriaPostSchema), categoriaController.criar);

router.get('/categorias', categoriaController.listarTodos);

router.patch('/categorias/:id', validarRequisicao(idSchema, "params"), validarRequisicao(categoriaPatchSchema), categoriaController.atualizar);

router.delete('/categorias/:id', validarRequisicao(idSchema, "params"), categoriaController.deletar);

router.get('/categorias/:id', validarRequisicao(idSchema, "params"), categoriaController.buscarPorId);

module.exports = router;
