const pedidoService = require('../services/pedidoService');

class PedidoController {

    async criar(req, res) {
        const novoPedido = await pedidoService.criar(req.body);
        res.status(201).json(novoPedido);
    }

    async listar(req, res) {
        const filtros = { situacao: req.query.situacao };
        const pedidos = await pedidoService.listar(filtros);
        res.status(200).json(pedidos);
    }

    async buscarPorId(req, res) {
        const { id } = req.params; 
        const pedido = await pedidoService.buscarPorId(id);
        res.status(200).json(pedido);
    }

    async atualizarStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body; 
        const pedidoAtualizado = await pedidoService.atualizarStatus(id, status);
        res.status(200).json(pedidoAtualizado);
    }

    async deletar(req, res) {
        const { id } = req.params;
        await pedidoService.deletar(id);
        res.status(204).send();
    }
}

module.exports = new PedidoController();