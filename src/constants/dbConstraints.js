module.exports = {
    PECAS: {
        CODIGO_UNIQUE: 'pecas_codigo_key',
        CATEGORIA_FKEY: 'pecas_categoria_id_fkey'
    },

    CATEGORIAS: {
        NOME_UNIQUE: 'categorias_nome_key'
    },

    CLIENTES: {
        CPF_UNIQUE: 'clientes_cpf_key',
        TELEFONE_UNIQUE: 'clientes_telefone_unique'
    },

    PEDIDOS: {
        NUMERO_UNIQUE: 'pedidos_numero_key',    
        CLIENTE_FKEY: 'pedidos_cliente_id_fkey'  
    }
}; 