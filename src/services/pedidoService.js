const pedidoRepository = require('../repositories/pedidoRepository');
const pecaRepository = require('../repositories/pecaRepository');
const clienteRepository = require('../repositories/clienteRepository');
const pecaService = require('./pecaService');
const servicesValidador = require('./servicesValidator');
const crypto = require('crypto');
const DbConstraints = require("../constants/dbConstraints");
const { withMappedError } = require("../utils/errorHelper");

class PedidoService {

    async #estornarEstoque(pedido) {
        for (const item of pedido.itens) {
            const peca = await pecaService.buscarPorId(item.peca_id);

            const novoEstoque = peca.qtd_estoque + item.quantidade;

            await pecaService.atualizar(item.peca_id, { qtd_estoque: novoEstoque });
        }
    }

    async criar(dadosPedido) {
        const { cliente_id, itens } = dadosPedido;

        const cliente = await clienteRepository.findById(cliente_id);

        if (!cliente) {
            const error = new Error("O cliente informado não existe.");
            error.statusCode = 404;
            throw error;
        }

        let valorTotalPedido = 0;
        const listaItensProcessados = [];

        for (const item of itens) {
           
            const peca = await pecaRepository.findById(item.peca_id);

            if (!peca || peca.situacao === 'INATIVA') {
                const error = new Error(`A peça com ID ${item.peca_id} não foi encontrada ou está inativa.`);
                error.statusCode = 404;
                throw error;
            }

            servicesValidador.estoqueSuficiente(
                peca.qtd_estoque,
                item.quantidade,
                `Estoque insuficiente para a peça '${peca.nome}'. Disponível: ${peca.qtd_estoque}. Solicitado: ${item.quantidade}`
            );

            const subtotal = Number(peca.preco) * item.quantidade;
            valorTotalPedido += subtotal;

            listaItensProcessados.push({
                peca_id: item.peca_id,
                quantidade: item.quantidade,
                preco_unitario: peca.preco,
                subtotal: subtotal
            });
        }

        const dataFormatada = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' }).split('/').reverse().join('');

        const sufixoAleatorio = crypto.randomBytes(3).toString('hex').toUpperCase();

        const numeroFormatado = `PED-${dataFormatada}-${sufixoAleatorio}`;

        const pedidoPronto = {
            numero: numeroFormatado,
            cliente_id,
            status: 'PENDENTE',
            valor_total: valorTotalPedido
        };

        return await withMappedError(
            () => pedidoRepository.create(pedidoPronto, listaItensProcessados),
            {
                [DbConstraints.PEDIDOS.NUMERO_UNIQUE]: { message: "Colisão de numeração de pedido. Tente enviar novamente.", statusCode: 409 },
                [DbConstraints.PEDIDOS.CLIENTE_FKEY]: { message: "O cliente informado não foi encontrado na base de dados.", statusCode: 400 }
            }
        );
    }

    async listar(filtros) {
        return await pedidoRepository.findAll(filtros);
    }

    async buscarPorId(id) {
        const pedido = await pedidoRepository.findById(id);

        if (!pedido) {
            const error = new Error("Pedido não encontrado.");
            error.statusCode = 404;
            throw error;
        }
        return pedido;
    }

    async atualizarStatus(id, novoStatus) {
        const statusFormatado = novoStatus ? novoStatus.toUpperCase() : '';

        servicesValidador.statusPedidoValido(statusFormatado);

        const pedidoOriginal = await this.buscarPorId(id);

        if (pedidoOriginal.status === statusFormatado) {
            const error = new Error(`O pedido já está com o status ${statusFormatado}.`);
            error.statusCode = 400;
            throw error;
        }

        if (pedidoOriginal.status === 'FINALIZADO' || pedidoOriginal.status === 'CANCELADO') {
            const error = new Error(`Não é permitido alterar o status de um pedido que já está ${pedidoOriginal.status}.`);
            error.statusCode = 400;
            throw error;
        }

        if (statusFormatado === 'FINALIZADO' && pedidoOriginal.status === 'PENDENTE') {
            const error = new Error("Não é permitido finalizar um pedido PENDENTE. Ele precisa ser CONFIRMADO primeiro.");
            error.statusCode = 400;
            throw error;
        }

        if (statusFormatado === 'PENDENTE' && pedidoOriginal.status === 'CONFIRMADO') {
            const error = new Error("Este pedido já foi CONFIRMADO. Você não pode fazê-lo voltar para PENDENTE.");
            error.statusCode = 400;
            throw error;
        }

        if (statusFormatado === 'CANCELADO') {
            await this.#estornarEstoque(pedidoOriginal);
        }

        await pedidoRepository.update(id, {status: statusFormatado});

        return await this.buscarPorId(id);
    }

    async deletar(id) {
        const pedido = await this.buscarPorId(id);

        if (pedido.status === 'CONFIRMADO' || pedido.status === 'FINALIZADO' || pedido.status === 'CANCELADO') {
            const error = new Error(`Não é permitido excluir um pedido com status ${pedido.status}. Apenas rascunhos PENDENTES podem ser excluídos.`);
            error.statusCode = 400;
            throw error;
        }

        if (pedido.status === 'PENDENTE') {
            await this.#estornarEstoque(pedido);
        }

        await pedidoRepository.delete(id);  
    }
}

module.exports = new PedidoService();