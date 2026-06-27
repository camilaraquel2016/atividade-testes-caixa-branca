const pecaService = require('../services/pecaService');

class PecaController {

    async criar(req, res) {
        const novaPeca = await pecaService.criar(req.body);
        return res.status(201).json(novaPeca);
    }

    async listarTodas(req, res) {
        const filtros = req.query;
        const pecas = await pecaService.listarTodas(filtros);
        return res.status(200).json(pecas);
    }

    async buscarPorId(req, res) {
        const {id} = req.params;
        const peca = await pecaService.buscarPorId(id);
        return res.status(200).json(peca);
    }

    async atualizar(req, res) {
        const {id} = req.params;
        const dadosNovos = req.body;
        const pecaAtualizada = await pecaService.atualizar(id, dadosNovos);
        return res.status(200).json(pecaAtualizada);
    }

    async deletar(req, res) {
        const {id} = req.params;
        await pecaService.deletar(id);
        return res.status(204).end();
    }
}

module.exports = new PecaController();