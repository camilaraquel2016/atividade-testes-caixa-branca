const clienteRepository = require("../repositories/clienteRepository");
const validador = require("./servicesValidator");
const DbErrors = require("../constants/dbErrors");
const DbConstraints = require("../constants/dbConstraints");
const { withMappedError } = require("../utils/errorHelper");

class ClienteService {

    async criar(dadosCliente) {

        return await withMappedError(
            () => clienteRepository.create(dadosCliente),
            {
                [DbConstraints.CLIENTES.CPF_UNIQUE]: { message: "Já existe um cliente cadastrado com este CPF.", statusCode: 409 },
                [DbConstraints.CLIENTES.TELEFONE_UNIQUE]: { message: "Já existe um cliente cadastrado com este telefone.", statusCode: 409 }
            }
        );
    }

    async listar(filtros) {
        return await clienteRepository.findAll(filtros);
    }

    async buscarPorId(id) {

        const cliente = await clienteRepository.findById(id)

        if (!cliente) {
            const error = new Error("Cliente não encontrado.");
            error.statusCode = 404;
            throw error;
        }

        return cliente;
    }

    async atualizar(id, dadosCliente) {

        const clienteOriginal = await this.buscarPorId(id);


        if (dadosCliente.cpf && dadosCliente.cpf !== clienteOriginal.cpf) {
            const error = new Error("Não é permitido alterar o CPF de um cliente cadastrado.");
            error.statusCode = 400;
            throw error;
        }

        const clienteAlterado = {
            nome: dadosCliente.nome !== undefined ? dadosCliente.nome : clienteOriginal.nome,
            telefone: dadosCliente.telefone !== undefined ? dadosCliente.telefone : clienteOriginal.telefone
        };

        return await withMappedError(
            () => clienteRepository.update(id, clienteAlterado),
            {
                [DbConstraints.CLIENTES.TELEFONE_UNIQUE]: { message: "Já existe outro cliente cadastrado com este telefone.", statusCode: 409 }
            }
        );
    }

    async deletar(id) {

        await this.buscarPorId(id);

        return await withMappedError(
            () => clienteRepository.delete(id),
            {
                [DbErrors.FOREIGN_KEY_VIOLATION]: { message: "Não é possível deletar um cliente que possui pedidos vinculados.", statusCode: 400 }
            }
        );
    }
}

module.exports = new ClienteService();