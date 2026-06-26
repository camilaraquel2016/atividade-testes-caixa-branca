class Cliente {
    constructor({ id, nome, cpf, telefone, criado_em}) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.criado_em = criado_em;
    }
}

module.exports = Cliente;