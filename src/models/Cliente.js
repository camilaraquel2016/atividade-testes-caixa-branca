class Cliente {
    constructor(data) {
        this.id = data.id;
        this.nome = data.nome;
        this.cpf = data.cpf;
        this.telefone = data.telefone;
        this.criado_em = data.criado_em;
    }
}

module.exports = Cliente;