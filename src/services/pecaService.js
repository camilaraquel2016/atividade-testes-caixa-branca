const pecaRepository = require('../repositories/pecaRepository');
const validador = require('../utils/validator');
const DbErrors = require('../constants/dbErrors');
const categoriaService = require('./categoriaService');

class PecaService {

    async criar(peca) {
        const {codigo, nome, qtd_estoque, preco, categoria_id} = peca;

        validador.campoObrigatorio(codigo, "O campo 'código' não pode ser nulo ou vazio");
        validador.campoObrigatorio(nome, "O campo 'nome' não pode ser nulo ou vazio");
        validador.campoObrigatorio(qtd_estoque, "O campo 'qtd_estoque' não pode ser nulo ou vazio");
        validador.campoObrigatorio(preco, "O campo 'preco' não pode ser nulo ou vazio");
        validador.campoObrigatorio(categoria_id, "O campo 'categoria_id' não pode ser nulo ou vazio");

        validador.precoValido(preco, 'O preço deve ser maior que zero');
        validador.estoqueValido(qtd_estoque, 'A quantidade em estoque deve ser maior ou igual a zero');

        await categoriaService.buscarPorId(categoria_id); 
        
        try {
            return await pecaRepository.create(peca);
        } catch (e) {
            
            if (e.code === DbErrors.UNIQUE_VIOLATION) {
                const error = new Error("Já existe uma peça cadastrada com esse código");
                error.statusCode = 409;
                throw error;
            }

            throw e;
        }
    }

    async listarTodas(filtros) {
        return await pecaRepository.findAll(filtros);
    }

    async buscarPorId(id) {
        validador.campoObrigatorio(id, 'O ID de peça não pode ser nulo ou vazio');

        try {
            const pecaEncontrada = await pecaRepository.findById(id);

            if (!pecaEncontrada) {
                const erro = new Error("Peça não encontrada");
                erro.statusCode = 404;
                throw erro;
            }

            return pecaEncontrada;
        } catch(e) {

            if (e.statusCode) throw e;

            if (e.code == DbErrors.INVALID_TEXT_REPRESENTATION) {
                const error = new Error('ID informado não é válido');
                error.statusCode = 400;
                throw error;
            }

            throw e;
        }
    }

    async atualizar(id, dadosNovos) {
        const pecaOriginal = await this.buscarPorId(id);

        if (dadosNovos.preco !== undefined) {
            validador.precoValido(dadosNovos.preco, "O preço deve ser um número maior que zero");
        }
        if (dadosNovos.qtd_estoque !== undefined) {
            validador.estoqueValido(dadosNovos.qtd_estoque, "A quantidade em estoque deve ser maior ou igual a zero");
        }

        if (dadosNovos.situacao !== undefined) {
            dadosNovos.situacao = dadosNovos.situacao.toUpperCase();
            validador.situacaoValida(dadosNovos.situacao, "A situação deve ser apenas 'ATIVA' ou 'INATIVA'");
        }

        const pecaAlterada = {
            codigo: dadosNovos.codigo !== undefined ? dadosNovos.codigo : pecaOriginal.codigo,
            nome: dadosNovos.nome !== undefined ? dadosNovos.nome : pecaOriginal.nome,
            qtd_estoque: dadosNovos.qtd_estoque !== undefined ? dadosNovos.qtd_estoque : pecaOriginal.qtd_estoque,
            preco: dadosNovos.preco !== undefined ? dadosNovos.preco : pecaOriginal.preco,
            categoria_id: dadosNovos.categoria_id !== undefined ? dadosNovos.categoria_id : pecaOriginal.categoria_id,
            situacao: dadosNovos.situacao !== undefined ? dadosNovos.situacao : pecaOriginal.situacao
        }

        if (dadosNovos.categoria_id !== undefined) {
            await categoriaService.buscarPorId(dadosNovos.categoria_id);
        }

        try {
            return await pecaRepository.update(id, pecaAlterada);
        } catch (e) {
            if (e.code === DbErrors.UNIQUE_VIOLATION) {
                const error = new Error("Não é possível atualizar peça para esse código pois ele já está em uso por outra peça");
                error.statusCode = 409;
                throw error;
            }

            throw e;
        }
    }

    async deletar(id) {
        validador.campoObrigatorio(id, "O ID da peça é obrigatório");

        try {
            await this.buscarPorId(id);

            return await pecaRepository.delete(id);
        }
        catch (e) {
            if (e.statusCode) throw e;

            if (e.code === DbErrors.FOREIGN_KEY_VIOLATION) {
                const error = new Error("Não é possível deletar uma peça que possui pedidos vinculados.");
                error.statusCode = 400;
                throw error;
            }
        }
        
        throw e;
    }
}

module.exports = new PecaService();