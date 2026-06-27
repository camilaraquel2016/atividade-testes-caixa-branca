const categoriaRepository = require("../repositories/categoriaRepository");
const DbErrors = require("../constants/dbErrors");
const DbConstraints = require("../constants/dbConstraints");
const { withMappedError} = require("../utils/errorHelper");

const NotFoundError = require("../exceptions/NotFoundError");
const ConflictError = require("../exceptions/ConflictError");
const BusinessError = require("../exceptions/BusinessError");

class CategoriaService {

    async criar(nome) {
        return await withMappedError(
            () => categoriaRepository.create(nome),

            {
                [DbConstraints.CATEGORIAS.NOME_UNIQUE]: { error: ConflictError, message: "Já existe uma categoria cadastrada com este nome."}
            }
        );
    }

    async listarTodos() {
        return await categoriaRepository.findAll();
    }

    async atualizar(id, nome) {
        await this.buscarPorId(id);

        return await withMappedError(
            () => categoriaRepository.update(id, nome),

            {
                [DbConstraints.CATEGORIAS.NOME_UNIQUE]: { error: ConflictError, message: "Já existe outra categoria cadastrada com este nome"},
            }
        );
    }

    async deletar(id) {
        await this.buscarPorId(id);

        return await withMappedError(
            () => categoriaRepository.delete(id),

            {
                [DbErrors.FOREIGN_KEY_VIOLATION]: { error: BusinessError, message: "Não é possível deletar uma categoria que possui peças vinculadas"}
            }
        );
    }

    async buscarPorId(id) {
        const categoriaEncontrada = await categoriaRepository.findById(id);
   
        if (!categoriaEncontrada) {
            throw new NotFoundError("Categoria não encontrada.");
        }

        return categoriaEncontrada;
    }
}

module.exports = new CategoriaService();