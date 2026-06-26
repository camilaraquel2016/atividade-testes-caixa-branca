const categoriaRepository = require("../repositories/categoriaRepository");
const DbErrors = require("../constants/dbErrors");
const DbConstraints = require("../constants/dbConstraints");
const { withMappedError} = require("../utils/errorHelper");

class CategoriaService {

    async criar(nome) {
        return await withMappedError(
            () => categoriaRepository.create(nome),

            {
                [DbConstraints.CATEGORIAS.NOME_UNIQUE]: {message: "Já existe uma categoria cadastrada com este nome.", statusCode: 409}
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
                [DbConstraints.CATEGORIAS.NOME_UNIQUE]: {message: "Já existe outra categoria cadastrada com este nome", statusCode: 409},
            }
        );
    }

    async deletar(id) {
        await this.buscarPorId(id);

        return await withMappedError(
            () => categoriaRepository.delete(id),

            {
                [DbErrors.FOREIGN_KEY_VIOLATION]: {message: "Não é possível deletar uma categoria que possui peças vinculadas" , statusCode: 400}
            }
        );
    }

    async buscarPorId(id) {
        const categoriaEncontrada = await categoriaRepository.findById(id);
   
        if (!categoriaEncontrada) {
            const error = new Error('Categoria não encontrada.');
            error.statusCode = 404;
            throw error;
        }

        return categoriaEncontrada;
    }
}

module.exports = new CategoriaService();