const categoriaRepository = require("../repositories/categoriaRepository");
const validador = require("../utils/validator");
const DbErrors = require("../constants/dbErrors");

class CategoriaService {

    async criar(nome) {
        validador.campoObrigatorio(nome, "O nome da categoria não pode ser nulo ou vazio");

        try {
            return await categoriaRepository.create(nome.trim());
        } catch (dbError) {
            if (dbError.code === DbErrors.UNIQUE_VIOLATION) {
                const error = new Error("Já existe uma categoria cadastrada com este nome.");
                error.statusCode = 409;
                throw error;
            }
            throw dbError;
        }
    }

    async listarTodos() {
        return await categoriaRepository.findAll();
    }

    async atualizar(id, nome) {
        validador.campoObrigatorio(id, "O ID da categoria não pode ser nulo ou vazio.");
        validador.campoObrigatorio(nome, "O novo nome da categoria não pode ser nulo ou vazio");

        try {
            const categoria = await categoriaRepository.findById(id);
            if (!categoria) {
                const error = new Error("Categoria não encontrada.");
                error.statusCode = 404;
                throw error;
            }

            return await categoriaRepository.update(id, nome.trim());
        } catch (dbError) {
            if (dbError.statusCode) throw dbError;

            if (dbError.code === DbErrors.UNIQUE_VIOLATION) {
                const error = new Error("Já existe outra categoria cadastrada com este nome");
                error.statusCode = 409;
                throw error;
            }

            if (dbError.code === DbErrors.INVALID_TEXT_REPRESENTATION) {
                const error = new Error("Categoria informada não é válida");
                error.statusCode = 400;
                throw error;
            }

            throw dbError;
        }
    }

    async deletar(id) {
        validador.campoObrigatorio(id, "O ID da categoria é obrigatório");

        try {
            const categoria = await categoriaRepository.findById(id);
            if (!categoria) {
                const error = new Error("Categoria não encontrada");
                error.statusCode = 404;
                throw error;
            }

            return await categoriaRepository.delete(id);
        } catch (dbError) {
            if (dbError.statusCode) throw dbError;

            if (dbError.code === DbErrors.FOREIGN_KEY_VIOLATION) {
                const error = new Error("Não é possível deletar uma categoria que possui peças vinculadas.");
                error.statusCode = 400;
                throw error;
            }

            if (dbError.code === DbErrors.INVALID_TEXT_REPRESENTATION) {
                const error = new Error("Categoria informada não é válida");
                error.statusCode = 400;
                throw error;
            }

            throw dbError;
        }
    }

    async buscarPorId(id) {
      validador.campoObrigatorio(id, 'O ID de categoria não pode ser nulo ou vazio.');

      try {

        const categoriaEncontrada = await categoriaRepository.findById(id);

        if (!categoriaEncontrada) {
          const error = new Error('Categoria não encontrada.');
          error.statusCode = 404;
          throw error;
        }

        return categoriaEncontrada;
      }
      catch (dbError) {

        if (dbError.statusCode) throw dbError;
        
        if (dbError.code === DbErrors.INVALID_TEXT_REPRESENTATION) {
          const error = new Error('ID informado não é válido');
          error.statusCode = 400;
          throw error;
        }

        throw dbError;
      }
    }
}

module.exports = new CategoriaService();