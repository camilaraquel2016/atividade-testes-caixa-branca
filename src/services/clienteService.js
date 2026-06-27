const clienteRepository = require("../repositories/clienteRepository");
const DbErrors = require("../constants/dbErrors");
const DbConstraints = require("../constants/dbConstraints");
const { withMappedError } = require("../utils/errorHelper");

const NotFoundError = require("../exceptions/NotFoundError");
const ConflictError = require("../exceptions/ConflictError");
const BusinessError = require("../exceptions/BusinessError");


class ClienteService {

    async criar(dadosCliente) {

        return await withMappedError(
            () => clienteRepository.create(dadosCliente),
            {
                [DbConstraints.CLIENTES.CPF_UNIQUE]: { error: ConflictError, message: "Já existe um cliente cadastrado com este CPF." },

                [DbConstraints.CLIENTES.TELEFONE_UNIQUE]: { error: ConflictError, message: "Já existe um cliente cadastrado com este telefone." }
            }
        );
    }

    async listar(filtros) {
        return await clienteRepository.findAll(filtros);
    }

    async buscarPorId(id) {
        const cliente = await clienteRepository.findById(id)

        if (!cliente) {
            throw new NotFoundError("Cliente não encontrado.");
        }

        return cliente;
    }

    async atualizar(id, dadosCliente) {
        const clienteOriginal = await this.buscarPorId(id);

        if (dadosCliente.cpf && dadosCliente.cpf !== clienteOriginal.cpf) {
            throw new BusinessError("Não é permitido alterar o CPF de um cliente cadastrado.");
        }

        const clienteAlterado = {...clienteOriginal, ...dadosCliente};

        return await withMappedError(
            () => clienteRepository.update(id, clienteAlterado),
            {
                [DbConstraints.CLIENTES.TELEFONE_UNIQUE]: { error: ConflictError, message: "Já existe outro cliente cadastrado com este telefone." }
            }
        );
    }

    async deletar(id) {

        await this.buscarPorId(id);

        return await withMappedError(
            () => clienteRepository.delete(id),
            {
                [DbErrors.FOREIGN_KEY_VIOLATION]: { error: BusinessError, message: "Não é possível deletar um cliente que possui pedidos vinculados."}
            }
        );
    }
}

module.exports = new ClienteService();