const pedidoRepository = require('../repositories/pedidoRepository');
const pecaService = require('./pecaService');
const servicesValidador = require('./servicesValidator');
const crypto = require('crypto');
const DbConstraints = require("../constants/dbConstraints");
const { withMappedError } = require("../utils/errorHelper");

const clienteService = require('./clienteService');

const NotFoundError = require('../exceptions/NotFoundError');
const BusinessError = require('../exceptions/BusinessError');
const ConflictError = require('../exceptions/ConflictError');

class PedidoService {

    validarTransicaoStatus(statusAtual, novoStatus) {
        const statusValidos = ['PENDENTE', 'CONFIRMADO', 'FINALIZADO', 'CANCELADO'];
        const statusFormatado = novoStatus ? novoStatus.toUpperCase() : '';

        if (!statusValidos.includes(statusFormatado)) {
            throw new BusinessError('Status informado é inválido.');
        }
        
        if (statusAtual === statusFormatado) {
            throw new BusinessError(`O pedido já está com o status ${statusFormatado}.`);
        }

        if (statusAtual === 'FINALIZADO' || statusAtual === 'CANCELADO') {
            throw new BusinessError(`Não é permitido alterar o status de um pedido que já está ${statusAtual}.`);
        }

        if (statusFormatado === 'FINALIZADO' && statusAtual === 'PENDENTE') {
            throw new BusinessError("Não é permitido finalizar um pedido PENDENTE. Ele precisa ser CONFIRMADO primeiro.");
        }

        if (statusFormatado === 'PENDENTE' && statusAtual === 'CONFIRMADO') {
            throw new BusinessError("Este pedido já foi CONFIRMADO. Você não pode fazê-lo voltar para PENDENTE.");
        }

        return statusFormatado;
    }

    async #estornarEstoque(pedido) {
        for (const item of pedido.itens) {
            const peca = await pecaService.buscarPorId(item.peca_id);

            const novoEstoque = peca.qtd_estoque + item.quantidade;

            await pecaService.atualizar(item.peca_id, { qtd_estoque: novoEstoque });
        }
    }

    async criar(dadosPedido) {
        const { cliente_id, itens } = dadosPedido;

        await clienteService.buscarPorId(cliente_id);

        const itensUnificados = itens.reduce((acc, item) => {
            if (acc.has(item.peca_id)) {
                acc.get(item.peca_id).quantidade += item.quantidade;
            } else {
                acc.set(item.peca_id, { ...item });
            }
            return acc;
        }, new Map());

        const listaFinal = Array.from(itensUnificados.values());

        let valorTotalPedido = 0;
        const listaItensProcessados = [];

        for (const item of listaFinal) {
           
            const peca = await pecaService.buscarPorId(item.peca_id);

            if (peca.situacao === 'INATIVA') {
                throw new BusinessError(`A peça com ID ${item.peca_id} está inativa`);
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
                [DbConstraints.PEDIDOS.NUMERO_UNIQUE]: { error: ConflictError, message: "Colisão de numeração de pedido. Tente enviar novamente." },

                [DbConstraints.PEDIDOS.CLIENTE_FKEY]: { error: NotFoundError, message: "O cliente informado não foi encontrado na base de dados." }
            }
        );
    }

    async listar(filtros) {
        return await pedidoRepository.findAll(filtros);
    }

    async buscarPorId(id) {
        const pedido = await pedidoRepository.findById(id);

        if (!pedido) {
            throw new NotFoundError("Pedido não encontrado")
        }

        return pedido;
    }

    async atualizarStatus(id, novoStatus) {
        const pedidoOriginal = await this.buscarPorId(id);

        const statusFormatado = PedidoService.validarTransicaoStatus(pedidoOriginal.status, novoStatus);

        if (statusFormatado === 'CANCELADO') {
            await this.#estornarEstoque(pedidoOriginal);
        }

        await pedidoRepository.update(id, {status: statusFormatado});

        return await this.buscarPorId(id);
    }

    async deletar(id) {
        const pedido = await this.buscarPorId(id);

        if (pedido.status === 'CONFIRMADO' || pedido.status === 'FINALIZADO' || pedido.status === 'CANCELADO') {
            throw new BusinessError(`Não é permitido excluir um pedido com status ${pedido.status}. Apenas rascunhos PENDENTES podem ser excluídos.`);
        }

        if (pedido.status === 'PENDENTE') {
            await this.#estornarEstoque(pedido);
        }

        await pedidoRepository.delete(id);  
    }
}

module.exports = new PedidoService();