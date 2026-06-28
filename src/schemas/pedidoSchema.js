const { z } = require("zod");
const { uuidObrigatorio, numeroObrigatorio } = require("./utils");

const itemPedidoSchema = z.object({
    peca_id: uuidObrigatorio("peca_id")
        .uuid("O 'peca_id' informado não é um UUID válido."),
    
    quantidade: numeroObrigatorio("quantidade")
        .int("A 'quantidade' deve ser um número inteiro.")
        .positive("A 'quantidade' deve ser maior que zero.")
});

const pedidoBaseSchema = z.object({
    cliente_id: uuidObrigatorio("cliente_id")
        .uuid("O 'cliente_id' informado não é um UUID válido."),
    
    itens: z.array(itemPedidoSchema, {
    error: (issue) => {
        if (issue.input === undefined) {
            return "O campo 'itens' é obrigatório na criação do pedido.";
        }
        return "O campo 'itens' deve ser enviado no formato de lista (array).";
    }
    })
    .min(1, "Não é possível criar um pedido sem pelo menos um item.")
});

const pedidoPostSchema = pedidoBaseSchema;

const pedidoQuerySchema = z.object({
    status: z.string().optional(),
    cliente_id: z.string().uuid("O 'cliente_id' para filtro deve ser um UUID válido.").optional()
});

module.exports = {
    pedidoPostSchema,
    pedidoQuerySchema
};