class Peca {
    constructor({id, codigo, nome, qtd_estoque, preco, categoria_id, situacao, criado_em}) {
        this.id = id;
        this.codigo = codigo;
        this.nome = nome;
        this.qtd_estoque = qtd_estoque;
        this.preco = preco;
        this.categoria_id = categoria_id;
        this.situacao = situacao;
        this.criado_em = criado_em;
    }
}

module.exports = Peca;