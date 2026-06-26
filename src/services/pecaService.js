const pecaRepository = require('../repositories/pecaRepository');
const DbErrors = require('../constants/dbErrors');
const categoriaService = require('./categoriaService');
const { withMappedError } = require('../utils/errorHelper');
const DbConstraints = require('../constants/dbConstraints');

class PecaService {

    async criar(peca) {
        const {codigo, nome, qtd_estoque, preco, categoria_id} = peca;

        await categoriaService.buscarPorId(categoria_id); 

        return await withMappedError(
            () => pecaRepository.create(peca),

            {
                [DbConstraints.PECAS.CODIGO_UNIQUE]: { message : "Já existe uma peça cadastrada com esse código", statusCode: 409}
            }
        );
    }

    async listarTodas(filtros) {
        return await pecaRepository.findAll(filtros);
    }

    async buscarPorId(id) {
        const pecaEncontrada = await pecaRepository.findById(id);

        if (!pecaEncontrada) {
            const erro = new Error("Peça não encontrada");
            erro.statusCode = 404;
            throw erro;
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
                [DbConstraints.PECAS.CODIGO_UNIQUE]: {message: "Não é possível atualizar peça para esse código pois ele já está em uso por outra peça", statusCode: 409}
            }
        )
    }

    async deletar(id) {
 
        await this.buscarPorId(id);

        return await withMappedError(
            () => pecaRepository.delete(id),
            
            {
                [DbErrors.FOREIGN_KEY_VIOLATION]: { 
                    message: "Não é possível deletar uma peça que possui pedidos vinculados.", 
                    statusCode: 400 
                }
            }
        );
    }   
}

module.exports = new PecaService();