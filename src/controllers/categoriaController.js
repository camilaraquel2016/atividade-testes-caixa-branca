const categoriaService = require('../services/categoriaService');

class CategoriaController {

    async criar(req, res) {
        try {
            const {nome} = req.body;

            const novaCategoria = await categoriaService.criar(nome);

            return res.status(201).json(novaCategoria);
        }
        catch (error) {
            const status = error.statusCode || 500;
            return res.status(status).json({erro : error.message});
        }
    }

    async listarTodos(req, res) {
        try {
            const categorias = await categoriaService.listarTodos();

            return res.status(200).json(categorias);
        }
        catch (error) {
            const status = error.statusCode || 500;
            return res.status(status).json({erro: error.message});
        }
    }

    async atualizar(req, res) {
        try {
            const {id} = req.params;
            const {nome} = req.body;
            
            const categoriaAtualizada = await categoriaService.atualizar(id, nome);

            return res.status(200).json(categoriaAtualizada);
        }
        catch (error) {
            const status = error.statusCode || 500;
            return res.status(status).json({erro: error.message});
        }
    }

    async deletar(req, res) {
        try {
            const {id} = req.params;

            await categoriaService.deletar(id);

            return res.status(204).send();
        }
        catch (error) {
            const status = error.statusCode || 500;
            return res.status(status).json({erro: error.message});
        }
    }

    async buscarPorId(req, res) {
        try {
            const {id} = req.params;

            const categoriaEncontrada = await categoriaService.buscarPorId(id);

            return res.status(200).json(categoriaEncontrada);
        }
        catch (error) {
            const status = error.statusCode || 500;
            return res.status(status).json({erro: error.message});
        }
    }
    
}

module.exports = new CategoriaController();