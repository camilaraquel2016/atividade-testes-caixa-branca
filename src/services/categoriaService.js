const categoriaRepository = require("../repositories/categoriaRepository");
const validador = require("../utils/validator");
const DbErrors = require("../constants/dbErrors");
const DbConstraints = require("../constants/dbConstraints");
const { withMappedError} = require("../utils/errorHelper");

class CategoriaService {

    async criar(nome) {
        validador.campoObrigatorio(nome, "O nome da categoria não pode ser nulo ou vazio");

        return await withMappedError(
            () => categoriaRepository.create(nome.trim()),

            {
                [DbConstraints.CATEGORIAS.NOME_UNIQUE]: {message: "Já existe uma categoria cadastrada com este nome.", statusCode: 409}
            }
        );
    }

    async listarTodos() {
        return await categoriaRepository.findAll();
    }

    async atualizar(id, nome) {
        validador.campoObrigatorio(id, "O ID da categoria não pode ser nulo ou vazio.");
        validador.campoObrigatorio(nome, "O novo nome da categoria não pode ser nulo ou vazio");

        await this.buscarPorId(id);

        return await withMappedError(
            () => categoriaRepository.update(id, nome.trim()),

            {
                [DbConstraints.CATEGORIAS.NOME_UNIQUE]: {message: "Já existe outra categoria cadastrada com este nome", statusCode: 409},
            }
        );
    }

    async deletar(id) {
        validador.campoObrigatorio(id, "O ID da categoria é obrigatório");

        await this.buscarPorId(id);

        return await withMappedError(
            () => categoriaRepository.delete(id),

            {
                [DbErrors.FOREIGN_KEY_VIOLATION]: {message: "Não é possível deletar uma categoria que possui peças vinculadas" , statusCode: 400}
            }
        );
    }

    async buscarPorId(id) {
        validador.campoObrigatorio(id, 'O ID de categoria não pode ser nulo ou vazio.');

        const categoriaEncontrada = await  withMappedError(
            () => categoriaRepository.findById(id),

            {
                [DbErrors.INVALID_TEXT_REPRESENTATION]: {message: "ID de categoria informado não é válido", statusCode: 400}
            }
        );
                
        if (!categoriaEncontrada) {
            const error = new Error('Categoria não encontrada.');
            error.statusCode = 404;
            throw error;
        }

        return categoriaEncontrada;
    }
}

module.exports = new CategoriaService();