const clienteService = require('../services/clienteService');

class ClienteController {

    async criar(req, res) {
        const { nome, cpf, telefone } = req.body;
        const novoCliente = await clienteService.criar({ nome, cpf, telefone });
        return res.status(201).json(novoCliente);
    }

    async listar(req, res) {
        const filtros = req.query;
        const clientes = await clienteService.listar(filtros);
        return res.status(200).json(clientes);
    }

    async buscarPorId(req, res) {
        const { id } = req.params;
        const clienteEncontrado = await clienteService.buscarPorId(id);
        return res.status(200).json(clienteEncontrado);
    }

    async atualizar(req, res) {
        const { id } = req.params;
        const { nome, telefone, cpf } = req.body;
        const clienteAtualizado = await clienteService.atualizar(id, { nome, telefone, cpf });
        return res.status(200).json(clienteAtualizado);
    }

    async deletar(req, res) {
        const { id } = req.params;
        await clienteService.deletar(id);
        return res.status(204).send();
    }
}

module.exports = new ClienteController();