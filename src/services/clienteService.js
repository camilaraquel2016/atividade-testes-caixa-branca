const clienteRepository = require("../repositories/clienteRepository");
const pedidoRepository = require("../repositories/pedidoRepository"); 
const validador = require("../utils/validator");
const DbErrors = require("../constants/dbErrors");

class ClienteService {

    async criar(dadosCliente) {
        const { nome, cpf, telefone } = dadosCliente;

        validador.campoObrigatorio(nome, "O nome do cliente não pode ser nulo ou vazio");
        validador.campoObrigatorio(cpf, "O CPF do cliente não pode ser nulo ou vazio");
        validador.campoObrigatorio(telefone, "O telefone do cliente não pode ser nulo ou vazio");

        validador.validarCpf(cpf, "CPF Formatado incorretamente. Use 11 dígitos ou o padrão XXX.XXX.XXX-XX");
        validador.validarTelefone(telefone, "Telefone inválido. Insira o DDD seguido do número.");

        try {
            return await clienteRepository.create({
                nome: nome.trim(),
                cpf: cpf.trim(),
                telefone: telefone.trim()
            });
        } catch (dbError) {
            if (dbError.code === DbErrors.UNIQUE_VIOLATION) {
                const msg = dbError.detail.includes("cpf") 
                    ? "Já existe um cliente cadastrado com este CPF."
                    : "Já existe um cliente cadastrado com este telefone.";
                
                const error = new Error(msg);
                error.statusCode = 409;
                throw error;
            }
            throw dbError;
        }
    }

    async listar(filtros) {
        return await clienteRepository.findAll(filtros);
    }

    async buscarPorId(id) {
        validador.campoObrigatorio(id, "O ID do cliente é obrigatório.");

        try {
            const cliente = await clienteRepository.findById(id);
            if (!cliente) {
                const error = new Error("Cliente não encontrado.");
                error.statusCode = 404;
                throw error;
            }
            return cliente;
        } catch (dbError) {
            if (dbError.statusCode) throw dbError;

            if (dbError.code === DbErrors.INVALID_TEXT_REPRESENTATION) {
                const error = new Error("O ID do cliente informado não é um formato válido.");
                error.statusCode = 400;
                throw error;
            }
            throw dbError;
        }
    }

    async atualizar(id, dadosCliente) {
        const { nome, telefone, cpf } = dadosCliente;

        validador.campoObrigatorio(id, "O ID do cliente não pode ser nulo ou vazio.");
        validador.campoObrigatorio(nome, "O novo nome do cliente não pode ser nulo ou vazio");
        validador.campoObrigatorio(telefone, "O novo telefone do cliente não pode ser nulo ou vazio");

        validador.validarTelefone(telefone, "Telefone inválido. Insira o DDD seguido do número.");
        try {
            const cliente = await clienteRepository.findById(id);
            if (!cliente) {
                const error = new Error("Cliente não encontrado.");
                error.statusCode = 404;
                throw error;
            }

            if (cpf && cpf.trim() !== cliente.cpf) {
                const error = new Error("Não é permitido alterar o CPF de um cliente cadastrado.");
                error.statusCode = 400;
                throw error;
            }

            return await clienteRepository.update(id, {
                nome: nome.trim(),
                telefone: telefone.trim()
            });
        } catch (dbError) {
            if (dbError.statusCode) throw dbError;

            if (dbError.code === DbErrors.UNIQUE_VIOLATION) {
                const error = new Error("Já existe outro cliente cadastrado com este telefone.");
                error.statusCode = 409;
                throw error;
            }

            if (dbError.code === DbErrors.INVALID_TEXT_REPRESENTATION) {
                const error = new Error("O ID do cliente informado não é um formato válido.");
                error.statusCode = 400;
                throw error;
            }
            throw dbError;
        }
    }

    async deletar(id) {
        validador.campoObrigatorio(id, "O ID do cliente é obrigatório");

        try {
            const cliente = await clienteRepository.findById(id);
            if (!cliente) {
                const error = new Error("Cliente não encontrado");
                error.statusCode = 404;
                throw error;
            }

            return await clienteRepository.delete(id);
        } catch (dbError) {
            if (dbError.statusCode) throw dbError;

            if (dbError.code === DbErrors.INVALID_TEXT_REPRESENTATION) {
                const error = new Error("O ID do cliente informado não é um formato válido.");
                error.statusCode = 400;
                throw error;
            }
            throw dbError;
        }
    }
}

module.exports = new ClienteService();