const pecaRepository = require('../repositories/pecaRepository');
const DbErrors = require('../constants/dbErrors');
const categoriaService = require('./categoriaService');
const { withMappedError } = require('../utils/errorHelper');
const DbConstraints = require('../constants/dbConstraints');

const NotFoundError = require("../exceptions/NotFoundError");
const ConflictError = require("../exceptions/ConflictError");
const BusinessError = require("../exceptions/BusinessError");

class PecaService {

    async criar(peca) {
        await categoriaService.buscarPorId(peca.categoria_id); 

        return await withMappedError(
            () => pecaRepository.create(peca),

            {
                [DbConstraints.PECAS.CODIGO_UNIQUE]: {error: ConflictError, message : "Já existe uma peça cadastrada com esse código"}
            }
        );
    }


    async listarTodas(filtros) {
        return await pecaRepository.findAll(filtros);
    }


    async buscarPorId(id) {
        const pecaEncontrada = await pecaRepository.findById(id);

        if (!pecaEncontrada) {
            throw new NotFoundError("Peça não encontrada");
        }

        return pecaEncontrada;
    }


    async atualizar(id, dadosNovos) {
        const pecaOriginal = await this.buscarPorId(id);

        if (dadosNovos.categoria_id !== undefined) {
            await categoriaService.buscarPorId(dadosNovos.categoria_id);
        }

        if (dadosNovos.situacao !== undefined) {
            dadosNovos.situacao = dadosNovos.situacao.toUpperCase();
        }

        const pecaAtualizada = {...pecaOriginal,...dadosNovos};

        return await withMappedError(
            () => pecaRepository.update(id, pecaAtualizada),

            {
                [DbConstraints.PECAS.CODIGO_UNIQUE]: {error: ConflictError, message: "Não é possível atualizar peça para esse código pois ele já está em uso por outra peça"}
            }
        )
    }

    async deletar(id) {
        await this.buscarPorId(id);

        return await withMappedError(
            () => pecaRepository.delete(id),
            
            {
                [DbErrors.FOREIGN_KEY_VIOLATION]: {error: BusinessError,
                    message: "Não é possível deletar uma peça que possui pedidos vinculados." 
                }
            }
        );
    }   
}

module.exports = new PecaService();