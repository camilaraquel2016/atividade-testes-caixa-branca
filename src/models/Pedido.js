class Pedido{
    constructor({ id, numero, cliente_id, status, valor_total, criado_em, itens}){
        this.id = id;
        this.numero = numero;
        this.cliente_id = cliente_id;
        this.status = status;
        this.valor_total = valor_total;
        this.criado_em = criado_em;
        this.itens = itens || [];
    }
}

module.exports = Pedido;