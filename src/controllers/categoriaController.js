const categoriaService = require('../services/categoriaService');

class CategoriaController {

    async criar(req, res) {
        const {nome} = req.body;
        const novaCategoria = await categoriaService.criar(nome);
        return res.status(201).json(novaCategoria);
    }

    async listarTodos(req, res) {
        const categorias = await categoriaService.listarTodos();
        return res.status(200).json(categorias);
    }

    async atualizar(req, res) {
        const {id} = req.params;
        const {nome} = req.body;    
        const categoriaAtualizada = await categoriaService.atualizar(id, nome);
        return res.status(200).json(categoriaAtualizada);
    }

    async deletar(req, res) {
        const {id} = req.params;
        await categoriaService.deletar(id);
        return res.status(204).send();
    }

    async buscarPorId(req, res) {
        const {id} = req.params;
        const categoriaEncontrada = await categoriaService.buscarPorId(id);
        return res.status(200).json(categoriaEncontrada);
    }
    
}

module.exports = new CategoriaController();