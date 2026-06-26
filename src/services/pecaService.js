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

        const pecaAlterada = {
            codigo: dadosNovos.codigo !== undefined ? dadosNovos.codigo : pecaOriginal.codigo,
            nome: dadosNovos.nome !== undefined ? dadosNovos.nome : pecaOriginal.nome,
            qtd_estoque: dadosNovos.qtd_estoque !== undefined ? dadosNovos.qtd_estoque : pecaOriginal.qtd_estoque,
            preco: dadosNovos.preco !== undefined ? dadosNovos.preco : pecaOriginal.preco,
            categoria_id: dadosNovos.categoria_id !== undefined ? dadosNovos.categoria_id : pecaOriginal.categoria_id,
            situacao: dadosNovos.situacao !== undefined ? dadosNovos.situacao : pecaOriginal.situacao
        }

        return await withMappedError(
            () => pecaRepository.update(id, pecaAlterada),

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