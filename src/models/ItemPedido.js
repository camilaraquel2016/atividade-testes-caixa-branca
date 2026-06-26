class ItemPedido{
    constructor({ id, pedido_id, peca_id, peca_nome, quantidade, preco_unitario, subtotal }){
        this.id = id;
        this.pedido_id = pedido_id;
        this.peca_id = peca_id;
        this.quantidade = quantidade;
        this.preco_unitario = preco_unitario;
        this.subtotal = subtotal;

        if(peca_nome){
            this.peca_nome = peca_nome;
        }
    }
}

module.exports = ItemPedido;